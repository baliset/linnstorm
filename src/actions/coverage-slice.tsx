
// SliceCoverage is Record of containing for a given slice, all its action names, and how many time each was invoked
export type SliceCoverage = Record<string, number>;
export type SliceInfo = {
  sliceName: string;            // name of the slice
  hits: number;                 // overall number of hits to slice, drives occasional updates
  lastUpdated: number;          // time of last update
  percentCoverage: number;      // what percentage of actions in slice have been invoked
  sliceCoverage: SliceCoverage; // the actual action counts for each action in the slice
}
export interface CoverageState {
  lastUpdated: number;          // lists time of the last update of any kind
  perSlice: Record<string, SliceInfo>; // for each slice there will be a record
}

const initialState: CoverageState = {
  lastUpdated: 0,       // lists time of the last update of any kind
  perSlice: {}, // a big power of two, to start
} as const;


// leave type parameter out of all the creators it will be added to match the key
// creators can be objects or functions, neither needs to return a type
// functions will be decorated with functions that set the type
// objects will be replaced with objects that have the type set
const creators = {
  updateSlice: (sliceInfo:SliceInfo)=> {
    const {sliceCoverage:passedCoverage, ...rest} = sliceInfo; // all parameters are scalars except sliceCoverage
    const sliceCoverage = {...passedCoverage};                 // copy the values
    // the passed data must be cloned, or it is likely to change between the call and the action execution
    return {sliceInfo: {sliceCoverage, ...rest}};
  }
};

type CoverageReducer = (s:CoverageState,...rest: any)=>CoverageState;
type CoverageReducers = Record<string, CoverageReducer>;


const reducers:CoverageReducers = {
  updateSlice: (s, {sliceInfo}) => {
    const {sliceName} = sliceInfo;
    // const {[sliceName]:updated, ...otherSlices} = s.perSlice; // this is how you would get all the other slices
    return {
      ...s, // don't need this if we cover all the properties here
      lastUpdated: sliceInfo.lastUpdated,
      perSlice: {[sliceName]: sliceInfo, ...s.perSlice }
    };
  }
};


export const sliceConfig = {name: "coverage", initialState, creators, reducers};


