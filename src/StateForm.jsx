import React from 'react';
import styled, {css} from 'styled-components';

const solidBorder =css`
  border: 1px solid black;
`;

const elementText = css`
    font-size: 12px;
    font-weight: normal;
    color: black;
    padding: 3px;
`;

const containerPadding =css`
 padding: 2px;
`;

const FsmTag = styled.div`
  overflow-y: hidden;
  background-color: #fefefe;
  margin:           10px auto; /* 15% from the top and centered */
  padding:          10px;
  border:           1px solid #888;
  width:            80%;
`;

const MachineName = styled.div`
  padding:          10px;
  font-size:        16px;
  font-weight:      bold;
  ::before {content: "Machine: "}
`;


const StTag = styled.div`
  ${solidBorder};
  display: inline-grid;
  background-color: white;
  margin: 2px;
  border:           1px solid #333;
  border-radius: 50%;
  min-width: 40px;
  text-align:center ;
  ${elementText};
  padding: 4px;

  color: blue;
`;

const EvtTag = styled.button`
  ${solidBorder};
  border-radius: 6px;
  margin:2px;
  background-color: #abf;
  :hover {
    background-color: aqua; 
  }
  ${elementText};
`;


const ContextTag = styled.div`
  margin: 5px auto;
  ${containerPadding};
  overflow: hidden;
`;

const ContextPair = styled.span`
    display:inline-block;
    margin-right: 3px;

  :not(:last-child) {
      padding-right: 10px;
      border-right: 1px dotted #aaa; 
    }
`;

const ContextVarName = styled.span`
  ${elementText};

  color: black;
  text-align: right;
  display: inline;
  width: 200px;
  /* adjust the width; make sure the total of both is 100% */
  ::after { content: ":"};
`;

const ContextVarValue = styled.span`
  ${solidBorder};
  ${elementText};

  display: inline-block;
  color: mediumslateblue;
  min-width: 40px;
  width: auto;
  /* adjust the width; make sure the total of both is 100% */
  background: white;
`;

const SectionLabel = styled.span`
  display: inline-block;
  min-width: 60px;
  font-size: 12px;
  font-weight: bold;
  text-align: right;
  margin-right:12px;
  ::after {content: ":"}
`
const PaddedDiv = styled.div`
${containerPadding};
`;


const ContextVars = ({context}) =>
<ContextTag>
    <SectionLabel>Context</SectionLabel>
    {Object.entries(context).map(([k,v],i)=><ContextPair key={i}><ContextVarName>{k}</ContextVarName><ContextVarValue>{v.toString()}</ContextVarValue></ContextPair>)}
</ContextTag>;


const extractEventTokens = (stConfig) => {
    const {states} = stConfig;
    const tokenSet = new Set();

    Object.values(states).forEach((sob)=>{
        Object.keys(sob.on || {}).forEach(k=>tokenSet.add(k))
    })
    return [...tokenSet];
}
export const  StateForm = ({expanded, stConfig}) => {

    const {id:machineName,states={},context={}} = stConfig;

    const stateList = Object.keys(states);
    const evtTokens = extractEventTokens(stConfig);

    const height = expanded? 'auto': '50px';
  return(
      <FsmTag style={{height}}>
          <MachineName>{machineName}</MachineName>
          <hr/>
          <PaddedDiv>
              <SectionLabel>States</SectionLabel>
            {stateList.map((stName,i)=>(<StTag key={i}>{stName}</StTag>))}
          </PaddedDiv>
          <hr/>
          <ContextVars context={context}/>
          <hr/>
          <PaddedDiv>
              <SectionLabel>Events</SectionLabel>
              {evtTokens.map((evtName,i)=>(<EvtTag key={i}>{evtName}</EvtTag>))}
          </PaddedDiv>
      </FsmTag>
  )
}
