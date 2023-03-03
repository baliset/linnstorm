import React, { useState, useEffect} from 'react';
import {Uploader} from "./Uploader";
import {Downloader} from "./Downloader";


const filename = 'linnstorm.settings.yaml';
const uploadLabel = 'choose a settings file to upload...';
const downloadLabel = `Click to download as ${filename}`;
const data = {a:1};
export const  RtFiles = () => {
   return  (
      <div>
        <Uploader label={uploadLabel} sendContent={(content)=>console.log(`received content`)}/>
        <hr/>
        <Downloader label={downloadLabel} saveAs={filename} data={data}/>
      </div>
    );
};
