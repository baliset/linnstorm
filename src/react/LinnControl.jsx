import React, {useState, useCallback} from 'react';
import {Btn} from './Btn';
import {actions} from "../actions-integration";
import {CheckGroup} from "./CheckGroup";

const patchPrefix = 'patch.';
const  LinnControl = ({rows}) => {
  const [patchA, setPatchA]   = useState(undefined);
  const [patchB, setPatchB]   = useState(undefined);
  const [choices, setChoices] = useState({'Copy selected rows only': false});
  const checkCallback   = useCallback((k,v)=>setChoices({'Copy selected rows only': v}),[]);
  const upwdCb = useCallback((col)=>actions.midi.updateParamViewWithDefaults(col, Object.values(choices)[0]),[choices]);
  const upwcCb = useCallback((col)=>actions.midi.updateParamViewWithCurrent(col, Object.values(choices)[0]),[choices]);

  const getPatchNames = useCallback(()=>
    Object
      .keys(localStorage)
      .filter(k=>k.startsWith(patchPrefix))
      .map(s=>s.slice(patchPrefix.length))
   ,[]);


  const savePatch  = useCallback((patchName, value)=>localStorage.setItem(patchPrefix+patchName, value),[]);

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
              {/*<Btn onClick={()=>{interrogate()}}>Interrogate</Btn>*/}
              {/*<Btn onClick={()=>{test()}}>Test</Btn>*/}
              <Btn onClick={()=>upwdCb('a')}>Load Defaults into Column A</Btn>
              <Btn onClick={()=>upwdCb('b')}>B</Btn>
              <Btn onClick={()=>upwcCb('a')}>Load Current into Column A</Btn>
              <Btn onClick={()=>upwcCb('b')}>B</Btn>

              <CheckGroup choices={choices} heading="" name="SelectedOnly" setChoice={checkCallback} />



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
