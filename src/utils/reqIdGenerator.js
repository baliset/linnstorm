// import moment from 'moment';
import {DateTime} from 'luxon';

let requestCounter=0;

const fmtNow = {minimumIntegerDigits:9, maximumFractionDigits:3, minimumFractionDigits:3};
const fmtCtr = {minimumIntegerDigits: 6, maximumFractionDigits: 0, minimumFractionDigits:0};


const formatOrigin = v=>Math.round(v*1000).toString(36).padStart(11,'0');
const formatNow    = v=>v.toLocaleString('en-US', fmtNow);
const formatCtr    = v=>v.toLocaleString('en-US', fmtCtr);

const timeOrigin = formatOrigin(performance.timeOrigin);

export const minisession = timeOrigin

const dateTimeFmt = "yyyy-MM-dd HH:mm:ss.SSS";

const reqIdRegEx = /(#|@)(?<origin>[0-9a-z]{11})\+(?<now>[0-9,.]{15})=(?<counter>[0-9,]{7})/;

const ignoreRegex = /(,|\.)/g;

const parseIgnore = s => {
    const ss = s.replace(ignoreRegex, '')
    return parseInt(ss,10);
}


const usPerMs    = 1000;
const msPerSec   = 1000;
const secsPerMin = 60;
const minsPerHr  = 60;
const hrsPerDay  = 24;
const usPerSec   = usPerMs  * msPerSec;
const usPerMin   = usPerSec * secsPerMin;
const usPerHr    = usPerMin * minsPerHr;
const usPerDay   = usPerHr  * hrsPerDay;


function ts(micros) {
    let r = micros;
    const [us, SSS, ss, mm, hh, dd] = [usPerMs,msPerSec,secsPerMin,minsPerHr, hrsPerDay, 1].map((div,i)=>{
        const v = r % div;
        r = (r-v) / div;
        return (''+v).padStart(i<2?3:2,'0'); // we want 3 digits of last two numbers in string
    });
    return `${dd} days ${hh}:${mm}:${ss}.${SSS}${us}`;

}
//last minute hack, clearly ts is screwed up for it new purpose
function ts2(micros) {
    let r = micros;

    let microsPart;
    const [us, SSS, ss, mm, hh, dd] = [usPerMs,msPerSec,secsPerMin,minsPerHr, hrsPerDay, 1].map((div,i)=>{
        if(i === 0)
            microsPart = i;
        const v = r % div;
        r = (r-v) / div;
        return (''+v).padStart(i<2?3:2,'0'); // we want 3 digits of last two numbers in string
    });

    return `${dd} days ${hh}:${mm}:${ss}.${SSS}${us.slice(0,1)}`;
}
function parseReqId(reqId)
{
    const {origin, now, counter} = reqIdRegEx.exec(reqId).groups;

    const nOrigin     = parseInt(origin,36)/1000;
    const nNowMicros  = parseIgnore(now);
    const nNowMillis  = nNowMicros * 0.001;
    const nCounter    = parseIgnore(counter);
    const mOrigin     = DateTime.fromMillis(nOrigin);
    const mRequest    = DateTime.fromMillis(nOrigin+nNowMillis);

   return {nOrigin,nNowMicros, nNowMillis, nCounter, mOrigin, mRequest};

}


export function describeReqId(reqId) {

    const {nNowMicros,  nCounter, mOrigin, mRequest} = parseReqId(reqId);
    const originStr   = mOrigin.toFormat(dateTimeFmt);
    const reqStr      = mRequest.toFormat(dateTimeFmt);

    const since = ts(nNowMicros);

    // when application started
    return {'req#':nCounter, since, reqts:reqStr, appts:originStr};
}

export function elapsedSinceReqId(tsMicros, reqId)
{

    const parsed = parseReqId(reqId);
    const {nNowMicros:reqTsMicros} = parsed;

    const adjReqTsMicros = reqTsMicros * 0.001;

    const elapsedMicros = parseFloat(((tsMicros - adjReqTsMicros)*100).toFixed(3));  // todo limit fractional part
    const elapsedStr = ts2(elapsedMicros)
    return {elapsedMicros, elapsedStr};
}
export function reqIdGenerate()
{
    const id =  `#${timeOrigin}+${formatNow(performance.now())}=${formatCtr(++requestCounter)}`;
    return id;
}

// use internal identifiers to track async operations not sent as external requests
// these differ only in the prefix @ vs #
export function internalIdGenerate()
{
    const id =  `@${timeOrigin}+${formatNow(performance.now())}=${formatCtr(++requestCounter)}`;
    return id;
}
