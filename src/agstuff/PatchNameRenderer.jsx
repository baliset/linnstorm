import React from 'react';


export const  PatchNameRenderer = ({data, value}) => {
  if(data === undefined)
    return <></>
  if(value === '*')
    return <span style={{fontStyle: 'italic',  color:'blue'}}>saved Column A</span>
  return  <span style={{fontStyle: 'bolder',}}>{value}</span>
}

