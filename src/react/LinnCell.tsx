import styled from 'styled-components';
import React from 'react';

export const LinnCellDiv = styled.div`
  width: fit-content;
  height: fit-content;
  margin: 60px;
`
export const LinnRowDiv = styled.div`
  width: fit-content;
  height: fit-content;
`;


type LinnCellProps = {x:number; y:number; isTonic:boolean, isScale:boolean, children:any};

export const LinnCell2= styled('div')<LinnCellProps>`
  --bg:#ccc;
  --tonicColor:#0f0;
  --scaleColor:#0ff;
  --hl:#eee;
  --dim:50px;
  
  color: black;
  background-color:#ccc;
  // background-color: ${p=>p.isTonic? '#0f0': p.isScale? '#0ff' : '#ccc'};
  margin: 0;
  min-width: var(--dim);
  max-width:  var(--dim);
  min-height: var(--dim);
  max-height: var(--dim);

  font-size: x-small;
  border-right: 2px solid #555;
  border-bottom: 2px solid #555;
  border-top: 2px solid #888;
  border-left: 2px solid #888;
  
  padding-left: 4px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--hl);
    color: blue;
  }
  
`;

export const LinnCell = (p:LinnCellProps) => {
  const {x,y,isTonic,isScale, children} = p;
  const dim = 35;

  const rg = isTonic? `radial-gradient(#fff, #0f0, #ccc,  #ccc)`:
             isScale? `radial-gradient(#fff, #0ff, #ccc,  #ccc)`:
                       `radial-gradient(#ccc, #ccc)`;



  return <LinnCell2 x={x} y={y} isTonic={isTonic} isScale={isScale}>

      <div style={{
        borderRadius: `${dim + 20}px`,
        height: `${dim}px`,
        paddingTop: '10px',
        textAlign: 'center',
        width: `${dim}px`,
        background: rg,
      }}>{children}</div>

  </LinnCell2>
}
