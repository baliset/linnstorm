

type MidiConnection = {
  connection:'open'|'closed';
  id:string;
  manufacturer:string;
  name:string;
}


export type MidiState = {
  connected: Record<string, MidiConnection>  // currently connected devices
  midiView:Record<number, Record<string, any>>;
};

type MidiCreator = (s:MidiState,...rest: any)=>unknown;
type MidiCreators = Record<string, MidiCreator>;
type MidiReducer = (s:MidiState,...rest: any)=>MidiState;
type MidiReducers = Record<string, MidiReducer>;

interface SliceConfig {
  name: string;
  reducers: MidiReducers;
  creators: MidiCreators;
  initialState: MidiState;
}

const initialState:MidiState = {
  connected:{},
  midiView: {}, // nothing recorded
};


// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:MidiCreators = {
  clearMidiView: ()=>({}),
  updateMidiView: (record)=>({record}),
};

const reducers:MidiReducers = {
    clearMidiView: (s) => ({...s, midiView: {}}),
    updateMidiView:(s, {record}) => ({...s, midiView: {...s.midiView, [record.id]:record}}),
};


export const sliceConfig:SliceConfig = {name: 'midi', creators, initialState, reducers};

