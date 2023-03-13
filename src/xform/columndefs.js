import {tsToDate, tsToTime} from "./datexforms";
import {isNumber} from "luxon/src/impl/util";
import {currentLinnParams} from "../linnutils/mymidi";
import {assignments, arpDir, tempoValues, rowOffsets, animations} from "../linnutils/linn-expansion"
import {DateTime} from "luxon";

const vgTsToTime = (params)=>isNumber(params.value)? tsToTime(params.value):undefined;
const vgTsToDate = (params)=>isNumber(params.value)?  tsToDate(params.value):undefined;



const defCol = {
    sortable:true,
    filter:true,
    enableCellChangeFlash:true,

};

const numberSort = (num1, num2) => {
    return num1 - num2;
};


// {nrpn:237, key: 'ArpOctaveExtension',     min: 0, max:   2, desc: "Arp Octave Extension (0: None, 1: +1, 2: +2)"},

const arpOctExt= ['None', '+1', '+2'];


const colors = ['!as set!','red','yellow','green','cyan','blue','magenta','!off!','white','orange','lime','pink'];
const octave = [-5,-4,-3,-2,-1, 0,'+1','+2','+3','+4','+5'];
const trPitch = [-7,-6,-5,-4,-3,-2,-1,0,'+1','+2','+3','+4','+5','+6','+7'];
const pitchClass = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; // flats are BEA sharps FC


function vfMidiNote(p)
{
    const n = p?.value;
    if(n === undefined)
        return '';

    const pc = n % 12;
    const oct = Math.trunc(n / 12) - 1;
    return `${pitchClass[pc]}${oct}`;
}

function vfTime(p)
{
    const n = p?.value;
    if(n === undefined)
        return '';

    const d = new Date(p.value +performance.timeOrigin);

    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}.${d.getMilliseconds()}`;

}
const dtfmt = "yy-MM-dd HH:mm:ss";

function vfDateTime(p)
{
    const n = p?.value;
    if(n === undefined)
        return '';

    return DateTime.fromMillis(n).toFormat(dtfmt);
}


function vfExpander(p)
{
    const r = p?.data;
    if(!r)
        return '?';

    const v = p?.value;
    if(v === undefined)
        return '?';

    const nrpn =   p?.data?.nrpn;

    // there are pairs of values 0-66 and 100-166 that have same formatting
    const nrpnNormalizedForSwitch = nrpn >= 100 && nrpn <=166? nrpn - 100: nrpn;

    switch(nrpnNormalizedForSwitch)
    {
        case  30:
        case  31:
        case  32:
        case  33: return `${v} (${colors[v]})`;

        case  36: return `${v} (${octave[v]})`;

        case  37:
        case  38: return `${v} (${trPitch[v]})`;

        case  61: return `${v} (${animations[v]})`;

        case 201: return `${v} (${v? 'Right': 'Left'})`;
        case 227: return v > 13? `${v}? (0,3-7,12,127)`: `${v} (${rowOffsets[v]})`;

        case 228:
        case 229:
        case 230:
        case 231: return `${v} (${assignments[v]})`;

        case 235: return `${v}  (${arpDir[v]})`;
        case 236: return `${v}  (${tempoValues[v]})`;
        case 237: return `${v} (${arpOctExt[v]})`;
        case 247: return `${v} (${pitchClass[v]})`;
        case 253: return `${v} (${v<=32? v-16:'Inverted Guitar'})`;

        default:  return v;

    }




}


function toAgColDef(v) {

    if(typeof v === 'string')
       return {...defCol, headerName:v.toUpperCase(), field:v};

    const o = {...v};


    o.headerName = (o.h||o.f).toUpperCase();
    o.field = o.f;
    delete o.f;
    delete o.h;

    return {...defCol, ...o};

}

const nw = 65;

function vgCurrent(p) {
    const r = p?.data;
    return p?.data? currentLinnParams[r?.nrpn]: '?';

}


function vgDiffer(from, to) {
    return function(p) {
        const r = p?.data;
        if(r)
            return r[from] === r[to]? 'same': 'diff'
        return '?';
    }

}

function vgDiffCurrent(p) {
    const r = p?.data;
    if(r)
        return r.b === r.c? 'same': 'diff'

    return '?';
}





function vgDiffDefaults(p) {
    const r = p?.data;
    if(r)
        return r.b === r.d? 'same': 'diff'

    return '?';
}


const linnPropColumns = [
    {f:'sel', maxWidth:50, cellRenderer: 'checkboxRenderer'},
    {f:'nrpn', maxWidth:90, comparator:numberSort},
    {f:'cat', maxWidth:75},
    {f: 'side', maxWidth: 75},
    {f:'subcat',  maxWidth:85},

    {f:'a',  maxWidth:85, comparator:numberSort, editable:true, cellRenderer: 'linnParamRenderer'},
    {f:'b',  maxWidth:85,comparator:numberSort, valueFormatter:vfExpander, cellRenderer: 'linnParamRenderer'},
    {f:'b-d',  maxWidth:85, valueGetter:vgDiffer('b', 'd')},

    {f:'c',   maxWidth:85, valueGetter:vgCurrent, comparator:numberSort, valueFormatter:vfExpander, cellRenderer: 'linnParamRenderer'},
    {f:'c-d', maxWidth:85, valueGetter:vgDiffer('c', 'd')},

    {f:'d',  maxWidth:85, comparator:numberSort, cellRenderer: 'linnParamRenderer'},


    {f:'key',  minWidth:250}, {f:'min',maxWidth:nw}, {f:'max',maxWidth: nw},
    {f:'desc', h:'Description', width: 500, tooltipValueGetter: (p) =>p.value}
].map(o=>({...o,  suppressMenu: true, floatingFilter: true, floatingFilterComponentParams: { suppressFilterButton: true }}));  //'agSetColumnFilter'



 const midiColumns = [
    {f:'id', maxWidth:65, comparator:numberSort,},
    {f:'time', maxWidth:130, comparator:numberSort, valueFormatter:vfTime },
    {f:'dir', maxWidth:50},
    {f: 'src', minWidth:200, maxWidth:200},
    {f:'ch', minWidth:50, maxWidth:50, comparator:numberSort,},
    {f:'note', minWidth:65, maxWidth: 65, comparator:numberSort, valueFormatter:vfMidiNote},  // todo formatter that displays number as string, filter, etc.
    {f:'cmd',  maxWidth:350},
    {f:'type', minWidth:80, maxWidth:80},
    {f:'value', maxWidth:70},
    {f:'hex', maxWidth:250},
].map(o=>({...o,  suppressMenu: true, floatingFilter: true, floatingFilterComponentParams: { suppressFilterButton: true }}));


const patchColumns = [
    {f:'sel', maxWidth:50, cellRenderer: 'checkboxRenderer', floatingFilter:false},
    {f: 'updated', maxWidth:140, comparator:numberSort, cellRenderer: 'updatedRenderer'},
    {f: 'name', maxWidth:140, editable: true, cellEditor: 'patchNameEditor', cellRenderer: 'patchNameRenderer', floatingFilter: true, floatingFilterComponentParams: { suppressFilterButton: true }},
    {f: 'keys', maxWidth: 60, comparator:numberSort,},
    {f: 'comments', editable: true, cellEditor: 'patchCommentEditor', floatingFilter: true, floatingFilterComponentParams: { suppressFilterButton: true }},
].map(o=>({...o,  suppressMenu: true, }));

export const linnPropColumnDefs = linnPropColumns.map(o=>toAgColDef(o)); // xform abbrievated column definitions to AgGrid spec columnDefinitions

export const midiColumnDefs = midiColumns.map(o=>toAgColDef(o)); // xform abbrievated column definitions to AgGrid spec columnDefinitions
export const patchColumnDefs = patchColumns.map(o=>toAgColDef(o)); // xform abbrievated column definitions to AgGrid spec columnDefinitions
