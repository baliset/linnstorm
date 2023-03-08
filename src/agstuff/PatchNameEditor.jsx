//https://ag-grid.com/react-data-grid/component-cell-editor/
import React, {forwardRef, useEffect, useState, useRef, useImperativeHandle, useCallback} from "react";
import {isSpecialPatchName, isSpecialName} from '../actions/patch-slice'


// add code here to get the actions installed it needs to rename a patch
// and to refresh

let patchActions;

// todo maybe move actions into the cellEditorParams somehow instead
export function PatchNameEditorInit(actions)
{
  patchActions = actions;
}

export const PatchNameEditor = forwardRef((props, ref) => {
  const [tempValue, setTempValue] = useState(props.value);
  const [oValue, _] = useState(props.value);
  const refInput = useRef(null);

  const chValue = useCallback((evt)=>{setTempValue(evt.target.value)},[]);
  const blValue = useCallback((evt)=>{
    if(evt.target.value !== oValue)
      patchActions.rename(oValue, evt.target.value);
  },[oValue]);

  useEffect(()=> refInput.current.focus(), []);   // focus on the input

  useImperativeHandle(ref, () => {
    return {   /* Component Editor Lifecycle methods */
      // the final value to send to the grid, on completion of editing
      getValue() { return tempValue}, // value and input are identical here
      isCancelBeforeStart() {return isSpecialPatchName(tempValue)},
      isCancelAfterEnd() {return isSpecialName(tempValue)}         // reject any change to a special property name
    };
  });

  return <input type="text" ref={refInput} value={tempValue}  onChange={chValue} onBlur={blValue} style={{width: "100%"}}/>;
});
