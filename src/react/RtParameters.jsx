import React, { useState} from 'react';
import {MyGrid} from "./MyGrid";
import LinnControl from "./LinnControl";
import { linnPropColumnDefs} from "../xform/columndefs";
import {currentLinnParams, rowData} from "../linnutils/mymidi";


const kLinnDefaults = 'LinnStrument.Defaults';

function loadMyFaves(rows)
{
  const s = localStorage.getItem('hzsetting1');
  const o = JSON.parse(s);

  // apply the data that was saved
  rows.forEach(row=>row.b = o[row.nrpn]);
}
function saveAsLinnDefaults()
{
  const v = JSON.stringify(currentLinnParams)
  localStorage.setItem(kLinnDefaults,v);
}

function saveAsFave(name)
{
  const v = JSON.stringify(currentLinnParams)
  localStorage.setItem(name,v);
}


function loadLinnDefaults(rows)
{
  const s = localStorage.getItem(kLinnDefaults);
  const o = JSON.parse(s);

  // apply the data that was saved
  rows.forEach(row=>row.d = o[row.nrpn]);
}

const getRowNodeId = data=>data.nrpn

export const  RtParameter = () => {
  const [filter, setFilter]  = useState('');

  const ffFilter = o => filter === '' ||(
    o?.key?.includes(filter) ||
    o?.cat?.includes(filter) ||
    o?.desc?.includes(filter)||
    o?.side?.includes(filter));

  // loadMyFaves(rowData);
  // loadLinnDefaults(rowData);

   return  (
      <>
      <LinnControl rows={rowData}/>
      Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
      <MyGrid rowData={rowData.filter(ffFilter)} columnDefs={linnPropColumnDefs} getRowNodeId={getRowNodeId}/>
      </>
    );
};
