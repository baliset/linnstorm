import React, { useState, useEffect} from 'react';
import {MyGrid} from "./MyGrid";
import LinnControl from "./LinnControl";
import { linnPropColumnDefs} from "../xform/columndefs";
import {currentLinnParams} from "../linnutils/mymidi";
import {actions, useSelector} from "../actions-integration";


const kLinnDefaults = 'LinnStrument.Defaults';

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
  const {
    midi: { paramView, linnsConnected}
  } = useSelector(s=>s);

  useEffect(()=>{
  if(linnsConnected>1)
    actions.notify.warn({msg: `You currently have ${linnsConnected} Linnstruments connected. So far this app handles only one`, remedy: 'Modal'});
  }, [linnsConnected]);

  // todo this is very inefficient, but fine for now
  const rowData = Object.values(paramView);



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
      <hr/>
      { linnsConnected === 1? 'You have a LinnStrument currently connected':
        linnsConnected > 1?   `You have too many (${linnsConnected}) LinnStruments connected`:
                              'No LinnStrument is connected at the moment'
      }
      <hr/>
      Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
      <MyGrid rowData={rowData.filter(ffFilter)} columnDefs={linnPropColumnDefs} getRowNodeId={getRowNodeId}/>
      </>
    );
};
