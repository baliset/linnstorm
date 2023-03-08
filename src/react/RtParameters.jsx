import React, { useState, useEffect} from 'react';
import {MyGrid} from "./MyGrid";

import { linnPropColumnDefs, patchColumnDefs} from "../xform/columndefs";
import {actions, useSelector} from "../actions-integration";
import {PatchNameEditorInit} from "../agstuff/PatchNameEditor.jsx";

PatchNameEditorInit(actions.patch);

/* todo

  debug seeing two (related?) phenomena
  1. the patches state shows two copies of the same entity, when the filter should produce only one
  2. the grid state while admittedly, for example, should show hello yo fourth yo (based on redundance in patches array)
  instead it continues showing old rows that should no longer exist in patches array at all

 */
const getRowNodeId = data=>data.nrpn
const getPatchRowNodeId = data=>data.updated;
export const  RtParameter = () => {
  const [filter, setFilter]  = useState('');
  const {
    midi: { paramView, linnsConnected},
    patch: {patches, filter:patchFilter}
  } = useSelector(s=>s);

  useEffect(()=>{
  if(linnsConnected>1)
    actions.notify.warn({msg: `You currently have ${linnsConnected} Linnstruments connected. So far this app handles only one`, remedy: 'Modal'});
  }, [linnsConnected]);

  // todo this is very inefficient, but fine for now
  const linnpropRows = Object.values(paramView);

  const ffFilter = o => filter === '' ||(
    o?.key?.includes(filter) ||
    o?.cat?.includes(filter) ||
    o?.desc?.includes(filter)||
    o?.side?.includes(filter));

/*
fix the styles so grids are side by side
fix the filter, etc.
automatic save files
add pinned rows for a, current, and default
save the defaults if not already saved into a patch
 */

   return  (
      <>
        <div style={{display:'inline-grid', width:'400px'}}>
          Filter: <input id="pfilter" name="pfilter" type="text" value={patchFilter} onChange={event => actions.patch.saveFilter(event.target.value)}/>
          <MyGrid dark={false} rowData={patches} columnDefs={patchColumnDefs} getRowNodeId={getPatchRowNodeId}/>
        </div>
        <div style={{display:'inline-grid', width:'1400px'}}>
          Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
          <MyGrid dark={true} rowData={linnpropRows.filter(ffFilter)} columnDefs={linnPropColumnDefs} getRowNodeId={getRowNodeId}/>
          {/*<LinnControl rows={linnpropRows}/>*/}
          { linnsConnected === 1? 'You have a LinnStrument currently connected':
            linnsConnected > 1?   `You have too many (${linnsConnected}) LinnStruments connected`:
              'No LinnStrument is connected at the moment'
          }
        </div>
      </>
    );
};
