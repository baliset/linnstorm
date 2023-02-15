import React, {useEffect, useRef, useState} from 'react';
import { Route, Routes, NavLink, useLocation } from "react-router-dom"


import styled from 'styled-components';

import {Modal} from "./Modal";
import {RtParameter} from "./RtParameters";
import { linnPropColumnDefs} from "./xform/columndefs";
import {actions, useSelector} from './actions-integration';


import {isNumber} from "luxon/src/impl/util";
import {SliceView} from "./SliceView";
import {SnackbarProvider, useSnackbar} from "notistack";
import {NotifyWrapper} from "./NotifyWrapper";
import {currentLinnParams, midiSetup, rowData} from "./mymidi";
import LinnScalesModes from "./LinnScalesModes";
import {RtMidiview} from "./RtMidiview";

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

const Navbar = styled.section`
    grid-area: Navbar;
    padding-top: 5px;
    background-color: ${palette.midnight};
    color: ${palette.drab};
`;
const Footer = styled.section`
    grid-row-start:3; 
    grid-column-start:1; grid-column-end:4;
    background-color: ${palette.blueslate};
    color: ${palette.drab};
`;

const CenterBody = styled.section`
    display: block;
    height:100%;
    grid-area: CenterBody;
    background-color: ${palette.drab};
    color: ${palette.black};
`;
const Left = styled.section`
    grid-area: Left;
    background-color: ${palette.cornsilk};
    color: ${palette.midnight};
`;
const Right = styled.section`
    grid-area: Right;
    background-color: ${palette.cornsilk};
    color: ${palette.midnight};
`;


const closef=()=>console.warn('closing');




const gridMap = {
    Trades: 'aTrades',
    Quotes: 'aQuotes',
    Parties: 'aParties'
};

const secondsFormatter = (params)=>isNumber(params.value)? params.value.toFixed(2):undefined;


let interval;

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
const TopButton = styled.button`${topCssAttributes}`;

const StyledLink =  styled(NavLink)`
  display: inline-block;
  background: ${props=>props?.$active? '#0f0': 'antiquewhite'};
  min-width: 100px;
  border: 1px solid white;
  margin: 0px;
  padding: 5px;
  
  &:active {
    color: red;
  }
  
  &:hover {
    background: palegreen;
  }
  
  border-radius: 3px;
  
  & > * {
    color: orange;
    text-decoration: none;
  }
`;


const MyNavLink = ({to, children, curPath})=> {
  return <StyledLink $active={curPath === to} to={to}>{children}</StyledLink>
}


const AllSlices = () => <div>{Object.keys(actions).map((slice)=><SliceView key={slice} slice={slice}/>)}</div>;

const wholeSeconds = (seconds) => seconds.toLocaleString('en-US', {minimumIntegerDigits:3, maximumFractionDigits:0});

let messageCtr = 0;



const Intro = () => <section><h1>Intro</h1><p>Welcome</p></section>


midiSetup( actions.linn);

const  App = () => {
  const [showSlices, setShowSlices] = useState(false);
  const [filter, setFilter]  = useState('');
  const location = useLocation();

  const ffFilter = o => filter === '' ||(
    o?.key?.includes(filter) ||
    o?.cat?.includes(filter) ||
    o?.desc?.includes(filter)||
    o?.side?.includes(filter));



  // useSelector got complex because we didn't compensate for adding slices
  // resimplify after adding some types to make this easier
  const {
    local:    {layout:   {left,right}},
    notify:   {notices:[notice=undefined]},
    } = useSelector(s=>s);


  const {info,warn,error,fatal,dismiss} = actions.notify;

  const {  toggleLeft, toggleRight, } = actions.local;

  const columnDefs =  linnPropColumnDefs;

   return  (
   <SnackbarProvider maxSnack={5} hideIconVariant
                     anchorOrigin={{vertical: "top", horizontal: "right",}}
                     >
     <NotifyWrapper />
        <Layout left={left} right={right}>

            <Navbar>


              <div style={{ margin: 'auto', width: '50%'}}>
              <MyNavLink curPath={location.pathname} to="/">Intro</MyNavLink>
              <MyNavLink curPath={location.pathname} to="/params">Parameters</MyNavLink>
              <MyNavLink curPath={location.pathname} to="/tuning">Scales & Modes</MyNavLink>
              <MyNavLink curPath={location.pathname} to="/midi">Midi View</MyNavLink>
              </div>

            </Navbar>
            <Left>
              <TopButton onClick={()=>{toggleLeft(100)}}>Left</TopButton>

              <TopButton onClick={()=>fatal({msg:`${messageCtr++}: I am fatal`})}>Fatal Message</TopButton>
              <TopButton onClick={()=>error({msg:`${messageCtr++}: Seen one error`, remedy:'Acknowledge'})}>Error Message</TopButton>
              <TopButton onClick={()=>warn({msg:`${messageCtr++}: This is a warning with Modal as a remedy`, remedy:'Modal'})}>Modal Warning</TopButton>
              <TopButton onClick={()=>warn({msg:`${messageCtr++}: This is a warning with Acknowledge as a remedy`, remedy:'Acknowledge'})}>Warning</TopButton>
              <TopButton onClick={()=>{toggleRight(900)}}>Toggle Slice View</TopButton>

            </Left>


          <CenterBody>

            {notice && notice.level === 'fatal'?
              <Modal content={notice.msg} noClose/>
                :
              (notice && notice.remedy === 'Modal')? /*Modal isn't really one of the options */
                <Modal content={<div><h1>{notice.level}</h1><hr/>{notice.msg}</div>} close={()=>{dismiss(notice.key)}}/>
                :
                <>
                  <Routes>
                    <Route path="/" element={<Intro/>}/>
                    <Route path="/params" element={<RtParameter/>}/>
                    <Route path="/tuning" element={<LinnScalesModes/>}/>
                    <Route path="/midi" element={<RtMidiview/>}/>

                  </Routes>
                </>
            }
          </CenterBody>

            <Right><AllSlices/></Right>
        </Layout>
   </SnackbarProvider>
    );
};


export default App;
