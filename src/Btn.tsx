import styled from 'styled-components';
import React from 'react';


export const Btn = styled.button`
  --bg:#06c;
  --hl:#0f0;

  color: #fff;
  background-color: var(--bg);
  padding: 10px 30px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 2px 8px;
  border-radius: 0 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--hl);
    color: black;
  }
`;
