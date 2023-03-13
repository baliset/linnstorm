import React, {useCallback, useEffect, useState} from 'react';
import styled from 'styled-components';
import {actions, useSelector} from '../actions-integration';
import {LinnCellDiv, LinnRowDiv, LinnCell} from "./LinnCell";
import {rotateNRight} from "../theory/scales-generated";
import {genInterruptiblePatchUploader, tuningToParamSet, setSplitColumn} from "../linnutils/mymidi";
import {Radio} from "./Radio";

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
const patternToWh = a => a.map(v=>whChars[v]).join(', ');

// what note is any cell is based on tuning
const xyNote = (x, y, baseNote, offset)=> y*offset + x + baseNote;

const nameThatNote = ( v, pcArray) =>{
  const name = pcArray[v%12];
  return name? `${name}${Math.trunc(v/12)-1}`: '\u00a0';
};

const availableIntervals = {
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


// todo pass in actual properties to visualize current configuration as well as experiment with others

const uploadRealTimeTuningPatch = genInterruptiblePatchUploader();
const  RtTuning = () => {
    const {
      linn:  {tonic, scaleIndex, scaleName, scaleType, scaleCount, scaleSteps,
      scaleNotes, scaleNoteNames, twelve, keyboardMapped,
      transposeSemis, baseMidiNote, tuningOffsetSemis,deviceColumns,scaleFilterText,
      tuningSubState,
      },
      } = useSelector(s=>s);

  const [splitCol, setSplitCol] = useState(12);
  const changeT  = useCallback(e => actions.linn.tonic(Number(e.target.value)),[]);
  const changeSc = useCallback(e => actions.linn.scale(Number(e.target.value)),[]);
  const changeTr = useCallback(e => actions.linn.transposeSemis(Number(e.target.value)),[]);
  const changeTu2 = useCallback(v =>actions.linn.tuningOffsetSemis(availableIntervals[v]),[]);

  const changeSplit = useCallback(e =>{
    const v = Number(e.target.value);
    setSplitCol(v);
    setSplitColumn(v)},[]);


  const baseNote = baseMidiNote + transposeSemis; // what is the first midi note number

  useEffect(()=>{
    uploadRealTimeTuningPatch(tuningToParamSet({ transposeSemis,tonic, tuningOffsetSemis}, scaleNotes));
  },[transposeSemis,tonic, tuningOffsetSemis, scaleNotes]);


  // the twl
  const rotatedTwelve = rotateNRight(twelve, tonic);

  const namedNotes = [...Array(128).keys()].map(noteNum=>nameThatNote(noteNum, rotatedTwelve));

  return  (

      <div style={{marginLeft: '60px', marginTop: '40px'}}>

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

            {/*<SLabel>Scale Notes: {scaleNoteNames.join(",")}</SLabel>*/}
          </div>

          <br/>
          {[0,-1,2,-3,4,5,-6,7,-8,9,-10,11,12,-13,14,-15,16,17,-18,19,-20,21,-22,23].map(v=>{
            const black = v<0;
            return black?<BlackKey key={v} pn={-v} t={tonic}>{keyboardMapped[-v]}</BlackKey>:
                         <WhiteKey key={v} pn={ v} t={tonic}>{keyboardMapped[v]}</WhiteKey>;
          })}


      </Keyboard>

       {/*todo collect current values or default values and set all the sliders according to those*/}

      <div style={{marginLeft:'auto', marginRight:'auto', marginTop: '50px', width:'fit-content'}}></div>
      <LinnCellDiv>
        {[...Array(8).keys()].reverse().map(y=>(<LinnRowDiv key={y}>
          {[...Array(deviceColumns).keys()].map(x=> {
           const note = xyNote(x, y, baseNote, tuningOffsetSemis);
           const normNote = note % 12;

          // twelve always starts on tonic, but the note numbers do not account

           const isScale = rotatedTwelve[normNote].length > 0;
           const isTonic = normNote === tonic; // correct
           return  <LinnCell key={y*deviceColumns+x} x={x} y={y} isTonic={isTonic} isScale={isScale}>
           {isScale? namedNotes[note]:'\u00a0'}</LinnCell>
          })}
        </LinnRowDiv>))}
      </LinnCellDiv>

    </div>

  );
};

export default RtTuning;
