import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {actions, useSelector} from '../actions-integration';
import {LinnCellDiv, LinnRowDiv, LinnCell} from "./LinnCell";
import {rotateNRight} from "../theory/scales-generated";
import {genInterruptiblePatchUploader, tuningToParamSet, setSplitColumn, uploadPatch} from "../linnutils/mymidi";
import {Radio} from "./Radio";
import {MyGrid} from "./MyGrid";
import {linnColorColumnsDef} from "../xform/columndefs";
import {ContextMenu, Item, Menu, useContextMenu} from "react-contexify";
import {ContextMenuHeader} from "./ContextMenuHeader";
import {LinnParam} from '../linnutils/LinnVals';
import {oReduce} from '../utils/oreduce';
import {TotalState} from '../actions/combined-slices';

const TSlider = styled.input`
  width:27em;
  padding:0;
  display: block;
  accent-color: ${p=>p.color};
`;

const WhiteKey = styled.div`
  display: inline-block;
  
  --myheight: 2em;
  --mywidth:2em;
  
  height:     var(--myheight);
  min-height: var(--myheight);
  max-height: var(--myheight); 
  width:      var(--mywidth);
  max-width:  var(--mywidth);
  min-width:  var(--mywidth);
  vertical-align: bottom;
  padding-top: 2px;
  padding-left: 2px;
  
  
  background: linear-gradient(to bottom,#eee 0%,#fff 100%);
  border-left: 1px solid #999;

  &:hover {color:blue; background: linear-gradient(to bottom, #fff 0%, #e9e9e9 100%) };

`;

const BlackKey = styled(WhiteKey)`
  color: white;
  background: linear-gradient(45deg,#222 0%,#555 100%);
  &:hover {color: yellow; background:linear-gradient(to right,#444 0%,#222 100%) }
`;

const Keyboard = styled.div`
  width: max-content;
  margin:auto;
  
  padding: 1em 1em 1em 1em;
  border-radius:10px;
  background: #103;
  box-shadow:0 0 50px rgba(0,0,0,0.5) inset,0 1px rgba(212,152,125,0.2) inset,0 5px 15px rgba(0,0,0,0.5)
`;

const SLabel = styled.label`color: white; display:inline-block; margin-top:6px; margin-bottom:4px;`;

const whChars = [0, "h", "w", "w+h"]
const patternToWh = (a:number[]) => a.map(v=>whChars[v]).join(', ');

// what note is any cell is based on tuning
const xyNote = (x:number, y:number, baseNote:number, offset:number)=> y*offset + x + baseNote;

const nameThatNote = ( v:number, pcArray:string[]) =>{
  const name = pcArray[v%12];
  return name? `${name}${Math.trunc(v/12)-1}`: '\u00a0';
};

const availableIntervals:Record<string,number> = {
  'Minor 3rds ': 3,
  '3rds ':       4,
  '4ths ':      5,
  'Tritones ':   6,
  '5ths ':       7,
  'Octaves ':   12,
  'Unison ':   127, // aka no offset
  '"Guitar" ':  13,
  'No Overlap ': 0,
};

const intervalNames = Object.keys(availableIntervals);
const deviceTypes = ["200", "128"];

const kColorsMenu = 'ColorsMenu';
// todo pass in actual properties to visualize current configuration as well as experiment with others
const gridstyle = {height: '259px', width: '297px'};

const uploadRealTimeTuningPatch = genInterruptiblePatchUploader();
type Re = React.ChangeEvent<HTMLInputElement>;

const getRowNodeId = (data:any)=>data.nrpn
const  RtTuning = () => {
    const {
      linn:  {tonic, scaleIndex, scaleName, scaleType, scaleCount, scaleSteps,
      scaleNotes,  twelve, keyboardMapped,
      transposeSemis, baseMidiNote, tuningOffsetSemis,deviceColumns,scaleFilterText,
      },
      midi: { paramView, linnsConnected},

    }:TotalState = useSelector(s=>s);

  const [splitCol, setSplitCol] = useState(12);
  const [colorRows, setColorRows] = useState<LinnParam[]>([]);
  const [patchData, setPatchData] = useState<Record<number,number>>({});

  const changeT  = useCallback((e:Re) => actions.linn.tonic(Number(e.target.value)),[]);
  const changeSc = useCallback((e:Re) => actions.linn.scale(Number(e.target.value)),[]);
  const changeTr = useCallback((e:Re) => actions.linn.transposeSemis(Number(e.target.value)),[]);
  const changeTu2 = useCallback((v:number) =>actions.linn.tuningOffsetSemis(availableIntervals[v]),[]);
  const changeDevice = useCallback((v:string) =>actions.linn.deviceType(v==="128"? 16: 25),[]);

  const changeSplit = useCallback((e:any) =>{
    const v = Number(e.target.value);
    setSplitCol(v);
    setSplitColumn(v)},[]);
  const { show:showContextMenu }:ContextMenu = useContextMenu({});

  const openColorMenu=useCallback((agGridEvent:any)=>{
    const {event} = agGridEvent;
    const populatedRows:any[] =  (colorRows as any[]).filter(o=>o.a !== undefined);
    const patchData:Record<number,number> = oReduce(populatedRows,(r:any)=>[r.nrpn, r.a], {});
    setPatchData(patchData);

    // only show menu when rows are populated with something
    if(event && populatedRows.length) showContextMenu({id: kColorsMenu, event, props: {patchData, colId:agGridEvent.colId,}});
  },[colorRows]);

  useEffect(()=>{
    const paramRows = Object.values(paramView);
    setColorRows(paramRows.filter(o=>(o.nrpn >= 30 && o.nrpn <= 33) || (o.nrpn >= 130 && o.nrpn <= 133)));
    }, [paramView])
  const baseNote = baseMidiNote + transposeSemis; // what is the first midi note number

  useEffect(()=>{
    uploadRealTimeTuningPatch(tuningToParamSet({ transposeSemis,tonic, tuningOffsetSemis}, scaleNotes));
  },[transposeSemis,tonic, tuningOffsetSemis, scaleNotes]);


  const rotatedTwelve = rotateNRight(twelve, tonic);

  const namedNotes = [...Array(128).keys()].map(noteNum=>nameThatNote(noteNum, rotatedTwelve));

  return  (

      <div style={{marginLeft: '60px', marginTop: '40px', display:'grid', gridTemplateColumns: '820px auto', gridTemplateRows: '400px 50px 500px'}}>

        <div style={{gridColumn: 1, gridRow:1}}>
        <Keyboard>
          <div style={{paddingLeft: '10px', color:'white'}}>
            <SLabel>Split Slider {splitCol}</SLabel>
            <TSlider  color="orange" name="SplitCol" type="range" min="1" max="25" defaultValue={ splitCol } onChange={ changeSplit }/>


            <SLabel>Row Tuning Offset: {tuningOffsetSemis} </SLabel>
            <Radio name="Tuning" choices={intervalNames} defaultChoice="5" setChoice={changeTu2}/>
            <hr/>
            <SLabel>Transpose Semitones:  base of midi note #{baseMidiNote} offset by {transposeSemis} semitones</SLabel>
            <TSlider  color="green" name="Trans" type="range" min={-baseMidiNote} max={baseMidiNote+67} defaultValue={ transposeSemis } onChange={ changeTr }/>

            <SLabel>Tonic on {keyboardMapped[tonic]}</SLabel>
            <TSlider  color="red" name="Tonic" type="range" min="0" max="11" defaultValue={ tonic } onChange={ changeT }/>
            <hr/>
            Scale Filter: <input id="scfilter" name="scfilter" type="text" value={scaleFilterText} onChange={event => actions.linn.filterScale(event.target.value)}/>
            <span style={{color: 'white'}}> includes {scaleCount} scales</span>
            <br/>

            <SLabel>Scale Selection:  ({scaleType} notes: {patternToWh(scaleSteps)}) {scaleName}</SLabel>
            <TSlider  color="blue" name="Scale" type="range" min="0" max={scaleCount-1} defaultValue={ scaleIndex } onChange={ changeSc }/>

          </div>

          <br/>
          {[0,-1,2,-3,4,5,-6,7,-8,9,-10,11,12,-13,14,-15,16,17,-18,19,-20,21,-22,23].map(v=>{
            const black = v<0;
            return black?<BlackKey key={v}>{keyboardMapped[-v]}</BlackKey>:
                         <WhiteKey key={v}>{keyboardMapped[v]}</WhiteKey>;
          })}


      </Keyboard>
      </div>
      <div style={{gridColumn: 2, gridRow: 1}}>

        {/*todo collect current values or default values and set all the sliders according to those*/}

        <MyGrid style={gridstyle} contextM={openColorMenu} dark={true} rowData={colorRows} columnDefs={linnColorColumnsDef}  getRowNodeId={getRowNodeId}>
          <Menu  theme="contexify_theme-dark" id={kColorsMenu}>
            <ContextMenuHeader>Colors Context Menu</ContextMenuHeader>
            <Item onClick={()=>actions.patch.saveAsUnnamed(patchData)}>Save current colors to new patch</Item>
            <Item onClick={()=>uploadPatch(patchData)}
                  disabled={linnsConnected !== 1}                     >Upload colors Linnstrument</Item>

          </Menu>

        </MyGrid>
      </div>
        <div style={{gridColumnStart: 1, gridColumnEnd: 3, gridRow: 2 }}>
        <div style={{display:'inline-block'}}>My LinnStrument is type: {deviceColumns===16? 128:200} with {deviceColumns} columns
        <Radio name="LinnType" choices={deviceTypes} defaultChoice="200" setChoice={changeDevice}/>
        </div>
        </div>
        <div style={{gridColumnStart: 1, gridColumnEnd: 3, gridRow: 3 }}>
      <LinnCellDiv style={{gridColumn: 1, gridRow: 2 }}>
        {[...Array(8).keys()].reverse().map(y=>(<LinnRowDiv key={y}>
          {[...Array(deviceColumns).keys()].map(x=> {
           const note = xyNote(x, y, baseNote, tuningOffsetSemis);
           const normNote = note % 12;

          // twelve always starts on tonic, but the note numbers do not account

           const isScale = (note > 0 && note < 127) && rotatedTwelve[normNote].length > 0;
           const isTonic = normNote === tonic; // correct
           return  <LinnCell note={note} key={y*deviceColumns+x} x={x} y={y} isTonic={isTonic} isScale={isScale}>
           {isScale? namedNotes[note]:'\u00a0'}</LinnCell>
          })}
        </LinnRowDiv>))}
      </LinnCellDiv>
      </div>
      </div>

  );
};

export default RtTuning;
