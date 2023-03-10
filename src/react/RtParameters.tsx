import React, {useState, useEffect, useCallback} from 'react';
import {MyGrid} from "./MyGrid";

import { linnPropColumnDefs, patchColumnDefs} from "../xform/columndefs";
import {actions, useSelector} from "../actions-integration";
import {PatchEditorsInit} from "../agstuff/PatchEditors";
import {GetContextMenuItemsParams, MenuItemDef} from 'ag-grid-community';
import LinnControl from './LinnControl';
import {uploadPatch} from '../linnutils/mymidi';


PatchEditorsInit(actions.patch);

/* todo

  debug seeing two (related?) phenomena
  1. the patches state shows two copies of the same entity, when the filter should produce only one
  2. the grid state while admittedly, for example, should show hello yo fourth yo (based on redundance in patches array)
  instead it continues showing old rows that should no longer exist in patches array at all

 */
const getRowNodeId = (data:any)=>data.nrpn
const getPatchRowNodeId = (data:any)=>data.updated;

function describePatch(patch:Record<number,number>):string
{
  const keyCount = Object.keys(patch).reduce((accum,_)=>accum+1, 0);
  return `(${keyCount})`;
}

const rtParamsStyle = {
  display:'grid',
  gridTemplateColumns:'[colPatches] 532px [colParams] auto',
  gridTemplateRows:'[rowIntro] min-content [rowControls] min-content [rowMain] auto',
  gridColumnGap: '5px',
  gridRowGap:'5px'
};

export const  RtParameter = () => {
  const [filter, setFilter]  = useState('');
  const {
    midi: { paramView, linnsConnected},
    patch: {patches, filter:patchFilter}
  } = useSelector(s=>s);

  // while the callback itself is regenerated if linnsConnected changes, an open menu with an option
  // to upload to Linnstrument will not rerender when status changes
  const patchMenu = useCallback((params:GetContextMenuItemsParams):(| string | MenuItemDef)[]=>{

    const patchKey = params.node?.data.name;
    const patchId = `patch '${patchKey}'`;
    const patch = params.node?.data.data;

    return [
      {name: `For ${patchId} ${describePatch(patch)}:`, disabled:true},
      'separator',
      {name: `Delete patch`,   action: ()=>actions.patch.delete(patchKey)},
      'separator',
      {name: `Duplicate`,      action: ()=>actions.patch.saveCopyAs(patchKey, `${patchKey} copy`)},

      {name: `Put in Column A`,     action: ()=>actions.midi.updateParamViewWithPatch('a', patch)},
      {name: `Put in Column B`,     action: ()=>actions.midi.updateParamViewWithPatch('b', patch)},
      'separator',
      {name: `Upload to Linnstrument`,   disabled: linnsConnected !== 1,  action: ()=>uploadPatch(patch)},
    ];

  },[linnsConnected,patches]);

  // todo this is very inefficient, but fine for now
  const linnpropRows = Object.values(paramView);

  const paramsMenu = useCallback((params:GetContextMenuItemsParams):(| string | MenuItemDef)[]=>{


    console.log(`getMenuItems params`, params);
    const colId = params?.column?.getColId();

    if(colId !== 'a')
      return [];  // empty is no menu at all


    const patch:Record<number,number> ={};
    (linnpropRows as any[]).forEach(o=>{
      if(o.a !== undefined)
        patch[o.nrpn] = o.a;
    });

    return [
      {name: `Save column A to new patch`,  action: ()=>actions.patch.saveAsUnnamed(patch)}, // or should it continuously save in a patch called ''
      'separator',
      {name: `Upload to Linnstrument`,   disabled: linnsConnected !== 1,  action: ()=>uploadPatch(patch)},
    ];


  },[paramView]);




  useEffect(()=>{
  if(linnsConnected>1)
    actions.notify.warn({msg: `You currently have ${linnsConnected} Linnstruments connected. So far this app handles only one`, remedy: 'Modal'});
  }, [linnsConnected]);




  const ffFilter = (o:any):boolean => filter === '' ||(
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
      <div style={rtParamsStyle}>
      <div style={{gridColumnStart: 1, gridColumnEnd:3, gridRowStart:'rowIntro', alignContent:'center', alignSelf:'start', padding: '10px'}}>
        <p>The Parameters page is dedicated to editing/comparing/and uploading patches for the Linnstrument</p>
      </div>

        <div style={{gridColumnStart: 'colPatches', gridRowStart:'rowControls', backgroundColor:'white', padding: '10px'}}>
        <h1>LinnStrument Patch Browser</h1>
        Use the context menu to load a patch into the parameter grid for editing/comparison or to upload it to the LinnStrument
        </div>
        <div style={{gridColumnStart: 'colParams', gridRowStart:'rowControls', backgroundColor:'#1c1c1c', color: 'white', padding: '10px'}}>
          <h1>LinnStrument Parameter Browser</h1>
          <p>You can browse parameter values and compare current/default settings against patches, or compare individual patches.</p>
          <p>Use the context menu to directly upload a patch or save it.</p>

        <LinnControl rows={linnpropRows}/>
        { linnsConnected === 1? 'You have a LinnStrument currently connected':
          linnsConnected > 1?   `You have too many (${linnsConnected}) LinnStruments connected`:
            'No LinnStrument is connected at the moment'
        }
      </div>
        <div style={{gridColumnStart: 'colPatches', gridRowStart:'rowMain'}}>
          <hr/>
          <div style={{paddingLeft:'10px'}}>
          Patch Filter: <input id="pfilter" name="pfilter" type="text" value={patchFilter} onChange={event => actions.patch.saveFilter(event.target.value)}/>
          </div>
          <hr/>
          <MyGrid dark={false} rowData={patches} menu={patchMenu} columnDefs={patchColumnDefs} getRowNodeId={getPatchRowNodeId}/>
        </div>
        <div style={{gridColumnStart: 'colParams', gridRowStart:'rowMain'}}>
          <hr/>
          <div style={{paddingLeft:'10px'}}>

          Parameter Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
          </div>
          <hr/>
          <MyGrid dark={true} rowData={linnpropRows.filter(ffFilter)} columnDefs={linnPropColumnDefs}
                  getRowNodeId={getRowNodeId} menu={paramsMenu}/>
        </div>
      </div>
    );
};
