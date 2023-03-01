import React, {useState, useCallback} from 'react';
import {interrogate, test} from "../linnutils/mymidi";
import {Btn} from './Btn';
import {actions} from "../actions-integration";


const patchPrefix = 'patch.';
const  LinnControl = ({rows}) => {
  const [patchA, setPatchA]   = useState(undefined);
  const [patchB, setPatchB]   = useState(undefined);
  const getPatchNames = useCallback(()=>
    Object
      .keys(localStorage)
      .filter(k=>k.startsWith(patchPrefix))
      .map(s=>s.slice(patchPrefix.length))
   ,[]);
  const savePatch  = useCallback((patchName, value)=>localStorage.setItem(patchPrefix+patchName, value),[]);
  const [patchNames, setPatchNames] = useState(()=>getPatchNames());

  const loadPatchIntoColumn = useCallback((patchName,prop)=>{
    const s = localStorage.getItem(patchPrefix+patchName);
    if(s === undefined) {
      actions.notify.error({msg: `Patch ${patchName} not found`, remedy: 'Acknowledge'});
      return;
    }
    const o = JSON.parse(s);
    // todo this needs to move into a parameter set in redux
    // apply the data that was saved
    rows.forEach(row=>row[prop] = o[row.nrpn]);
  },[])

  const chSelectA = useCallback((e)=>{setPatchA(e.target.value);loadPatchIntoColumn(e.target.value, 'a')},[loadPatchIntoColumn]);
  const chSelectB = useCallback((e)=>{setPatchB(e.target.value);loadPatchIntoColumn(e.target.value, 'b')},[loadPatchIntoColumn]);


  const presets = Object.keys(localStorage);

   return  (
            <div style={{padding:'5px 5px'}}>
              <Btn onClick={()=>{interrogate()}}>Interrogate</Btn>
              <Btn onClick={()=>{test()}}>Test</Btn>

              <span>Stored Settings A:</span>
              <select onChange={chSelectA} value={patchA}>

                {patchNames.map(v=><option key={v} value={v}>{v}</option>)}
              </select>

              <span>Stored Settings B:</span>
              <select onChange={chSelectB} value={patchB}>
                {patchNames.map(v=><option key={v} value={v}>{v}</option>)}
              </select>

              {/*<ul>*/}
              {/*  {presets.map(k=>*/}
              {/*    <li key={k}>*/}
              {/*      Load '{k}' Into Column:*/}
              {/*      <RBtn onClick={()=>loadPatchIntoColumn(k,'a')}>A</RBtn>*/}
              {/*      <RBtn onClick={()=>loadPatchIntoColumn(k,'b')}>B</RBtn>*/}
              {/*    </li>)}*/}
              {/*</ul>*/}

            </div>

    );
};

export default LinnControl;
