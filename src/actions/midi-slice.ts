

type MidiConnection = {
  id:string;
  manufacturer:string;
  name:string;
}


export type MidiState = {
  connected: Record<string, MidiConnection>;  // currently connected devices
  recordable:Record<string,boolean>;
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
  recordable:{},
  midiView: {}, // nothing recorded
};


// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:MidiCreators = {
  record:(key, checked)=>({key, checked}),   // mark a device (by its name, not id, for now) as midi recordable in midi view
  connect:(connection)=>({connection}),      // called when a device is connected
  disconnect:(id)=>({id}),                   // when disconnected
  clearMidiView: ()=>({}),                   // remove all currently recorded messages
  updateMidiView: (record)=>({record}),      // when an incoming message is recordable, it will add a record
};

const deprop = (o:Record<any,any>,prop:any) => {const {[prop]:discard, ...preserve} = o; return preserve; }

const reducers:MidiReducers = {
    record: (s, {key, checked})=>({...s, recordable:{...s.recordable, [key]:checked}}),
    connect: (s, {connection})=>{
      const connected = {...s.connected, [connection.id]:connection};

      const keyForRecordable = connection.name;  // recordable devices are listed by name, not id
      const prevRecord = s.recordable[keyForRecordable];  // find if it was already in the device list it will remain whether connected

      // go with previous status when recording, otherwise check the item as recordable
      const isRecordable = prevRecord === undefined? true: prevRecord;// preserve previous recordable status if it changed, regardless of whether connected

      const recordable = {...s.recordable, [keyForRecordable]:isRecordable}
      return {...s,connected, recordable}
    },
    disconnect: (s, {id})=>({...s, connected:deprop(s.connected, id)}),  // remove item from connected by id
    clearMidiView: (s) => ({...s, midiView: {}}),
    updateMidiView:(s, {record}) => ({...s, midiView: {...s.midiView, [record.id]:record}}),
};


export const sliceConfig:SliceConfig = {name: 'midi', creators, initialState, reducers};

