import React, {useState, useCallback} from 'react';
import {Btn} from './Btn';
import {actions} from "../actions-integration";
import {CheckGroup} from "./CheckGroup";
import {interrogate} from "../linnutils/mymidi";

const patchPrefix = 'patch.';
const  LinnControl = ({rows}) => {
  const [choices, setChoices] = useState({'Copy selected rows only': false});
  const checkCallback   = useCallback((k,v)=>setChoices({'Copy selected rows only': v}),[]);
  const upwdCb = useCallback((col)=>actions.midi.updateParamViewWithDefaults(col, Object.values(choices)[0]),[choices]);
  const upwcCb = useCallback((col)=>actions.midi.updateParamViewWithCurrent(col, Object.values(choices)[0]),[choices]);

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

   return  (
            <div style={{padding:'5px 5px'}}>
              <Btn onClick={()=>interrogate()}>Get Current Settings</Btn>
              <Btn onClick={()=>upwdCb('a')}>Load Defaults into Column A</Btn>
              <Btn onClick={()=>upwdCb('b')}>B</Btn>
              <Btn onClick={()=>upwcCb('a')}>Load Current into Column A</Btn>
              <Btn onClick={()=>upwcCb('b')}>B</Btn>
              <hr/>
              <Btn onClick={()=>actions.local.setCompare('a-b')}>Compare A & B (two Patches) </Btn>
              <Btn onClick={()=>actions.local.setCompare('a-c')}>Patch vs Current Settings</Btn>
              <Btn onClick={()=>actions.local.setCompare('a-d')}>Patch vs Defaults</Btn>
              <Btn onClick={()=>actions.local.setCompare('c-d')}>Current vs Defaults</Btn>




              <CheckGroup choices={choices} heading="" name="SelectedOnly" setChoice={checkCallback} />
            </div>

    );
};

export default LinnControl;
