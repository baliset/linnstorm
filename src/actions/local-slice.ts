type ConfigInfo = {
  app:    Record<string, any>;
  build:  Record<string, any>;
  deploy: Record<string, any>;
}
export type CompareProps =  'a-b'|'a-c'|'a-d'|'c-d';

export interface LocalState {
  config: ConfigInfo;
  layout: {
    left: number;
    right: number;
  }
  compare: CompareProps; // compare two patches a/b  or patch against current or default, or compare current settings to defaults
}

type LocalCreator = (s:LocalState,...rest: any)=>unknown;
type LocalCreators = Record<string, LocalCreator>;
type LocalReducer = (s:LocalState,...rest: any)=>LocalState;
type LocalReducers = Record<string, LocalReducer>;

interface SliceConfig {
  name: string;
  reducers: LocalReducers;
  creators: LocalCreators;
  initialState: LocalState;
}
const initialState:LocalState = {
  config: {
    app:    {name: 'unknown', url: 'unknown'},
    build:  {time: 0, branch: 'unknown'},
    deploy: {time: 0, branch: 'unknown'}
  },
  layout: {
    left: 0,
    right: 0,
  },
  compare: 'c-d'
};


// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:LocalCreators = {
  ingestConfig: (config) => ({config}),
  toggleLeft:   (expanded) => ({expanded}),
  toggleRight:  (expanded) => ({expanded}),
  setCompare: (compare)=>({compare}),
};

const reducers:LocalReducers = {
  ingestConfig: (s, {config})=>({...s, config:  config as ConfigInfo}),
  toggleLeft:  (s, {expanded})=>({...s, layout: {...s.layout, left: s.layout.left? 0: expanded}}),
  toggleRight: (s, {expanded})=>({...s, layout: {...s.layout, right: s.layout.right? 0: expanded}}),
  setCompare: (s, {compare})=>({...s, compare}),
};

export const sliceConfig:SliceConfig = {name: 'local', creators, initialState, reducers};

