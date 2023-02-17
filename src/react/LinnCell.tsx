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


type LinnCellProps = {x:number; y:number; isTonic:boolean, isScale:boolean};

export const LinnCell= styled('div')<LinnCellProps>`
  --bg:#ccc;
  --tonicColor:#0f0;
  --scaleColor:#0ff;
  --hl:#eee;
  --dim:50px;
  
  color: black;
  background-color: ${p=>p.isTonic? '#0f0': p.isScale? '#0ff' : '#ccc'};
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
  
  padding: 10px 10px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--hl);
    color: blue;
  }
  
`;

