import React, {useCallback} from 'react';
import { Route, Routes, NavLink, useLocation } from "react-router-dom"

import styled from 'styled-components';

import {actions, useSelector} from '../actions-integration';
import {JSONTree} from 'react-json-tree';

import {SnackbarProvider} from "notistack";

import {NotifyWrapper} from "./NotifyWrapper";
import {Modal} from "./Modal";
import {SliceView} from "./SliceView";
import {RtParameter} from "./RtParameters";
import RtTuning from "./RtTuning";
import {RtMidiview} from "./RtMidiview";
import {RtFiles} from "./RtFiles.jsx";
import {midiSetup} from "../linnutils/mymidi.ts";

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
    grid-template-rows: 30px minmax(0, 1fr);
    grid-template-areas: "LNavbar Navbar Navbar"
                         "Left CenterBody Right";
`;

Layout.defaultProps = {left:200, right:0};

const Navbar = styled.section`
    grid-area: Navbar;
    padding-top: 5px;
    background-color: ${palette.midnight};
    color: ${palette.drab};
    height:fit-content;
    overflow: auto;
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



const topCssAttributes = `
  padding-right:          5px;
  padding-left:          5px;
  margin-left: 5px;
  margin-right: 5px;
`;


const TopButton = styled.button`${topCssAttributes}`;

const StyledLink =  styled(NavLink)`
  display: inline-block;
  background: ${props=>props?.$active? '#0f0': 'antiquewhite'};
  min-width: 100px;
  border: 1px solid white;
  margin: 0;
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


let messageCtr = 0;



const Intro = () =>{
  const { local } = useSelector(s=>s);
  const should = useCallback(()=>true,[]);
  return (
  <section>
    <h1>Configuration Info</h1>
    <div style={{width:'fit-content'}}>
      <JSONTree data={local.config}
                hideRoot={true} sortObjectKeys={false}
                shouldExpandNodeInitially={should} />
    </div>

  </section>);
}


midiSetup( actions.midi);

const  App = () => {
  const location = useLocation();




  // useSelector got complex because we didn't compensate for adding slices
  // resimplify after adding some types to make this easier
  const {
    local:    {layout:   {left,right}},
    notify:   {notices:[notice=undefined]},
    } = useSelector(s=>s);


  const {warn,error,fatal,dismiss} = actions.notify;

  const {  toggleLeft, toggleRight, } = actions.local;

   return  (
   <SnackbarProvider maxSnack={5} hideIconVariant
                     anchorOrigin={{vertical: "top", horizontal: "right",}}
                     >
     <NotifyWrapper />
        <Layout left={left} right={right}>

            <Navbar>
              <div style={{ margin: 'auto', width: '50%', display: 'inline-block'}}>
              <MyNavLink curPath={location.pathname} to="/">Intro</MyNavLink>
              <MyNavLink curPath={location.pathname} to="/params">Parameters</MyNavLink>
              <MyNavLink curPath={location.pathname} to="/tuning">Tuning</MyNavLink>
              <MyNavLink curPath={location.pathname} to="/midi">Midi View</MyNavLink>
              <MyNavLink curPath={location.pathname} to="/files">Import/Export Settings</MyNavLink>

              </div>
              <div style={{float:'right', display: 'inline-block', marginRight:'20px'}}>
                <a style={{color:'white', textDecoration:'none', font: 'Roboto', }}
                href="https://www.netlify.com">
                <span style={{verticalAlign: 'top', fontStyle: 'italic'}}>deployed via</span> <img height="20px" src="/netlify/full-logo-dark.svg" alt="Netlify"/></a>
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
                    <Route path="/tuning" element={<RtTuning/>}/>
                    <Route path="/midi" element={<RtMidiview/>}/>
                    <Route path="/files" element={<RtFiles/>}/>


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
