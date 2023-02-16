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
`

export const LinnCell = styled.button`
  --bg:#ccc;
  --hl:#eee;
  --dim:50px;
  
  color: black;
  background-color: var(--bg);
  margin: 0;
  min-width: var(--dim);
  max-width:  var(--dim);
  min-height: var(--dim);
  max-height: var(--dim);

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
