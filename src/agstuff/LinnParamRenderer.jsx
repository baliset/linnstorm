import React from 'react';
import {vfExpander, vfParamType} from "../linnutils/linn-expansion";
import styled from "styled-components";

export const colors = [
'#000', '#f00','#ffd700',
'#0f0', '#0ff','#00f',
'#f0f', '#888','#fff',
'#ffa500', '#df0','#faa'];

export const Swatch = styled.div`
    display: inline-block;
    min-width: 100%;
    min-height: 100%;
    background-color: ${p => colors[p.color]};
    color: ${p => (p.color === 0||p.color === 5)? 'white':'black'};
`;


export const  LinnParamRenderer = ({data, value}) => {
  if(data === undefined)
    return <></>

  const {nrpn} = data;

  const  pt = vfParamType(nrpn);
  const str = vfExpander(nrpn, value);

  switch(pt) {
    case 'color': return <Swatch color={value}>{str}</Swatch>
    case '': return str;
    default: return str;
  }
}

