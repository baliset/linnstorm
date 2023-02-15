// -- standard slices --
import {sliceConfig as requestSlice,RequestState} from "./request-slice";
import {sliceConfig as notifySlice,NotifyState} from "./notify-slice";
import {sliceConfig as coverageSlice,CoverageState} from './coverage-slice';

//-- standard middlewares
import {loggingMiddleware} from "./logging-middleware";
import {fatalMiddleware} from './fatal-middleware';
import {coverageMiddleware, coverageMiddlewareInit} from './coverage-middleware';

// -- app specific slices --
import {sliceConfig as localSlice, LocalState} from "./local-slice";
import {sliceConfig as controlSlice, ControlState} from "./control-slice";
import {sliceConfig as linnSlice, LinnState} from './linn-slice';

//-- app specific middlewares


export const allSlices = [requestSlice, notifySlice, coverageSlice, localSlice, controlSlice, linnSlice];
export const allMiddlewares = [ fatalMiddleware, coverageMiddleware, loggingMiddleware];
export const middlewareInits = [  coverageMiddlewareInit];

// when I get smarter about deriving types in typescript I can presumably fix this (he claims)
// but the important thing is it makes every part of state known
//There is a source of truth problem, I need to derive the keys from the slice names directly encountered issues
// with non-literals
export type TotalState = {
   request: RequestState;
    notify: NotifyState;
  coverage: CoverageState;
     local: LocalState;
   control: ControlState;
   linn: LinnState;
}

