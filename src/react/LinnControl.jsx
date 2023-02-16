import React from 'react';
import {interrogate, test} from "../mymidi";
import {Btn, RBtn} from './Btn';

const  LinnControl = ({rows}) => {

  function loadIntoColumn(key,prop)
  {
    const s = localStorage.getItem(key);
    const o = JSON.parse(s);

    // apply the data that was saved
    rows.forEach(row=>row[prop] = o[row.nrpn]);
  }

  const presets = Object.keys(localStorage);

   return  (
            <div style={{padding:'5px 5px'}}>
              <Btn onClick={()=>{interrogate()}}>Interrogate</Btn>
              <Btn onClick={()=>{test()}}>Test</Btn>

              <h3>Stored Settings</h3>
              <ul>
                {presets.map(k=>
                  <li key={k}>
                    Load '{k}' Into Column:
                    <RBtn onClick={()=>loadIntoColumn(k,'a')}>A</RBtn>
                    <RBtn onClick={()=>loadIntoColumn(k,'b')}>B</RBtn>
                  </li>)}
              </ul>

            </div>

    );
};

export default LinnControl;
