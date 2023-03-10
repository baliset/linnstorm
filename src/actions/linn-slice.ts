import {expandScales, escale, twelveFor, ExpandedScale} from '../theory/scales-generated'

interface TuningSubstate {
  tuningPref: 'current'|'default'|'explore'; // what should linnstrument show, the defaults, current settings, or explore a new one

 }


export type ScaleInfo = {
  scaleIndex: number;
  scaleName: string;
  scaleType: number;
  scaleSteps: number[];
  scaleNotes: number[];         // these are the indices 0-11 pitchclasses that appear in the scale
  scaleNoteNames:escale;
  scaleMappedToKeys: number[];  // given 12 keys starting at C natural, which numbers are they if any in order of the scale?
  keyboardMapped:string[];      // an array of twenty four keys in ui that shows the current scale on white and black keys
  twelve:string[];
}

export type TuningInfo = {
  transposeSemis:number;        // this is the absolute transposition setting of device (must be turned into octaves & semis)
  tonic: number;                // this is the index of the pitch class that is the tonic of the scale
  tuningOffsetSemis:number;     // 5 = fourths (the tuning of the device (exclusive of left handed & guitar for now)
}
export type LinnState = ScaleInfo & TuningInfo & {
  deviceColumns:number;
  scaleCount: number;  // total number of scales
  baseMidiNote: 30;  // this is a fixed note numbner
  scaleFilterText:string;
  filteredScales:ExpandedScale[];
  tuningSubState:TuningSubstate;
}

type LinnCreator = (s:LinnState,...rest: any)=>unknown;
type LinnCreators = Record<string, LinnCreator>;
type LinnReducer = (s:LinnState,...rest: any)=>LinnState;
type LinnReducers = Record<string, LinnReducer>;

interface SliceConfig {
  name: string;
  reducers: LinnReducers;
  creators: LinnCreators;
  initialState: LinnState;
}

const expanded = expandScales();

function deriveScaleNotes(tonic:number, scaleIndex:number):number[]
{
  const {semis} = expanded[scaleIndex];
  const tt =  [0, ...semis].map((v,i,a)=>a.slice(0,i+1));
  return tt.map(aa=> aa.reduce((a,v) => (a+v)%12, tonic));
}

function mapScaleToKeys(scaleNotes:number[]): number[]
{
  const t = [
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
  ];
  scaleNotes.slice(0,-1).forEach((n,i)=>t[n]=i+1);
  return t;
}

/*

      scaleNotes: deriveScaleNotes(value, s.scaleSteps),
      scaleMappedToKeys: mapScaleToKeys(deriveScaleNotes(value, s.scaleSteps))
 */
const firstTonic = 0;
const scaleIndex = 0;


function genScaleInfo(tonic:number, scaleIndex:number, filteredScales:ExpandedScale[]) :ScaleInfo
{
  const {count:scaleType, name:scaleName, semis:scaleSteps,perTonicScales} =  filteredScales[scaleIndex];

  const scaleNotes        =  deriveScaleNotes(firstTonic, scaleIndex);
  const scaleMappedToKeys = mapScaleToKeys(scaleNotes);
  const scaleNoteNames = perTonicScales[tonic];

  const twelve = twelveFor(tonic, filteredScales[scaleIndex]);
  const keyboardMapped:string[] = new Array(24).fill('');
  for(let i = 0; i < 12; ++i)
    keyboardMapped[tonic+i] = twelve[i];
  keyboardMapped[tonic+12] = twelve[0];

  return {
    scaleNotes,
    scaleNoteNames,
    scaleMappedToKeys,
    scaleIndex,
    scaleName,
    scaleType,
    scaleSteps,
    keyboardMapped,
    twelve,
  };
}

const initialState:LinnState = {
  tonic: firstTonic,
  ...genScaleInfo(firstTonic,scaleIndex,expanded),
  deviceColumns:25,
  scaleCount: expanded.length,
  baseMidiNote: 30,
  transposeSemis:0,
  tuningOffsetSemis: 5, //
  tuningSubState: {tuningPref: 'explore'},
  filteredScales:expanded,
  scaleFilterText:''
};




// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:LinnCreators = {
  tonic: (value) => ({value}),
  scale: (value) => ({value}),
  transposeSemis:(transposeSemis)=>({transposeSemis}),
  tuningOffsetSemis:(tuningOffsetSemis)=>({tuningOffsetSemis}),
  tuningPref: (tuningPref)=>({tuningPref}),
  filterScale:(scaleFilterText)=>({scaleFilterText})
};

const reducers:LinnReducers = {
    tonic: (s, {value}) => ({
      ...s,
      tonic: value,
      ...genScaleInfo(value, s.scaleIndex, s.filteredScales)
    }),
    scale: (s, {value}) => {
      return {
        ...s,
        ...genScaleInfo(s.tonic,value, s.filteredScales),
      }
    },
    transposeSemis:(s, {transposeSemis})=>({...s, transposeSemis}),
    tuningOffsetSemis:(s, {tuningOffsetSemis})=>({...s, tuningOffsetSemis}),
    tuningPref: (s, {tuningPref})=>({...s, tuningSubState: {...s.tuningSubState, tuningPref}}),
    filterScale:(s, {scaleFilterText})=>{

      let filteredScales = expanded.filter(o=>o.name.toUpperCase().includes(scaleFilterText.toUpperCase()));

      while(!filteredScales.length) {
        scaleFilterText = scaleFilterText.slice(0,-1);
        filteredScales = expanded.filter(o=>o.name.toUpperCase().includes(scaleFilterText.toUpperCase()))
      }

       [expanded[0]];
      const scaleCount = filteredScales.length;
      const scaleIndex = 0;
      return {
        ...s,
        ...genScaleInfo(s.tonic,scaleIndex, filteredScales),
        scaleFilterText,
       scaleIndex, // reset scale index when filter changes
       scaleCount,
       filteredScales
    };

    }

};


export const sliceConfig:SliceConfig = {name: 'linn', creators, initialState, reducers};

