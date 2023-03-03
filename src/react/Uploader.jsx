import React, {useState, useEffect, useCallback, useRef} from 'react';
import {ActionButton} from './Btn';

const accepted   = "application/yaml,application/json";
const uploaderId = 'uploader';

export const Uploader = ({label, consumeUploaded}) => {
  const refInput = useRef(null);
  const [status, sStatus] = useState('not loaded');
  const [preview, sPreview] = useState('nothing to see yet...');
  const [contents, sContents] = useState('');
  const btnClick = useCallback((evt)=>refInput.current.click(),[refInput]);

  const openFile = useCallback((evt)=>{
    const fileObj = evt.target.files[0];
    const fileloaded = e => {
      const {result} = e.target;
      sContents(result); // for display confirmation purposes
      consumeUploaded(result); // passed in to process the information
      sStatus(`file:'${fileObj.name}' length:${contents.length} bytes`);
      sPreview(contents.substring(0, 80)); // show first 80 characters
    }
    const reader = new FileReader();
    reader.onload = fileloaded;
    reader.readAsText(fileObj); // todo asText? or something else?

  },[]);

  return(<div>
    <ActionButton onClick={btnClick}>{label}</ActionButton>
    <input ref={refInput} style={{display:'none'}} type="file" multiple={false} onChange={openFile} accept={accepted}/>
    <hr/>
    <p>{status}</p>
    <p>{preview}</p>
    <textarea style={{width:'800px'}} value={contents} readOnly/>
    <hr/>
  </div>);
}
