// @ts-ignore
import {oReduce} from './utils/oreduce';
import axios from 'axios';

//----- reducers and actions ----
// reason to combine a console statement has to do with exceptions thrown while just loading a module
// making reading the causing exception completely unreliable in the log until that pattern is fixed
function throwIt(s:string, err?:Error)
{
  const error = err ?? new Error(s);
  // console.error(error);  // guarantee it is reported in the log during loading process
  // alert(s);
  throw(error);
}

// after finding that subslices were an unbalanced source of creators / reducers (the pairs did go together)
// validate and throw an error
type srec = Record<string, unknown>; // temp type for for object with string keys
type crCompareObj = { creator: boolean; reducer: boolean };
type crComparison = Record<string, crCompareObj>;


interface hit {key: string; count:number;}

const always:Record<string,hit> = {};
const sometimes:Record<string,hit> =  {};

const bookHit = (key:string, good:boolean) => {

  let hit = sometimes[key];
  if(hit) {
    ++hit.count;
    return;
  }

  hit = always[key];
  if(hit) {
    ++hit.count;
    if(!good) {
      delete always[key];
      sometimes[key] = hit;
    }
    return;
  }

  hit = {key, count:1};
  if(good) {
    always[key] = hit;
  } else {
    sometimes[key] = hit;
  }

}


function compareKeys (a: srec, b: srec): [number, crComparison]  {

  const allKeys = Object.keys({ ...a, ...b }).sort();
  let errorCount = 0;
  const map = oReduce(allKeys, (k: string) => {
    const creator = a.hasOwnProperty(k);
    const reducer = b.hasOwnProperty(k);
    const mismatch = creator !== reducer;
    if (mismatch) {
      ++errorCount;
      bookHit(k,false);
      return [`${k}`, {...(creator && {creator}), ...(reducer && {reducer})}];
    } else {
      bookHit(k,true);
      return [`good ${k}`, {...(creator && {creator}), ...(reducer && {reducer})}];
    }
    // return ['//',1]; // hack to consolidate "good" results, to delete
  });
  delete map['//'];    // remove, so only mismatched keys remain

  // only if there is no error bother to check about the order of the keys, they should be the same also

  // if(!errorCount) {
  //   const ak = Object.keys(a);
  //   const bk = Object.keys(b);
  //   const allMatches = ak.every((key,index)=>{
  //     const matches = bk[index]===key;
  //     if(!matches)
  //       console.error(`key ${key} is not at same index for both creator/reducer`)
  //     return matches
  //   });
  //   if(!allMatches) {
  //     console.error(allMatches);
  //     return [ak.length, map];
  //   }
  // }

  return [errorCount, map];
}


function compareAb(index:number, a:srec, b:srec) {

    const [errorCount, comparison] = compareKeys(a,b);

    if (errorCount) {
      const errmsg = `[${index}] has ${errorCount} discrepancies between objects`;
      console.table(comparison);
      console.error(errmsg);
    }
}



const profiles:any = [];
const followers:any = [];
const following:any = [];


export function fetchFollowersAndFollowing(list:srec[])
{
  //@ts-ignore
  window.zzfollowers = followers;

  //@ts-ignore
  window.zzfollowing = following;

  list.forEach((rec,index)=>{
    const userId = rec._id;
    axios.get(`http://localhost:3000/api/v1/users/followers?userId=${userId}&limit=1000`).then((resp)=>{
      const {data=null, status} = resp;
      followers.push({userId, status, data});
    }).catch((err)=>{
      console.error(`!!! [${index}] Exception`, err);
      followers.push({userId, err})
    });

  })


  list.forEach((rec,index)=>{
    const userId = rec._id;
    axios.get(`http://localhost:3000/api/v1/users/following?userId=${userId}&limit=1000`).then((resp)=>{
      const {data=null, status} = resp;
      following.push({userId, status, data});
    }).catch((err)=>{
      console.error(`!!! [${index}] Exception`, err);
      following.push({userId, err})
    });

  })


}


export function fetchProfiles(list:srec[])
{
  //@ts-ignore
  window.zzprofiles = profiles;

  list.forEach((rec,index)=>{
    const userId = rec._id;
    axios.get(`http://localhost:3000/api/v1/users/${userId}/profile`, ).then((resp)=>{
      const {data=null, status} = resp;
      profiles.push({userId, status, data});
    }).catch((err)=>{
      console.error(`!!! [${index}] Exception`, err);
      profiles.push({userId, err})
    });

  })

}


export function compareList(list:srec[])
{
    const src  = list[0]
    list.slice(1).forEach((dest, index)=>compareAb(index+1, src,dest));

    console.warn(`These keys are always present`, Object.keys(always));
  console.table(always);
  console.table(sometimes);


  fetchFollowersAndFollowing(list);

}


