import React, {useState, useEffect, useCallback} from 'react';
import {Uploader} from "./Uploader";
import {Downloader} from "./Downloader";
import jsyaml from 'js-yaml';


const filename = 'linnstorm.settings.yaml';
const uploadLabel = 'choose a settings file to upload...';
const downloadLabel = `Click to download as ${filename}`;

function parseSettings(data) {
  return data? Object.keys(data): ['nothing'];
}

export const  RtFiles = () => {
  const [dataToDownload, setDataToDownload] = useState(undefined);
  const [dataUploaded, setDataUploaded] = useState(undefined);
  useEffect(()=>setDataToDownload({...localStorage}),[]); // grab a copy of everything in local storage
  const consumeUploaded = useCallback((content)=>{
    const data = jsyaml.load(content);
    console.log(`setDataUploaded`, data);
    setDataUploaded(data)

  }, []);   // do something with the uploaded data



  return  (
      <div>
        <Uploader label={uploadLabel} consumeUploaded={consumeUploaded}/>
        <hr/>
        <Downloader label={downloadLabel} saveAs={filename} data={dataToDownload}/>
        <hr/>
        Settings you uploaded:
        <ul>
          {parseSettings(dataUploaded).map(it=><li>{it}</li>)}
        </ul>
      </div>
    );
};
