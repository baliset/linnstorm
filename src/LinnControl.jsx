import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {interrogate, midiSetup, test} from "./mymidi";
import {actions, useSelector} from './actions-integration';
import {allGlobals, allParams} from "./LinnVals";
import {Btn, RBtn} from './Btn';

const btnAttrs = `
  padding-right:  10px;
  padding-left:   10px;
  margin-left: 10px;
  margin-right: 10px;
`;


const TopButton = styled.button`${btnAttrs}`;

const border = {border:'1px solid',  borderCollapse: 'collapse'};

const Td = styled.td`border: 1px solid`;
const Th = styled.th`border: 1px solid`;


const propFilter = (propName, inputf) => o => inputf === '' || o?.[propName].includes(inputf);

const  ParamSet = ({name, arr}) => {
  const [cat,setCat]         = useState('');
  const [key,setKey]         = useState('');
  const [side,setSide]       = useState('');
  const [desc, setDesc]      = useState('');
  const [subcat, setSubcat]  = useState('');
  const [filter, setFilter]  = useState('');

  const ffFilter = o => filter !== '' && (
  o?.key?.includes(filter) ||
  o?.cat?.includes(filter) ||
  o?.desc?.includes(filter)||
  o?.side?.includes(filter));


  const kFilter  = propFilter('key', key);
  const cFilter  = propFilter('cat', cat);
  const sFilter  = propFilter('side', side);

  const scFilter = propFilter('subcat', subcat);
  const dFilter  = propFilter('desc', desc);




  return !arr.length? <></>:   (
  <>
  <h3>{name}</h3>
    <input id="gfilter" name="gfilter" type="text" value={filter} onChange={event => setFilter(event.target.value)}/>
  <table style={border}>
  <tbody>
    <tr ><Th>NRPN</Th><Th>Cat</Th><Th>SubCat</Th><Th>Side</Th><Th>min/max</Th><Th>key</Th><Th>desc</Th></tr>
    <tr >
    <Th></Th>
    <Th><input id="catf"    name="catf"    type="text" value={cat}    onChange={event => setCat(event.target.value)}/></Th>
    <Th><input id="subcatf" name="subcatf" type="text" value={subcat} onChange={event => setSubcat(event.target.value)}/></Th>
    <Th><input id="sidef"   name="sidef"   type="text" value={side}   onChange={event => setSide(event.target.value)}/></Th>
    <Th></Th>
    <Th><input id="keyf"    name="keyf"    type="text" value={key}   onChange={event => setKey(event.target.value)}/></Th>
    <Th><input id="descf"   name="descf"   type="text" value={desc}  onChange={event => setDesc(event.target.value)}/></Th>
    </tr>

    {arr.filter(o=>
      (filter === '' && (kFilter(o) && dFilter(o) && scFilter(o) && cFilter(o)) && sFilter(o)) || (ffFilter(o))
    ).map(o=>
      <tr key={o?.nrpn}>
        <Td>{o?.nrpn}</Td>
        <Td>{o?.cat}</Td>
        <Td>{o?.subcat}</Td>
        <Td>{o?.side}</Td>
        <Td>{o?.min}-{o?.max}</Td>
        <Td>{o?.key}</Td>
        <Td>{o?.desc}</Td>
      </tr>)}
  </tbody>
 </table>
 </>
  )

  }

const  LinnControl = ({rows}) => {
  // useEffect(()=>{
  //
  //
  // }, []);


  function loadIntoColumn(key,prop)
  {
    const s = localStorage.getItem(key);
    const o = JSON.parse(s);

    // apply the data that was saved
    rows.forEach(row=>row[prop] = o[row.nrpn]);
  }

  const presets = Object.keys(localStorage);

   return  (
            <div style={{padding:'5px'}}>
              <Btn onClick={()=>{interrogate()}}>Interrogate</Btn>
              <Btn onClick={()=>{test()}}>Test</Btn>

              <h3>Stored Settings</h3>
              <ul>
                {presets.map(k=>
                  <li key={k}>
                    Load '{k}' Into Column:
                    <RBtn onClick={()=>loadIntoColumn(k,'a')}>A</RBtn>
                    <RBtn onClick={()=>loadIntoColumn(k,'b')}>B</RBtn>
                  </li>)}
              {/*  {midiInputs?  midiInputs?.map((o,i)=>(<li key={o.name}>{o.name}</li>)): <p>No Midi Inputs found</p> }*/}

              {/*</ul>*/}

              {/*<ul>*/}
              {/*  {midiOutputs? midiOutputs?.map((o,i)=>(<li key={o.name}>{o.name}</li>)): <p>No Midi Outputs found</p>}*/}
              </ul>


            </div>

    );
};

export default LinnControl;
