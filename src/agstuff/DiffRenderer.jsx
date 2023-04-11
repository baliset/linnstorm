import React from 'react';
import styled from "styled-components";

export const Other = styled.div`
  min-height: 100%;
  min-width: 100%;
  text-align: center;
  display: inline-block;
`;

export const Diff = styled(Other)`
  background-color: darkred;
  font-weight: bold;
  font-size: larger;
`;

export const  DiffRenderer = ({data, value}) => {
  if(data === undefined)
    return <></>;
  if(value === 'diff')
    return <Diff>{value}</Diff>
  return  <Other>{value}</Other>
}

