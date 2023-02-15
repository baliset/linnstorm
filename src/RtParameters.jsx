import React, { useState} from 'react';
import styled from 'styled-components';
import {MyGrid} from "./MyGrid";
import { linnPropColumnDefs} from "./xform/columndefs";
import LinnControl from "./LinnControl";
import {currentLinnParams, rowData} from "./mymidi";

const palette = {
      plum: '#4b54a1',
      black: '#0c0e0d',
      blueslate: '#465f73',
      slate: '#5f5f7b',
      drab: '#b1c3a9',
      sky: '#5e86ba',
      moon: '#b3961e',
      midnight: '#0b2383',

      gold: 'gold',
      cornsilk: 'cornsilk',
      blue: 'blue',
      forest: 'forestgreen',
      crimson: 'crimson'
};

const Layout = styled.div`
    display:grid;
    height: calc(100vh);
    width: calc(100vw);
    
    row-gap:4px;
    column-gap:4px;

    grid-template-columns: ${props=>props.left}px minmax(0, 1fr) ${props=>props.right}px;
    grid-template-rows: 30px minmax(0, 1fr) 30px;
    grid-template-areas: "Navbar Navbar Navbar"
                         "Left CenterBody Right"
                         "Footer Footer Footer";    
`;

Layout.defaultProps = {left:200, right:0};


const CenterBody = styled.section`
    display: block;
    height:100%;
    grid-area: CenterBody;
    background-color: ${palette.drab};
    color: ${palette.black};
`;


const topCssAttributes = `
  padding-right:          5px;
  padding-left:          5px;
  margin-left: 5px;
  margin-right: 5px;
`;

const TopItem   = styled.span`
${topCssAttributes}
:after {
  content: '\\00a0\\00a0'; // effectively nbsp
  width: 0;
  //height: 100%;
  border-right: 1px solid white;
  top: 0;
  bottom: 0;
}
  
`; // sharing attributes since don't want button to inherit span


const kLinnDefaults = 'LinnStrument.Defaults';

function loadMyFaves(rows)
{
  const s = localStorage.getItem('hzsetting1');
  const o = JSON.parse(s);

  // apply the data that was saved
  rows.forEach(row=>row.b = o[row.nrpn]);
}
function saveAsLinnDefaults()
{
  const v = JSON.stringify(currentLinnParams)
  localStorage.setItem(kLinnDefaults,v);
}

function saveAsFave(name)
{
  const v = JSON.stringify(currentLinnParams)
  localStorage.setItem(name,v);
}


function loadLinnDefaults(rows)
{
  const s = localStorage.getItem(kLinnDefaults);
  const o = JSON.parse(s);

  // apply the data that was saved
  rows.forEach(row=>row.d = o[row.nrpn]);
}

const getRowNodeId = data=>data.nrpn

export const  RtParameter = () => {
  const [filter, setFilter]  = useState('');

  const ffFilter = o => filter === '' ||(
    o?.key?.includes(filter) ||
    o?.cat?.includes(filter) ||
    o?.desc?.includes(filter)||
    o?.side?.includes(filter));

  // loadMyFaves(rowData);
  // loadLinnDefaults(rowData);


  const columnDefs =  linnPropColumnDefs;

   return  (
      <>
      <LinnControl rows={rowData}/>
      Filter: <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
      <MyGrid rowData={rowData.filter(ffFilter)} columnDefs={columnDefs} getRowNodeId={getRowNodeId}/>
      </>
    );
};
