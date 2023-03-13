import {oReduce} from '../utils/oreduce';

type Kind = 'patch'|'pref'|'version'|'filter';
// todos move the date and the write through to middleware layer that does that stuff, so
// functions are pure and we can backtrack correctly, etc.

// prevent collisions with second copy of same page loaded in browser
// one strategy is to check prior to write-through if  modifications by another tab when saving, and then
// it would help to generate unique ids for any actually new item created, so we can recognize common ancestry of items
// merging in anything found, or notifying user to decide whether to overwrite data from other tab session?
// stuff like filters actually could be unique per session?
// or maybe generate a modal error, as long as there is evidence of two app instances?

type Entry = {
  kind:       Kind;
  name:       string;
  updated:    number;
  comments:   string;
  data:       any;
  keys?: number;       // only applicable where data is a Record type, (as in patches) but filters are strings, etc.
}

export type StorageBall = Record<string, Entry>;



export type PatchState = {
  cache:StorageBall;  // PatchState is a misnomer, since it contains other types of data like prefs
  patches:Entry[];    // these are entries that are patches, and that match the filter (interesting, a rename or saveas could cause the filter to 'disappear')
  filter:string;     // filter for patches
}

type PatchCreator = (s:PatchState,...rest: any)=>unknown;
type PatchCreators = Record<string, PatchCreator>;
type PatchReducer = (s:PatchState,...rest: any)=>PatchState;
type PatchReducers = Record<string, PatchReducer>;

interface SliceConfig {
  name: string;
  reducers: PatchReducers;
  creators: PatchCreators;
  initialState: PatchState;
}

// lists of reserved names for 'special' uneditable patch names, and reserved names for all storage keys
const specialPatchNames:Record<string,1> = {current:1, default:1};
const allSpecialNames:Record<string,1>  = { ...specialPatchNames, version:1, preferences:1, filter:1}

export function isSpecialName(s:string):boolean
{
  return allSpecialNames[s] !== undefined;
}

export function isSpecialPatchName(s:string):boolean
{
  return specialPatchNames[s] !== undefined;
}

function convertStorageToCache():StorageBall
{
  // todo sanitize nonconforming objects in local storage and quarantine that data rather than throw an exception
  // test every key to make sure the data looks correct, and fixup local storage to reflect good stuf
  let cache = oReduce(Object.entries({...localStorage}), ([k,v]:[string, string])=>{
    const vv = JSON.parse(v);
    if(typeof vv.data === 'object')
      vv.keys = Object.keys(vv.data).length;

    return [k,vv];
  }, {})

  // create minimal data if missing, such as a starting text fil  ter
  if(cache?.filter === undefined)
    cache = saveAny(cache, '','', 'filter', 'filter');

  return cache;
}

//!! todo two or more instances of the web application could knock the write-through cache completely out of wack
// it needs to be protected

function patchFilter(cache:StorageBall, filterText:string):Entry[]
{
  return Object.values(cache).filter(e=>e.kind === 'patch' && (e.name.includes(filterText) || e.comments.includes(filterText)))
}

function filterText(cache:StorageBall)
{
  return cache?.filter?.data || '';
}

function saveAny(cache:StorageBall, data:any, comments:string, name:string, kind:Kind):StorageBall
{
  const updated = Date.now();       // we need the current time  todo this is not a pure function, antithetical to playback, should be done by middleware
  const keys =     (typeof data === 'object')? Object.keys(data).length: undefined;
  // compounding issue that we are persisting the results

  const entry:Entry = {kind, name, comments, data, keys, updated};
  localStorage.setItem(name,JSON.stringify(entry));           // write it through to storage
  return {...cache, [name]:entry}

}
function savePatch(cache:StorageBall, patch:any, comments:string, name:string):StorageBall
{
  return saveAny(cache, patch, comments, name, 'patch');
}
function savePatchState(ocache:StorageBall, patch:any, comments:string, name:string):PatchState
{
  const filter  = filterText(ocache);
  const cache   = savePatch(ocache, patch, comments, name);
  const patches = patchFilter(cache, filter);
  return {cache, patches, filter};
}


const cache     = convertStorageToCache();
const patches   = patchFilter(cache, '');
const filter    = filterText(cache);
const initialState:PatchState = {
  cache,
  patches,
  filter
};




// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:PatchCreators = {
  delete:(name)=>({name}),
  save:(name, comments, data) =>({name,comments,data}),
  saveAsUnnamed:(data)=>({data}),
  saveCopyAs: (name, asName) => ({name, asName}),
  rename: (name, asName)=>({name,asName}),
  saveFilter:(text)=>({text}),
  mirrorOtherInstance:(key, oldValue, newValue)=>({key, oldValue, newValue})  // another instance modified local storage
};

const reducers:PatchReducers = {
  delete:(s, {name}) => {
    const entry:Entry = s.cache?.[name]; // get a copy of entry before deleting it

    localStorage.removeItem(name);     // delete it everywhere
    const cache = {...s.cache};
    delete cache[name];

    const filter  = filterText(cache);
    const patches = patchFilter(cache, filter);
    return {cache, patches, filter};
  },

  saveAsUnnamed:(s, {data})=>{
    const cache   = savePatch(s.cache, data, '', '*');
    const filter  = filterText(cache);
    const patches = patchFilter(cache, filter);
    return {cache, patches, filter};
  },
  save:(s, {name, comments, data}) => {
    const cache   = savePatch(s.cache, data, comments, name);
    const filter  = filterText(cache);
    const patches = patchFilter(cache, filter);
    return {cache, patches, filter};
  },

  rename: (s, {name, asName}) => {

    const entry:Entry = s.cache?.[name]; // get a copy of entry before deleting it
    const {data, comments } = entry;

    localStorage.removeItem(name);     // delete it everywhere
    const tcache = {...s.cache};
    delete tcache[name];

    const cache   = savePatch(tcache, data, comments, asName); // save it under new name

    const filter  = filterText(cache);
    const patches = patchFilter(cache, filter);
    return {cache, patches, filter};

  },

  saveCopyAs: (s, {name, asName}) => {
    const entry:Entry = s.cache?.[name];
    const {data, comments } = entry;
    const cache   = savePatch(s.cache, data, comments, asName);
    const filter  = filterText(cache);
    const patches = patchFilter(cache, filter);
    return {cache, patches, filter};
    },

  saveFilter: (s, {text}) => {
    const cache   = saveAny(s.cache, text, '', 'filter','filter');
    const filter = filterText(cache); // should be identical value to text!
    const patches = patchFilter(cache, filter);
    return {cache, patches, filter};
  },

  mirrorOtherInstance: (s, {key, oldValue, newValue}) => {// another instance modified local storage

    const cache:StorageBall = {...s.cache};

    if(newValue === null)      // it is a deletion
      delete cache[key];
    else                       // it is an additon or a modification
      cache[key] = JSON.parse(newValue)

    const filter  = filterText(cache);
    const patches = patchFilter(cache, filter);

    return {cache, patches, filter};
  }

};


export const sliceConfig:SliceConfig = {name: 'patch', creators, initialState, reducers};

