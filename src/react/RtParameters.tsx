import React, {useState, useEffect, useCallback} from 'react';
import {MyGrid} from "./MyGrid";

import {linnPropColumnDefs, patchColumnDefs, setDiffColumns} from "../xform/columndefs";
import {actions, useSelector} from "../actions-integration";
import {PatchEditorsInit} from "../agstuff/PatchEditors";
import LinnControl from './LinnControl';
import {uploadPatch} from '../linnutils/mymidi';
import {Menu, Item, Separator, Submenu, useContextMenu, ItemParams, ContextMenu} from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import {ContextMenuHeader} from './ContextMenuHeader';
import {CompareProps} from '../actions/local-slice';
import {TotalState} from '../actions/combined-slices';
const gridstyle = {height: '700px', width: '100%'};

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

const filterParamColumns = (compare:CompareProps, o:any):boolean => {
  const colId = o?.field;

  console.log(`columnId for filtering is ${colId}`, o)
  switch(compare) {
    case 'a-b': return !(colId === 'c' || colId === 'd');
    case 'a-c': return !(colId === 'b' || colId === 'd');
    case 'a-d': return !(colId === 'b' || colId === 'c');
    case 'c-d': return !(colId === 'a' || colId === 'b');
  }
}
type AgGridEvent = {event:any};
export const  RtParameter = () => {
  const [filter, setFilter]  = useState('');
  const [paramColumnDefs, setParamColumDefs] = useState(linnPropColumnDefs);
  const [currentPatchName, setCurrentPatchName] = useState('');
  const [currentPatchData, setCurrentPatchData] = useState(undefined);
  const [patchDataColumnA, setPatchDataColumnA] = useState<Record<number,number>>({});
  const {
    midi: { paramView, linnsConnected},
    patch: {patches, filter:patchFilter},
    local: {compare}
  } = useSelector(s=>s);

  useEffect(()=>{
    setDiffColumns(compare.slice(0,1), compare.slice(-1) ) // compare is formay x-y, so this will populate with a/b, a/c, c/d, etc.
    setParamColumDefs(linnPropColumnDefs.filter(o=>filterParamColumns(compare, o)));  // todo this should be showHideColumn calls instead
  }, [compare]);


  const kPatchContextMenu = 'patchMenu';
  const kParamsContextMenu = 'paramMenu';
  //--- context menu stuff
  const { show:showContextMenu } = useContextMenu({});

  // const cmClick = useCallback(({ id, event, props }:ItemParams)=>console.log(`cmClick handler here`, id, event, props),[]);

  const openPatchMenu= useCallback((agGridEvent:any)=>{
    const {event} = agGridEvent;
    const data = agGridEvent.node.data;
    const patchData = data.data;
    const patchKey = agGridEvent.node?.data.name;
    setCurrentPatchName(data.name);
    setCurrentPatchData(patchData);

    if(event) showContextMenu({id: kPatchContextMenu, event, props: {patchData, patchKey, colId:agGridEvent.colId,}});

  },[]);


  const openParamsMenu=useCallback((agGridEvent:any)=>{
    const {event} = agGridEvent;
    const patchData:Record<number,number> ={};
    const populatedRows:any =  (linnpropRows as any[]).filter(o=>o.a !== undefined);

    populatedRows.forEach((o:any)=>{
      console.log(`nrpn ${o.nrpn} is populated with value ${o.a}`, o);
      patchData[o.nrpn] = o.a;
      }
    );
    setPatchDataColumnA(patchData);

    // only show menu when rows are populated with something
    if(event && populatedRows.length) showContextMenu({id: kParamsContextMenu, event, props: {patchData, colId:agGridEvent.colId,}});
  },[paramView]);

  //---- end context menu stuff
  // todo this is very inefficient, but fine for now
  const linnpropRows = Object.values(paramView);

  useEffect(()=>{
  if(linnsConnected>1)
    actions.notify.warn({msg: `You currently have ${linnsConnected} Linnstruments connected. So far this app handles only one`, remedy: 'Modal'});
  }, [linnsConnected]);



  const ffFilter = (o:any):boolean => filter === '' ||(
    o?.key?.includes(filter) ||
    o?.cat?.includes(filter) ||
    o?.desc?.includes(filter)||
    o?.side?.includes(filter));

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
          <MyGrid style={gridstyle} contextM={openPatchMenu} dark={false} rowData={patches} columnDefs={patchColumnDefs} getRowNodeId={getPatchRowNodeId}>
          <Menu id={kPatchContextMenu}>
            <ContextMenuHeader><span style={{color:'black'}}>Patch: </span>{currentPatchName}</ContextMenuHeader>
            <Separator />
            <Item disabled={!currentPatchName} id="1" onClick={()=>actions.patch.delete(currentPatchName)}>Delete patch</Item>
            <Separator />
            <Item disabled={!currentPatchName} id="2" onClick={()=>actions.patch.saveCopyAs(currentPatchName, `${currentPatchName} copy`)}>Duplicate patch</Item>
            <Separator />
            <Item disabled={!currentPatchName} id="3" onClick={()=>actions.midi.updateParamViewWithPatch('a', currentPatchData)}>Put patch in Column A</Item>
            <Item disabled={!currentPatchName} id="4" onClick={()=>actions.midi.updateParamViewWithPatch('b', currentPatchData)}>Put patch in Column B</Item>

            <Separator />
            <Item disabled={linnsConnected !== 1 || !currentPatchName}id="Duplicate" onClick={()=>uploadPatch(currentPatchData ?? {})}>Upload to Linnstrument</Item>

          </Menu>
          </MyGrid>
        </div>
        <div style={{gridColumnStart: 'colParams', gridRowStart:'rowMain'}}>
          <hr/>
          <div style={{paddingLeft:'10px'}}>

          Parameter Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
          </div>
          <hr/>
          <MyGrid style={gridstyle} contextM={openParamsMenu} dark={true} rowData={linnpropRows.filter(ffFilter)} columnDefs={paramColumnDefs}
                  getRowNodeId={getRowNodeId}>
                  <Menu  theme="contexify_theme-dark" id={kParamsContextMenu}>
                    <ContextMenuHeader><span style={{color:'black'}}>Patch: </span>Column A ({Object.keys(patchDataColumnA).length} keys)</ContextMenuHeader>
                    <Item onClick={()=>actions.patch.saveAsUnnamed(patchDataColumnA)}>Save Column A to new patch</Item>
                    <Item onClick={()=>uploadPatch(patchDataColumnA)}
                          disabled={linnsConnected !== 1}                            >Upload to Linnstrument</Item>
                  </Menu>
          </MyGrid>
        </div>
      </div>
    );
};
