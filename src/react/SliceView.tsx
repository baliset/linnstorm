import React from 'react';
import { useSelector } from '../actions-integration';
import styled from 'styled-components';
import {Expandit} from './ExpandIt';


const SliceDiv = styled.div`
  background-color: #fefefe;
  margin: 5px;
  padding:          5px;
  border:           1px solid #888;
  
  width:            auto;
`;

const MyTable = styled.table`
  margin: 10px 10px;
  
  width: 400px;
  border-collapse: collapse;
  border: 1px solid blue;
  
  // alternate row colors
  tbody tr:nth-child(odd) {
    background-color: #eee;
  }
  tbody tr:nth-child(even) {
    background-color: #ccc;
  }

  // property column should be right aligned value
  tbody tr td:first-child { 
    text-align:right; 
  }
  tbody tr td:nth-child(2) {
    padding-left: 1em;
  }
`

const stringize = (v:any) => JSON.stringify(v)

interface RDivProps {
  name:string|number;
  thing:any;
}

const RDiv = (props:RDivProps) => {
  const {thing, name} = props;

  const thingy:any = thing as unknown as  any;

  if(thing && (typeof thing === 'object')) {

    const len = Object.keys(thing).length;
    return (
      <Expandit title={name.toString()}>
      <MyTable>
        <tbody>
        {/*list all the properties of slice in the dialog for debugging purposes*/}
        {Object.entries(thing).map(([k, v]) => <tr key={k}>
          <td>{k}:</td>
          <td>{len? <RDiv name={k} thing={v}/>:<span>{stringize(thing)}</span>}</td>
        </tr>)}
        </tbody>
      </MyTable>
      </Expandit>);
  } else if (thingy && Array.isArray(thingy)){
    const len = thingy.length;
    return (
      <Expandit title={name.toString()}>
      <MyTable>
        <tbody>
        {
          thingy.map((v:any, i:number) =>
            <tr key={i}>
              <td>[{i}]:</td>
              <td>{len? <RDiv name={i} thing={v}/>:
                        <span>{stringize(thingy)}</span>}
              </td>
            </tr>
            )
        }
        </tbody>
      </MyTable>
      </Expandit>
      );
   } else {
        return <span>{stringize(thing)}</span>
   }
}


interface SliceViewProps {
  slice:string;
}

// given the name of a Slice extract its properties
// todo get a list of its actions and parameters
export const  SliceView = (props:SliceViewProps) => {
  const slice:Record<string, any> = useSelector((s:any)=>s[props.slice]);
  const entries = Object.entries(slice);
  return (
      <SliceDiv>
        <Expandit title={`Slice '${props.slice}'`}>
        <MyTable>
          <thead>
          <tr><th>Property</th><th>Value</th></tr>
          </thead>
          <tbody>
          {/*list all the properties of auth slice in the dialog for debugging purposes*/}
          {entries.map(([k,v])=><tr key={k}><td>{k}:</td><td><RDiv name={k} thing={v}/></td></tr>)}
          </tbody>
        </MyTable>
        </Expandit>
      </SliceDiv>
  );
}
