export interface ControlState {
  pollInterval:number;
}

const initialState: ControlState = {
  pollInterval: 1_073_741_824, // a big power of two, to start
} as const;

// leave type parameter out of all the creators it will be added to match the key
// creators can be objects or functions, neither needs to return a type
// functions will be decorated with functions that set the type
// objects will be replaced with objects that have the type set
const creators = {
  halveInterval: {},
  doubleInterval: {},
};

type ControlReducer = (s:ControlState,...rest: any)=>ControlState;
type ControlReducers = Record<string, ControlReducer>;


const reducers:ControlReducers = {
  halveInterval: s =>{
    let {pollInterval: iv} =s;
    iv = iv < 50? iv: iv * 0.5;
    return {...s, pollInterval: iv};
  },
  doubleInterval: s =>{
    let {pollInterval: iv} = s;
    iv = iv > 100_000_000? iv: iv * 2;
    return {...s, pollInterval: iv};
  },

};


export const sliceConfig = {name: "control", initialState, creators, reducers};


