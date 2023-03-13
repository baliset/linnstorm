import React from 'react';
import {DateTime} from "luxon";
const dtfmt = "MMM dd HH:mm:ss";

function myformat(n)
{
  return DateTime.fromMillis(n).toFormat(dtfmt);
}

export const  UpdatedRenderer = ({data, value}) => {
  if(data === undefined)
    return <></>

  return <span style={{fontFamily: 'monospace'}}>{myformat(value)}</span>
}

