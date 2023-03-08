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

// todo make the uploader accept yaml files without having to set finder to all files each time
// look into putting a modal dialog into a route
// look into how to pass a tag into a function to use as a child for one of its rendered tags
// https://stackoverflow.com/questions/39652686/pass-react-component-as-props
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
