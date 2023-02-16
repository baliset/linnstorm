import React, {SyntheticEvent, useState} from 'react';
import styled from 'styled-components';

const MyDiv = styled.div`
  border:           1px solid #060;
`;


interface ExpanditProps {
  title:string;
  children?: React.ReactNode;
}



export const Expandit = (props:ExpanditProps) => {
  const [expanded, setExpanded] = useState(false);
  const {title, children} = props;
    return (
      <MyDiv onClick={(e:SyntheticEvent)=>{setExpanded(!expanded); e.stopPropagation()}}>
      {title}<br/>
      {expanded && <div>{children}</div>}
      </MyDiv>
    );

}

