import React, {useCallback, useState} from 'react';
import styled from 'styled-components';

const Span = styled.span`
  margin: 10px;
`;

const Heading = styled.span`
  display: inline-block;
  margin: 10px;
  text-align: right;
  min-width: 100px;
  max-width: 100px;
  font-weight: bolder;
`;


export const CheckGroup = ({heading, active, name, choices,  setChoice}) => {
  const cb = useCallback(e=>{
    console.log(`setChoice target.id: '${e.target.id}' checked: ${e.target.checked}`, e);
    setChoice(e.target.id, e.target.checked);
    },[]);


    // choices is an array of strings
    // defaultChoice
  const cc = Object.entries(choices).map(([k,v])=>(<Span key={k}>
     <input disabled={!active} type="checkbox" name={name} id={k} value={k} onChange={cb} checked={v}/>
     <label htmlFor={k}>{k}</label>
    </Span>
     ));
  return (<div><Heading>{heading}</Heading>{cc}</div>);

}
