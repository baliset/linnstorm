import styled from 'styled-components';
import React from 'react';


export const Btn = styled.button`
  --bg:#06c;
  --hl:#0f0;

  color: #fff;
  background-color: var(--bg);
  margin-right: 7px;
  padding: 10px 20px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 2px 8px;
  border-radius: 0 16px;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--hl);
    color: black;
  }
`;

// radio-ish buttons
export const RBtn = styled(Btn)`
  margin-left: 7px;
  margin-right: 0px;
  padding: 5px 10px;
  border-radius: 24px 24px;

`
