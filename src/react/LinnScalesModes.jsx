import React, {useCallback} from 'react';
import styled from 'styled-components';
import {actions, useSelector} from '../actions-integration';
import {pitchClass} from "../linnutils/linn-expansion";

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

  &:hover { background: linear-gradient(to bottom, #fff 0%, #e9e9e9 100%) };

`;

const BlackKey = styled(WhiteKey)`
  color: white;
  background: linear-gradient(45deg,#222 0%,#555 100%);
  //&:hover { background:linear-gradient(to right,#444 0%,#222 100%) }
`;

const Keyboard = styled.div`
  width: max-content;
  padding: 1em 1em 1em 1em;
  border-radius:10px;
  background: #103;
  box-shadow:0 0 50px rgba(0,0,0,0.5) inset,0 1px rgba(212,152,125,0.2) inset,0 5px 15px rgba(0,0,0,0.5)
`;

const SLabel = styled.label`color: white`;


const btnAttrs = `
  padding-right:  10px;
  padding-left:   10px;
  margin-left:    10px;
  margin-right:     10px;
`;


const ScaleBtn = styled.button`${btnAttrs}`;

const border = {border:'1px solid',  borderCollapse: 'collapse'};

const propFilter = (propName, inputf) => o => inputf === '' || o?.[propName].includes(inputf);

const whChars = [0, "h", "w", "w+h"]
const patternToWh = a => a.map(v=>whChars[v]).join(', ');

const keyText = (tonic, scaleMappedToKeys, i) => {
  if(i < tonic || i > tonic+11)
    return '';
  return scaleMappedToKeys[i%12] || ''
};

const  LinnScalesModes = ({rows}) => {
    const {
      linn:  {tonic, scaleIndex, scaleName, scaleType, scaleCount, scaleSteps, scaleNotes, scaleMappedToKeys},
      } = useSelector(s=>s);
  const changeT = useCallback(e => actions.linn.tonic(Number(e.target.value)),[]);
  const changeSc = useCallback(e => actions.linn.scale(Number(e.target.value)),[]);


  return  (

      <div>

        <Keyboard>
          <div style={{paddingLeft: '10px'}}>
            <SLabel>Tonic on {pitchClass[tonic]}</SLabel>
            <TSlider  color="red" name="Tonic" type="range" min="0" max="11" defaultValue={ tonic } onChange={ changeT }/>

            <SLabel>Scale Selection:  ({scaleType} notes: {patternToWh(scaleSteps)}) {scaleName}</SLabel>
            <TSlider  color="blue" name="Scale" type="range" min="0" max={scaleCount-1} defaultValue={ scaleIndex } onChange={ changeSc }/>

            <SLabel>Scale Notes: {scaleNotes.map(sn=>pitchClass[sn]).join(",")}</SLabel>
          </div>


          {[0,-1,2,-3,4,5,-6,7,-8,9,-10,11,12,-13,14,-15,16,17,-18,19,-20,21,-22,23].map(v=>{
            const black = v<0;
            return black?<BlackKey key={v} pn={-v} t={tonic}>{keyText(tonic, scaleMappedToKeys, -v)}</BlackKey>:
                         <WhiteKey key={v} pn={ v} t={tonic}>{keyText(tonic, scaleMappedToKeys,  v)}</WhiteKey>;
          })}


        </Keyboard>

    </div>

  );
};

export default LinnScalesModes;
