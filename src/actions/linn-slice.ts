import {scaleOfScales} from '../scales';

export interface LinnState {
  tonic: number;
  scaleCount: number;  // total number of scales
  scaleIndex: number;
  scaleName: string;
  scaleType: number;
  scaleSteps: number[];
  scaleNotes: number[];
  scaleMappedToKeys: number[]; // given 12 keys starting at C natural, which numbers are they if any in order of the scale?
  midiView:Record<number, Record<string, any>>;
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


function deriveScaleNotes(tonic:number, semitoneSteps:number[]):number[]
{
  const tt =  [0, ...semitoneSteps].map((v,i,a)=>a.slice(0,i+1));
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



const initialState:LinnState = {
  tonic: 0,
  scaleCount: scaleOfScales.length,
  scaleIndex: 0,
  scaleName: scaleOfScales[0].name,
  scaleType: scaleOfScales[0].ascending.length,
  scaleSteps: scaleOfScales[0].ascending,
  scaleNotes: deriveScaleNotes(0, scaleOfScales[0].ascending ),
  scaleMappedToKeys: mapScaleToKeys(deriveScaleNotes(0, scaleOfScales[0].ascending )),
  midiView: {} // nothing recorded

};




// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:LinnCreators = {
  tonic: (value) => ({value}),
  scale: (value) => ({value}),
  clearMidiView:()=>({}),
  updateMidiView:(record)=>({record})
};

const reducers:LinnReducers = {
    tonic: (s, {value}) => ({
      ...s,
      tonic: value,
      scaleNotes: deriveScaleNotes(value, s.scaleSteps),
      scaleMappedToKeys: mapScaleToKeys(deriveScaleNotes(value, s.scaleSteps))
    }),
    scale: (s, {value}) => {
      const sc = scaleOfScales[value];
      const {ascending: scaleSteps, name: scaleName} = sc;
      const scaleNotes = deriveScaleNotes(s.tonic, scaleSteps);
      return {
        ...s,
        scaleIndex: value,
        scaleName,
        scaleType: scaleSteps.length,
        scaleSteps,
        scaleNotes,
        scaleMappedToKeys: mapScaleToKeys(scaleNotes)
      }
    },
    clearMidiView: (s) => ({...s, midiView: {}}),
    updateMidiView:(s, {record}) => ({...s, midiView: {...s.midiView, [record.id]:record}}),
};


export const sliceConfig:SliceConfig = {name: 'linn', creators, initialState, reducers};

