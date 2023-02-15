import axios from "axios";
// @ts-ignore
import jsYaml from "js-yaml";


export interface ConfigSingleton {
  queryParams: Record<string,string>;
  [key:string]: Record<string, any>;
}

// function deepFreeze(o:any)
// {
//   Object.freeze(o);
//   Object
//     .getOwnPropertyNames(o)
//     .forEach(prop=>deepFreeze(o[prop]));
// }

async function fetchConfig(url:string):Promise<any>
{

  console.info(`fetching configuration at ${url}`);
  let result;
  try {
    result = (await axios.get(url)).data;
    if(url.endsWith(".yaml"))
      result = jsYaml.load(result);
  } catch(err) {
    console.error(`Could not load configuration from ${url}`, err);
    throw err;
  }
  return result;
}

export let promisedConfig:ConfigSingleton|null = null;


export class Config
{
  public static queryParams(): Record<string, any>
  {
    return Object?.fromEntries([...new URLSearchParams(globalThis?.location?.search)]);
  }
  public static async fetch(explictUrl?:string): Promise<ConfigSingleton>
  {
    const qp = this.queryParams();
    const configUrl = explictUrl || `/config/${qp.config}`;
    const configObject:ConfigSingleton = await fetchConfig(configUrl);
    configObject.queryParams = qp;
    Object.freeze(configObject);
    promisedConfig = configObject;
    return promisedConfig;
  }
  public static singleton():ConfigSingleton
  {
    if(promisedConfig)
      return promisedConfig;
    throw new Error(`singleton referenced before fetch`);
  }

}
