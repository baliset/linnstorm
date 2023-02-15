export interface LocalState {
  gridChoice: 'Trades' | 'Quotes' | 'Parties';
  layout: {
    left: number;
    right: number;
  }
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
  gridChoice: 'Trades',
  layout: {
    left: 100,
    right: 0,
  }
};


// type value will be added automatically to creators to match the key, or better yet to match the slice/key
const creators:LocalCreators = {
  pickGrid:     (value) => ({value}),
  toggleLeft:   (expanded) => ({expanded}),
  toggleRight:  (expanded) => ({expanded}),
};

const reducers:LocalReducers = {
  pickGrid:    (s, {value})   =>({...s, gridChoice:value}),
  toggleLeft:  (s, {expanded})=>({...s, layout: {...s.layout, left: s.layout.left? 0: expanded}}),
  toggleRight: (s, {expanded})=>({...s, layout: {...s.layout, right: s.layout.right? 0: expanded}}),
};

export const sliceConfig:SliceConfig = {name: 'local', creators, initialState, reducers};

