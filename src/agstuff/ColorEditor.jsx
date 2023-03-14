import React, {forwardRef, useRef, useState, useEffect, useImperativeHandle, memo, useCallback} from "react";
import {Swatch} from "./LinnParamRenderer";
import styled from "styled-components";
const colorNames = ['(no change)','red','yellow','green','cyan','blue','magenta','(no color)','white','orange','lime','pink'];


export const SmallSwatch = styled(Swatch)`
   text-align: center;
   padding-top: 10px ;
   &:hover {
   font-weight: bold;
   }
`;


const KEY_BACKSPACE = 'Backspace';
const KEY_F2 = 'F2';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

// problem with color editor is that it cannot be

const grColorStyle = {
  // width: `${60*4}px`,
  // height: `${45*3}px`,
  display:'grid',
  gridTemplateColumns: '76px 42px 42px 42px',
  gridTemplateRows:'33px 33px 33px',
  gridColumnGap: '2px',
  gridRowGap:'2px',
};
const orderedColors = [0,1,9,2,7,10,3,4,8,5,6,11];
export const ColorEditor = memo(
  forwardRef((props, ref) => {
    const [color, setColor] = useState(null);
    const [tempColor, setTempColor] = useState(props.value ?? 7); // todo 7 is hardcoded no color color

    const refContainer = useRef(null);
    useEffect(() => {color !== null &&  props.stopEditing()}, [color]);

    useImperativeHandle(ref, () => ({getValue() {return color;}}));
    return (
      <div ref={refContainer} style={grColorStyle}>
        {orderedColors.map((colno,idx)=><SmallSwatch  style={{textDecoration: (colno===tempColor? 'underline':'unset'), gridRowStart:Math.trunc(idx/4)+1,  gridColumnStart:(idx%4)+1}} key={idx} color={colno} onClick={()=>setColor(colno)}>{colorNames[colno]}</SmallSwatch>)}
      </div>
    );
  })
);

// need to modify this to be a generic editor, and merge a generic editor with special purpose editors based on the range of nrpn values
// export const PatchCommentEditor = forwardRef((props, ref) => {
//   const [editText, setEditText] = useState(props.value);
//   const [oValue, _] = useState(props.value);
//   const refInput = useRef(null);
//
//   const chValue = useCallback((evt)=>{setEditText(evt.target.value)},[]);
//   const blValue = useCallback((evt)=>{
//     console.log(`patchname editor available props are `, props);
//
//     if(evt.target.value !== oValue) {
//       const {name, data} = props.node.data;
//       patchActions.save(name, evt.target.value, data);
//     }
//
//   },[oValue]);
//
//   useEffect(()=> refInput.current.focus(), []);   // focus on the input
//
//   useImperativeHandle(ref, () => {
//     return {   /* Component Editor Lifecycle methods */
//       getValue()            { return editText; }, // value and input are identical here
//       isCancelBeforeStart() { return false;    },
//       isCancelAfterEnd()    { return false;    }, // reject any change to a special property name
//     };
//   });
//
//   return <input type="number" ref={refInput} value={editText}  onChange={chValue} onBlur={blValue} style={{width: "100%"}}/>;
// });
