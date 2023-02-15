import React, { useState} from 'react';
import {MyGrid} from "./MyGrid";
import { midiColumnDefs} from "./xform/columndefs";
import {actions} from "./actions-integration";
import {selectors} from "./actions/selectors";
import {useSelector} from "./actions-integration";

const getRowNodeId = data=>data.id

export const  RtMidiview = () => {
  const [filter, setFilter]  = useState('');
  const {
    linn: { midiView}
  } = useSelector(s=>s);

  // todo this is very inefficient, but fine for now
  const rowData = Object.values(midiView);

  const ffFilter = o => filter === '' ||(
    o?.dir?.includes(filter) ||
    o?.cmd?.includes(filter) ||
    o?.src?.includes(filter) ||
    o?.hex?.includes(filter) ||
    o?.value?.toString()?.includes(filter));

  const columnDefs =  midiColumnDefs;

   return  (
      <>
      Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
      <button onClick={actions.linn.clearMidiView}>Clear Midi Events</button>
        &nbsp; Midi Event Count:  {rowData.length}
      <MyGrid rowData={rowData.filter(ffFilter)} columnDefs={columnDefs}  getRowNodeId={getRowNodeId}/>
      </>
    );
};
