// motivation for most of these was to share types with middleware
// but not all of them are middleware specific

export interface SliceConfig {
   name: string;
   initialState: unknown;
   creators: Record<string, unknown>;
   reducers: Record<string, unknown>;
   unboundActions?:any;                   // this is added in later, not attempt to add this yourself
}

export interface Action {
  type: string;
}

// bad types, but at least middleware can squeak by with them
export type BoundAction = (a:Action)=>unknown;
export type NextF = BoundAction;



export const noParamsCreator = {};

export interface ErrorLike  {
  name: string;
  message: string;
  stack?: string;
}

export interface ResponseMeta {
  reqId: string;
  elapsed: string;
  elapsedMicros: number;
}

export type ErrorMeta = ResponseMeta & ErrorLike;

// basically an alias to the most important properties from an Axios response
// making some values optional until we transfer them universally, which we haven't
// todo should be a Response<T> of course
interface Response {
  data: any,
  status? : number,
  statusText?: string;
}

export interface ResponseAction extends Action {
  response: Response,
  respMeta: ResponseMeta,
}


