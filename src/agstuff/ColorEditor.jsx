import React, {forwardRef,useRef, useState, useEffect,  useImperativeHandle, memo} from "react";
import ReactDOM from 'react-dom';
import {colors, SmallSwatch} from "./LinnParamRenderer";
const colorNames = ['!as set!','red','yellow','green','cyan','blue','magenta','!off!','white','orange','lime','pink'];


const KEY_BACKSPACE = 'Backspace';
const KEY_F2 = 'F2';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

// problem with color editor is that it cannot be

const grcolorStyle = {


}
const numColors = colors.length;
export const ColorEditor = memo(
  forwardRef((props, ref) => {

    const [ready, setReady] = useState(false);
    const [tempColor, setTempColor] = useState(props.value ?? 7); // todo 7 is hardcoded no color color
    const [color, setColor] = useState(null);
    const refContainer = useRef(null);

    const applyKeyboardChanges = (event) => {
      if (ready) {
        switch(event.key) {
          case 'ArrowLeft':  setTempColor((tempColor + numColors - 1)%numColors); event.stopPropagation(); break;
          case 'ArrowRight': setTempColor((tempColor + 1) % numColors); event.stopPropagation(); break;
          case KEY_ENTER:    setColor(tempColor); event.stopPropagation(); break;
        }
      }
    };

    useEffect(() => { ReactDOM.findDOMNode(refContainer.current).focus(); setReady(true);}, []);
    useEffect(() => {
      window.addEventListener('keydown', applyKeyboardChanges);
      return () => window.removeEventListener('keydown', applyKeyboardChanges);
    }, [applyKeyboardChanges, ready]);

    useEffect(() => {color !== null &&  props.stopEditing()}, [color]);

    useImperativeHandle(ref, () => ({getValue() {return color;}}));

    return (
      <div ref={refContainer} tabIndex={1} style={grcolorStyle}>
        {colors.map((c,i)=><SmallSwatch tabIndex={i+1} style={{border: `1px solid ${c===tempColor? 'black':'transparent'}`}} key={i} color={i} onClick={()=>setColor(i)}>{colorNames[i]}</SmallSwatch>)}
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
