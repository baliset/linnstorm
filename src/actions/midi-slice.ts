import {LinnParam, allParamsByNrpn} from '../linnutils/LinnVals';

type MidiConnection = {
  id:string;
  manufacturer:string;
  name:string;
}


export type MidiState = {
  linnsConnected:number;  // how many Linnstruments are connected now
  connected: Record<string, MidiConnection>;  // currently connected devices
  recordable:Record<string,boolean>;
  midiView:Record<number, Record<string, any>>;
  paramView:Record<number, LinnParam>;
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
  linnsConnected:0,
  connected:{},
  recordable:{},
  midiView: {},   // nothing recorded
  paramView: {...allParamsByNrpn},
};

/*
  todos, column loader for b and c
  copy parameters to/from clipbboard for crude exchange mechanism
  way to delete stored parameters in parameter browser
  load modify save as...
  more obvious diffing
  single diff column, or show/hide abcd columns appropriately to compare only two at a time
  send a patch to the linnstrument
  start categorizing differences to explain in english
  convert the tuning section to an applicable patch driven from the tuning screen
  test the modal
  kill the intro page or come up with a cheap signup so I can see how many unique users there are

 */


const linnDefaults = {"0":0,"1":1,"2":0,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1,"9":1,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":1,"19":2,"20":1,"21":1,"22":1,"23":0,"24":1,"25":74,"26":0,"27":1,"28":0,"29":11,"30":3,"31":4,"32":1,"33":2,"34":0,"35":0,"36":5,"37":7,"38":7,"39":3,"40":1,"41":2,"42":3,"43":4,"44":5,"45":6,"46":7,"47":8,"48":0,"49":1,"50":0,"51":16,"52":17,"53":18,"54":0,"55":127,"56":0,"57":127,"58":0,"59":64,"60":0,"61":0,"65":0,"100":0,"101":16,"102":0,"103":0,"104":0,"105":0,"106":0,"107":0,"108":0,"109":0,"110":1,"111":1,"112":1,"113":1,"114":1,"115":1,"116":1,"117":0,"118":9,"119":2,"120":1,"121":1,"122":1,"123":0,"124":1,"125":74,"126":0,"127":1,"128":0,"129":11,"130":5,"131":4,"132":6,"133":2,"134":0,"135":0,"136":5,"137":7,"138":7,"139":3,"140":1,"141":2,"142":3,"143":4,"144":5,"145":6,"146":7,"147":8,"148":0,"149":1,"150":0,"151":16,"152":17,"153":18,"154":0,"155":127,"156":0,"157":127,"158":0,"159":64,"160":0,"161":0,"165":0,"200":0,"201":0,"202":12,"203":1,"204":0,"205":1,"206":0,"207":1,"208":1,"209":0,"210":1,"211":0,"212":1,"213":0,"214":1,"215":1,"216":0,"217":0,"218":0,"219":0,"220":0,"221":0,"222":0,"223":0,"224":0,"225":0,"226":0,"227":5,"228":2,"229":4,"230":4,"231":2,"232":1,"233":1,"234":1,"235":4,"236":4,"237":0,"238":80,"239":0,"240":0,"241":0,"242":0,"243":127,"244":0,"245":0,"246":0,"247":0,"248":65,"249":1,"250":127,"251":96,"252":107,"253":28,"254":0,"255":65,"256":65,"257":65,"258":65,"259":64,"260":64,"261":64,"262":64,"263":30,"264":35,"265":40,"266":45,"267":50,"268":55,"269":59,"270":64}

applyPatch(initialState.paramView, linnDefaults, 'd'); // all defaults go to column d
// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:MidiCreators = {
  record:(key, checked)=>({key, checked}),   // mark a device (by its name, not id, for now) as midi recordable in midi view
  connect:(connection)=>({connection}),      // called when a device is connected
  disconnect:(id)=>({id}),                   // when disconnected
  clearMidiView: ()=>({}),                   // remove all currently recorded messages
  updateMidiView: (record)=>({record}),      // when an incoming message is recordable, it will add a record
  updateParamView:(nrpn, abcd, v)=>({nrpn, abcd, v}),    // update one parameter keyed by nrpn into a column labeled a,b,c,d with value v
  updateParamViewWithPatch:(abcd, patch)=>({abcd,patch}),
  updateParamViewWithDefaults:(ab)=>({ab}),  // load a copy of the defaults into any of column a or b
  updateParamViewWithCurrent:(ab, selectedOnly)=>({ab, selectedOnly}),   // load a copy of current values

};

const deprop = (o:Record<any,any>,prop:any) => {const {[prop]:discard, ...preserve} = o; return preserve; }

function applyPatch(destination:Record<number, LinnParam>, patch:Record<number,number>, abcd:'a'|'b'|'c'|'d')
{
  Object.entries(patch).forEach(([k,v])=>
  {
    const nrpn:number = k as unknown as number;
    destination[nrpn] = {...destination[nrpn], [abcd]:v}
  });

}

function extractPatch(source:Record<number, any>, abcd:'a'|'b'|'c'|'d', unselectedAlso:boolean): Record<number,number>
{
  const patch:Record<number,number> = {};

  Object.entries(source).forEach(([k,v])=>
  {
    const nrpn:number = k as unknown as number;
    const item:any = source[nrpn];

    // which ones are extracted are either all values, or onley selected ones
    if(unselectedAlso || item.sel)
      patch[nrpn] = item[abcd];
  });
  return patch;
}


const reducers:MidiReducers = {
    record: (s, {key, checked})=>({...s, recordable:{...s.recordable, [key]:checked}}),
    connect: (s, {connection})=>{
      const connected = {...s.connected, [connection.id]:connection};

      const keyForRecordable = connection.name;  // recordable devices are listed by name, not id
      const linnsConnected = (keyForRecordable === 'LinnStrument MIDI')? s.linnsConnected + 1: s.linnsConnected;

      const prevRecord = s.recordable[keyForRecordable];  // find if it was already in the device list it will remain whether connected

      // go with previous status when recording, otherwise check the item as recordable
      const isRecordable = prevRecord === undefined? true: prevRecord;// preserve previous recordable status if it changed, regardless of whether connected

      const recordable = {...s.recordable, [keyForRecordable]:isRecordable};
      return {...s, linnsConnected, connected, recordable};
    },
    disconnect: (s, {id})=> {
      const {connected} = s;
      const linnsConnected = (connected[id].name === 'LinnStrument MIDI')? s.linnsConnected - 1: s.linnsConnected;
      return {...s, linnsConnected, connected: deprop(s.connected, id)}
    },  // remove item from connected by id
    clearMidiView: (s) => ({...s, midiView: {}}),
    updateMidiView:(s, {record}) => ({...s, midiView: {...s.midiView, [record.id]:record}}),
    updateParamView:(s, {nrpn, abcd, v}) => ({...s, paramView: {...s.paramView, [nrpn]: {...s.paramView[nrpn], [abcd]: v}}}),
    updateParamViewWithPatch:(s, {abcd, patch}) => {
      const paramView = {...s.paramView};
      applyPatch(paramView,patch,abcd);
      return {...s, paramView}
    },
    updateParamViewWithDefaults:(s, {ab}) => {
      const paramView = {...s.paramView};
      applyPatch(paramView, linnDefaults,ab);
      return {...s, paramView}
    },
    updateParamViewWithCurrent:(s, {ab, selectedOnly}) => {
      const paramView = {...s.paramView};
      const patch = extractPatch(paramView, 'c', !selectedOnly);
      applyPatch(paramView, patch,ab);
      return {...s, paramView}
  },


};


export const sliceConfig:SliceConfig = {name: 'midi', creators, initialState, reducers};

