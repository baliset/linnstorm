import React, {useCallback, useEffect, useState} from 'react';
import {MyGrid} from "./MyGrid";
import { midiColumnDefs} from "../xform/columndefs";
import {actions} from "../actions-integration";
import {selectors} from "../actions/selectors";
import {useSelector} from "../actions-integration";
import {CheckGroup} from "./CheckGroup.jsx";
import {resetRecordable} from "../linnutils/mymidi";

const getRowNodeId = data=>data.id
const gridstyle = {height: '700px', width: '100%'};

export const  RtMidiview = () => {
  const [filter, setFilter]  = useState('');
  const {
    midi: { midiView, connected, recordable}
  } = useSelector(s=>s);
  const cb   = useCallback((k,v)=>actions.midi.record(k,v),[]);
  const nada = useCallback((k,v)=>{},[]);
  useEffect(()=>{resetRecordable(recordable)}, [recordable]);
  // todo this is very inefficient, but fine for now
  const rowData = Object.values(midiView);

  const ffFilter = o => {
    if (filter === '')
      return true;

    const FILTER = filter.toUpperCase();
    const search = `${o?.cmd ?? ''}${o?.src}${o?.hex}${o?.type}${o?.value?.toString() ?? ''}`.toUpperCase();
    return search.includes(FILTER);
  };

  const columnDefs =  midiColumnDefs;

  const known  = Object.fromEntries(Object.keys(recordable).map(k=>([k,false])));
  const online = Object.fromEntries(Object.values(connected).map(o=>[o.name, true]));

  // post the connected status of all devices that were connected that we remember
  // in case they disconnect
  const statuses = {...known,...online};

   return  (
      <>
      <div style={{marginTop:'30px'}}>
      <CheckGroup active={false} heading="Connected:" name="DeviceList" choices={statuses} setChoice={nada}></CheckGroup>
      <CheckGroup active={true}  heading="Recordable:" name="DeviceList" choices={recordable} setChoice={cb}></CheckGroup>
      </div>
      <hr/>
        &nbsp;&nbsp;Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
        &nbsp;&nbsp;<button onClick={actions.midi.clearMidiView}>Clear Midi Events</button>
        &nbsp; Midi Event Count:  {rowData.length}

        <hr/>
      <MyGrid style={gridstyle} rowData={rowData.filter(ffFilter)} columnDefs={columnDefs}  getRowNodeId={getRowNodeId}/>
      </>
    );
};
