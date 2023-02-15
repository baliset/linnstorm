import React, {useCallback, useEffect, useRef, useState} from 'react';

export const  CheckboxRenderer = ({node, column, value}) => {
  const click = useCallback(e => node.setDataValue(column.colId, e?.target?.checked),[]);
  return <input type="checkbox" onChange={click} checked={value ?? false}/>
}

