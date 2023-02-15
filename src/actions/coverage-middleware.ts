import {SliceInfo} from './coverage-slice';
import {oReduce} from '../utils/oreduce';
import {Action, NextF} from '../actions-integration/types';

type SliceActions = Record<string, unknown>;
type AllSliceActions = Record<string, SliceActions>;

// unpopulated
let sliceInfos:Record<string, SliceInfo>;
let sliceTimers:Record<string, ReturnType<typeof setTimeout>|null>;
let coverageActions:any; // there must be an auth slice

const kReportAfterNHits:number = 100;   // move to configuration, this an time to report activity that doesn't hit quantity threshold
const kReportAfterNSeconds:number = 30;

const createSliceInfo = (name:string, sas: SliceActions):SliceInfo => {
  return {
    sliceName:name,
    hits:0,
    lastUpdated:0,
    percentCoverage:0,
    sliceCoverage: oReduce(Object.keys(sas), (k:string)=>[k,0]) // curiously typescript should have inferred k is a string
  };
}

const reportNow = (slice:string, sliceInfo:SliceInfo) => {
  const timer = sliceTimers[slice];
  if(timer) {
    clearTimeout(timer);
    sliceTimers[slice] = null;
  }
  coverageActions.updateSlice(sliceInfo);
}

const reportLater = (slice:string) => {

  // clearing timer should never be necessary here, if it is there is a bug
  //const timer = sliceTimers[slice];
  // if(timer)
  //   clearTimeout(timer);

  sliceTimers[slice] = setTimeout(()=>coverageActions.updateSlice(sliceInfos[slice]),kReportAfterNSeconds* 1000);
}

// records hits, which eventually produce their own action, either every so many hits on a slice, or
// after at least one hit and a minimum time has passed (e.g. one minute)
const hit = (slice:string, action:string) => {
  const sliceInfo:SliceInfo = sliceInfos[slice];
  const hits = ++sliceInfo.hits;
  sliceInfo.sliceCoverage[action]++; // update individual item
  sliceInfo.lastUpdated = Date.now();

  const hitsMod = hits % kReportAfterNHits;

  if(hitsMod === 0)
    reportNow(slice, sliceInfo);
  else if(hitsMod === 1)
    reportLater(slice);

  // it will be reported when threshold is hit, or at least as frequently as once per (e.g. minute) if it changed
}

export const coverageMiddleware = (store:any) => (next:NextF) => (a:Action)=> {
  const aType = a.type || '';

  const [slice,action] = aType.split('/');   // decode which slice it is from
  const result = next(a);                             // process the action first
  hit(slice,action);                                  // record it as a hit
  return result;
}

export const coverageMiddlewareInit = (actions:AllSliceActions) =>
{
  sliceInfos = oReduce(Object.entries(actions),([k,v]:[string, SliceActions])=>[k, createSliceInfo(k,v)]);
  sliceTimers = oReduce(Object.keys(actions), (k:string)=>[k,0]); // setup timer per slice if for when it has unreported hits
  coverageActions = actions.coverage;
};

