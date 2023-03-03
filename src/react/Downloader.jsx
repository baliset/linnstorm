import React, {useState, useEffect, useCallback, useRef} from 'react';
import jsyaml from 'js-yaml';
import {ActionButton} from './Btn';


function objectToBlob(o) {
  const dataToSaveYaml = jsyaml.dump(o, {
    skipInvalid:true, noCompatMode:true,
    styles: {'!!null':'canonical', '!!int':'hexadecimal'}});
    return new Blob([dataToSaveYaml], {type: 'application/yaml'});
}

export const Downloader = ({label,data,saveAs}) =>{
  const [clickCt, setClickCt] = useState(0);
  const [url, setUrl]         = useState('');
  const refDownloader         = useRef(null);
  const btnClick              = useCallback((evt)=>{
    refDownloader.current.click();
    const currentUrl = url;
    setTimeout(()=>{
      URL.revokeObjectURL(currentUrl);
      setUrl('');
      setClickCt(clickCt+1);
    },0);

  },[refDownloader]);
  useEffect(()=>{
    const aBlob = objectToBlob(data);
    setUrl(URL.createObjectURL(aBlob));
  },[data, clickCt]);

  return (<>
    <ActionButton onClick={btnClick}>{label}</ActionButton>
    <a style={{display:'none'}} download={saveAs} href={url} ref={refDownloader}/>
  </>);
}
