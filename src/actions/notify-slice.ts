import {internalIdGenerate} from '../utils/reqIdGenerator';

// Remedy, what should user do with the message?
/*
  there is a limited menu of how a user is supposed to respond to an error.
    Does he need to see it?
    Do we force him to acknowledge it before continuing?
    Do we prompt him to take one of a couple of options before continuing (like restart app, contact tech support? update credentials)

// Does
*/

type Remedy = 'Nothing'|'Acknowledge'|'Restart'|'Call Support';

// what type of issue is it, if fatal, the application must stop immediately (all future actions are dead)
type Level = 'info'|'warn'|'error'|'fatal';

interface Option {
  label: string;
  description: string;
  action: string;       // associated action
  default: boolean;     // is this option default (when there are more than one
}

export interface Notice  {
  key: string,          // a unique identifier for the message (reqId's will do fine here to track issues to requests)
  kind: string,         // a description of the kind of issue, a category, like memory, bad data, connection, permission, etc.
  level: Level;
  remedy: Remedy;
  msg: string;          // what the message
  options?: Option[]
}


export interface NotifyState {
  readonly max: number;
  notices:Notice[];
}

// undefaultable properties of a Notice (totally different from optional properties)
// defaultable properties must still be present in the product, since they are always directly consumed
type nonDefProp = 'key'|'msg';
type PNoticeWithKey = Partial<Notice> & Pick<Notice, nonDefProp>  // minimal properties required to create a Notice
export type PNoticeNoKey   = Omit<PNoticeWithKey, 'key'>                 // creators however must manufacture the keys


type NotifyCreator = (pn:PNoticeNoKey)=>PNoticeWithKey;
type DismissCreator = (key: Notice['key'])=>({key:Notice['key']});

 type NotifyCreators = Record<string, NotifyCreator|DismissCreator>;



type NotifyReducer = (s:NotifyState,...rest: any)=>NotifyState;
type NotifyReducers = Record<string, NotifyReducer>;

interface SliceConfig {
  name: string;
  reducers: NotifyReducers;
  creators: NotifyCreators;
  initialState: NotifyState;
}

const initialState:NotifyState = {
  max:20,
  notices: []
};


// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators /*todo :NotifyCreators small issue with this type */ = {
  fatal: (pn: PNoticeNoKey) => ({...pn, level:'fatal', key:internalIdGenerate()}),
  error: (pn: PNoticeNoKey) => ({...pn, level:'error', key:internalIdGenerate()}),
  warn:  (pn: PNoticeNoKey) =>  ({...pn, level:'warn',  key:internalIdGenerate()}),
  info:  (pn: PNoticeNoKey) =>  ({...pn, level:'fatal', key:internalIdGenerate()}),
  dismiss: (key: Notice['key']) =>({key})
};

// default notice allows not always specifying these keys when constructing a notice
// but don't expect the result to be benign, the default level is 'fatal' and will stop everything so specify it
const defNotice:Omit<Notice,nonDefProp> =  {
  kind: 'default',
  remedy: 'Nothing',
  level: 'fatal',
};


const makeNotice = (n:PNoticeWithKey): Notice => ({...defNotice,...n});

// add a notice
const addNotice     = (n:Notice, nn:Notice[], max:number): Notice[] => [n, ...nn.slice(0,max)];

// find a notice by its key and remove it
const dismissNotice = (key:string, nn:Notice[]): Notice[] => {
  const foundIndex  = nn.findIndex(n=>n.key === key);
  if(foundIndex < 0)               return nn;                     // not found ^^^ (debounce? error?)
  if(foundIndex === 0)             return [...nn.slice(1)];       // first item
  if(foundIndex === nn.length - 1) return [...nn.slice(-1)];      // last item

  return [...nn.slice(0,foundIndex), ...nn.slice(foundIndex+1)];  // somewhere in between
}

// reuse for different level notififactions
const notify = (s:NotifyState, action:PNoticeWithKey):NotifyState =>
  ({...s, notices:addNotice(makeNotice(action), s.notices, s.max) })

const reducers:NotifyReducers = {
  fatal: (s,n) =>notify(s,n),
  error: (s,n) =>notify(s,n),
  warn:  (s,n) =>notify(s,n),
  info:  (s,n) =>notify(s,n),
  dismiss: (s,{key})=>({...s, notices: dismissNotice(key,s.notices)})
};

export const sliceConfig:SliceConfig = {name: 'notify', creators: creators as NotifyCreators, initialState, reducers};

