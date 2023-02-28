export type escale = string[];
export type modeName = string|string[];
export type SemisType = number[];
export type SemisIndex = number[]; // 0-11 index to return true no non index into a note array
export type NScale = {
  prefix:string;
  keywords?:string[];
  modes:modeName[];
  semis:SemisType;
  scales:escale[];
};

// Magen Avos is D minor, shifting to F major and back, so might not be exactly correct here as name for minor
const western:NScale = {
  prefix:'',
  modes: [['Ionian', 'Major'], 'Dorian', ['Phrygian','Yishtabach'], 'Lydian', 'Mixolydian', ['Aeolian','Minor','Magen Avos'], 'Locrian'],
  semis: [2, 2, 1, 2, 2, 2, 1],
  scales: [
    ['C',  'D',  'E',  'F',  'G',  'A',  'B',  'C' ],
    ['D♭', 'E♭', 'F',  'G♭', 'A♭', 'B♭', 'C',  'D♭'],
    ['D',  'E',  'F♯', 'G',  'A',  'B',  'C♯', 'D' ],
    ['E♭', 'F',  'G', ' A♭', 'B♭', 'C',  'D',  'E♭'],
    ['E',  'F♯', 'G♯', 'A',  'B',  'C♯', 'D♯', 'E' ],
    ['F',  'G',  'A', ' B♭', 'C',  'D',  'E',  'F' ],
    ['G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F',  'G♭'],
    ['G',  'A',  'B',  'C',  'D',  'E',  'F♯', 'G' ],
    ['A♭', 'B♭', 'C',  'D♭', 'E♭', 'F',  'G',  'A♭'],
    ['A',  'B',  'C♯', 'D',  'E',  'F♯', 'G♯', 'A' ],
    ['B♭', 'C',  'D',  'E♭', 'F',  'G',  'A',  'B♭'],
    ['B',  'C♯', 'D♯', 'E',  'F♯', 'G♯', 'A♯', 'B' ],
]};


// whole tone just has no additional modes by nature
const wholeTone:NScale = {
  prefix:'',
  modes: ['Whole Tone'],
  semis: [2,2,2,2,2,2],
  scales: [
    ['C',  'D',  'E',  'F♯', 'G♯', 'A♯', 'C' ],
    ['D♭', 'E♭', 'F',  'G',  'A',  'B',  'D♭'],
    ['D',  'E',  'F♯', 'G♯', 'A♯', 'C',  'D' ],
    ['E♭', 'F',  'G',  'A',  'B',  'C♯', 'E♭'],
    ['E',  'F♯', 'G♯', 'A♯', 'C',  'D',  'E' ],
    ['F',  'G',  'A',  'B',  'C♯', 'D♯', 'F' ],
    ['G♭', 'A♭', 'B♭', 'C',  'D',  'E',  'G♭'],
    ['G',  'A',  'B',  'C♯', 'D♯', 'F',  'G' ],
    ['A♭', 'B♭', 'C',  'D',  'E',  'G♭', 'A♭'],
    ['A',  'B',  'C♯', 'D♯', 'F',  'G',  'A' ],
    ['B♭', 'C',  'D',  'E',  'G♭', 'A♭', 'B♭'],
    ['B',  'C♯', 'D♯', 'F',  'G',  'A',  'B' ],
]};


const pentas:NScale = {

  prefix: 'Pentatonic',
  semis: [2, 2, 3, 2, 3],
  modes: ['Major','Suspended', 'Blues Minor', 'Blue Major', 'Minor'],
  scales: [
    ['C',  'D',  'E',  'G',  'A',  'C' ],
    ['D♭', 'E♭', 'F',  'A♭', 'B♭', 'D♭'],
    ['D',  'E',  'F♯', 'A',  'B',  'D' ],
    ['E♭', 'F',  'G',  'B♭', 'C',  'E♭'],
    ['E',  'F♯', 'G♯', 'B',  'C♯', 'E' ],
    ['F',  'G',  'A',  'C',  'D',  'F' ],
    ['G♭', 'A♭', 'B♭', 'D♭', 'E♭', 'G♭'],
    ['G',  'A',  'B',  'D',  'E',  'G' ],
    ['A♭', 'B♭', 'C',  'E♭', 'F',  'A♭'],
    ['A',  'B',  'C♯', 'E',  'F♯', 'A' ],
    ['B♭', 'C',  'D',  'F',  'G',  'B♭'],
    ['B',  'C♯', 'D♯', 'F♯', 'G♯', 'B' ],
]};


const flamenco:NScale = {
 prefix: 'Flamenco',
 modes: ['','','','','','',''],
 semis:  [ 1,3,1,2,1,3,1],
 scales: [
    ['C',  'D♭', 'E',  'F',  'G',  'A♭', 'B',  'C' ],
    ['C♯', 'D',  'E♯', 'F♯', 'G♯', 'A',  'B♯', 'C♯'],
    ['D',  'E♭', 'F♯', 'G',  'A',  'B♭', 'C♯', 'D' ],
    ['E♭', 'F♭', 'G',  'A♭', 'B♭', 'C♭', 'D',  'E♭'],
    ['E',  'F',  'G♯', 'A',  'B',  'C',  'D♯', 'E' ],
    ['F',  'G♭', 'A',  'B♭', 'C',  'D♭', 'E',  'F' ],
    ['F♯', 'G',  'A♯', 'B',  'C♯', 'D',  'E♯', 'F♯'],
    ['G',  'A♭', 'B',  'C',  'D',  'E♭', 'F♯', 'G' ],
    ['A♭', 'B𝄫', 'C',  'D♭', 'E♭', 'F♭', 'G',  'A♭'],
    ['A',  'B♭', 'C♯', 'D',  'E',  'F',  'G♯', 'A' ],
    ['B♭', 'C♭', 'D',  'E♭', 'F',  'G♭', 'A',  'B♭'],
    ['B',  'C',  'D♯', 'E',  'F♯', 'G',  'A♯', 'B' ],
]};

// three gyspy scales 1. hungarian minor, aka double harmonic minor, aka byz
// 1.  fifth mode of hungarian minor
// 2.  hungarian minor itself, aka double harmonic minor
// 3. phrygian dominant aka Freygish, Spanish gypsy or spanish Phrygian
const hungarianminor:NScale = {
  prefix: '',
  modes: ['Hungarian Minor','Oriental','Ionian ♯2 ♯5','Locrian 𝄫3 𝄫7','Double harmonic major','Lydian ♯2 ♯6','Ultraphryigian'],
  semis:[2,1,3,1,1,3,1],
  scales: [
    ['C',  'D',  'E♭', 'F♯', 'G',  'A♭', 'B',  'C' ],
    ['D♭', 'E♭', 'F♭', 'G',  'A♭', 'B𝄫', 'C',  'D♭'],
    ['D',  'E',  'F',  'G♯', 'A',  'B♭', 'C♯', 'D' ],
    ['E♭', 'F',  'G♭', 'A',  'B♭', 'C♭', 'D',  'E♭'],
    ['E',  'F♯', 'G',  'A♯', 'B',  'C',  'D♯', 'E' ],
    ['F',  'G',  'A♭', 'B',  'C',  'D♭', 'E',  'F' ],
    ['F♯', 'G♯', 'A',  'B♯', 'C♯', 'D',  'E♯', 'F♯'],
    ['G',  'A',  'B♭', 'C♯', 'D',  'E♭', 'F♯', 'G' ],
    ['A♭', 'B♭', 'C♭', 'D',  'E♭', 'F♭', 'G',  'A♭'],
    ['A',  'B',  'C',  'D♯', 'E',  'F',  'G♯', 'A' ],
    ['B♭', 'C',  'D♭', 'E',  'F',  'G♭', 'A',  'B♭'],
    ['B',  'C♯', 'D',  'E♯', 'F♯', 'G',  'A♯', 'B' ],
]};

const jewish1:NScale = {
  keywords: ['Jewish'],
  prefix:'',
  modes: ['Mi Sheberach', 'Ahava Rabba'],
  semis:[2,1,3,1,2,1,2],
  scales: [
    ['C',  'D',  'E♭', 'F♯', 'G',  'A',  'B♭', 'C' ],
    ['D♭', 'E♭', 'F♭', 'G',  'A♭', 'B♭', 'C♭', 'D♭'],
    ['D',  'E',  'F',  'G♯', 'A',  'B',  'C',  'D' ],
    ['E♭', 'F',  'G♭', 'A',  'B♭', 'C',  'D♭', 'E♭'],
    ['E',  'F♯', 'G',  'A♯', 'B',  'C♯', 'D',  'E' ],
    ['F',  'G',  'A♭', 'B',  'C',  'D',  'E♭', 'F' ],
    ['F♯', 'G♯', 'A',  'C',  'C♯', 'D♯', 'E',  'F♯'],
    ['G♭', 'A♭', 'B𝄫', 'C',  'D♭', 'E♭', 'F♭', 'G♭'],
    ['G',  'A',  'B♭', 'C♯', 'D',  'E',  'F',  'G' ],
    ['A♭', 'B♭', 'C♭', 'D',  'E♭', 'F',  'G♭', 'A♭'],
    ['A',  'B',  'C',  'D♯', 'E',  'F♯', 'G',  'A' ],
    ['B♭', 'C',  'D♭', 'E',  'F',  'G',  'A♭', 'B♭'],
    ['B',  'C♯', 'D',  'E♯', 'F♯', 'G♯', 'A',  'B' ],
]};

const doubleSharp = '𝄪';
const doubleFlat = '𝄫';
const singleSharp = '♯';
const singleFlat = '♭';

const bluesMinorHexa:NScale = {
  prefix: 'Hexatonic Blues',
  modes:   ['Minor'],
  semis:   [3, 2, 1, 1, 1, 2],
  scales: [
    ['C',  'D♯', 'E♯', 'F♯', 'G',  'A♯', 'C' ],
    ['D♭', 'E',  'F♯', 'G',  'A♭', 'B𝄫', 'D♭'],
    ['D',  'E♯', 'F𝄪', 'G♯', 'A',  'B♭', 'D' ], //['D', 'F', 'G', 'A♭', 'B𝄫', 'C𝄫', 'D'],
    ['E♭', 'F♯', 'G♯', 'A',  'B♭', 'C♭', 'E♭'], //['D♯', 'F♯', 'G♯', 'A', 'B♭', 'C♭', 'D♯'],
    ['E',  'G',  'A',  'B♭', 'C♭', 'D𝄫', 'E' ],
    ['F',  'G♯', 'A♯', 'B',  'C',  'D♭', 'F' ],
    ['G♭', 'A',  'B',  'C',  'D♭', 'E𝄫', 'G♭'],
    ['G',  'A♯', 'B♯', 'C♯', 'D',  'E♭', 'G' ],
    ['A♭', 'B',  'C♯', 'D',  'E♭', 'F♭', 'A♭'],
    ['A',  'B♯', 'C𝄪', 'D♯', 'E',  'F',  'A' ],
    ['B♭', 'C♯', 'D♯', 'E',  'F',  'G♭', 'B♭'],
    ['B',  'D',  'E',  'F',  'G♭', 'A𝄫', 'B' ],
]
}
const bluesMajorHexa:NScale = {
  prefix: 'Hexatonic Blues',
  modes:   ['Major'],
  semis:   [2,1,1,3,2,3],
  scales: [
    ['C',  'D',  'E♭', 'F♭', 'G',  'A',  'C' ],
    ['C♯', 'D♯', 'E',  'F',  'G♯', 'A♯', 'C♯'],
    ['D',  'E',  'F',  'G♭', 'A',  'B',  'D' ],
    ['D♯', 'E♯', 'F♯', 'G',  'A♯', 'C',  'D♯'],
    ['E',  'F♯', 'G',  'A♭', 'B',  'C♯', 'E' ],
    ['F',  'G',  'A♭', 'B𝄫', 'C',  'D',  'F' ],
    ['F♯', 'G♯', 'A',  'B♭', 'C♯', 'D♯', 'F♯'],
    ['G',  'A',  'B♭', 'C♭', 'D',  'E',  'G' ],
    ['G♯', 'A♯', 'B',  'C',  'D♯', 'F',  'G♯'],
    ['A',  'B',  'C',  'D♭', 'E',  'G♭', 'A' ],
    ['A♯', 'B♯', 'C♯', 'D',  'F',  'G',  'A♯'],
    ['B',  'C♯', 'D',  'E♭', 'F♯', 'G♯', 'B' ],
  ]
};

 const unexpanded:NScale[] =
[
    western,flamenco,hungarianminor, jewish1, bluesMajorHexa, bluesMinorHexa,wholeTone,pentas,
];



// map fewer than 12 notes into a 12 note space for writing select note names
// IOW given a value between 0-11 or one that should be mod %12, find the value from the scale
export function projectSemis(semis:SemisType): SemisIndex  {
  const arr:SemisIndex = Array.from(new Array(12).fill(-1));
  arr[0] = 0;
  let walkingIndex = 0;
  semis.slice(0,-1).forEach(v=>{
    walkingIndex += v;
    arr[walkingIndex] = walkingIndex;
  });
  console.info(`projectSemis for [${semis.join(',')}] = [${arr.join(',')}]`);
  return arr;
}

const rotate = (arr:any[])=>[...arr.slice(1), ...arr.slice(0,1)];
const modeIt = (modeIndex:number, arr:any[]) => {
  let result = arr.slice(0,-1); // last item is wrong


  for(let i = 0; i < modeIndex; ++i)
    result = rotate(result);

  // console.log(`mode ${modeIndex}`, result;)
  return [...result, result[0]];
}

const romanNumerals = ['I','II', 'III', 'IV', 'V', 'VI', 'VII'];
const romanize = (arr:any[],index:number)=>(index>0 || arr.length>1)?` (Mode ${romanNumerals[index]})`:'';

export function expandScales(): any[]
{
  const result:any[] = [];
  unexpanded.forEach((nscale:NScale)=> {
    const {modes, scales,prefix} = nscale;
    const count = scales[0].length - 1; // how many unique notes in scale 7,6, or 5

    modes.forEach((mode, index)=>{
      const nscales = scales.map(scale=>modeIt(index,scale));
      const modename = (typeof mode === 'string')?mode: mode.join('/');
      const pfx = prefix.length?
        (modename.length? `${prefix}-`:`${prefix}`):
        '';
      const name = `${pfx}${modename}${romanize(modes,index)}`;
      const ascending:number[] = []; // todo
      result.push({name, ascending, count, cat:pfx, subcat: '', nscales})
    });

  });
  console.log(`expandScales`, result);
  return result;
}

// export const scaleOfScales = [
//   ...Object.entries(westernScales).map(([k,v])=>({name: k, ascending:v, count:7, cat: 'Western', subcat: ''})),
//   ...Object.entries(doubleHarmonicScales7).map(([k,v])=>({name: k, ascending:v, count:7, cat: 'DoubleHarmonic', subcat: ''})),
//   ...Object.entries(jlitScales).map(([k,v])=>({name: k, ascending:v, count:7, cat: 'Jewish Liturgy', subcat: ''})),
//   ...Object.entries(wholeToneScales).map(([k,v])=>({name: k, ascending:v, count:6, cat: 'Wholetone', subcat: 'Wholetone'})),
//   ...Object.entries(bluesMajorHexatonics).map(([k,v])=>({name: k, ascending:v, count:6, cat: 'Blues', subcat: 'Major'})),
//   ...Object.entries(bluesMinorHexatonics).map(([k,v])=>({name: k, ascending:v, count:6, cat: 'Blues', subcat: 'Minor'})),
//   ...Object.entries(pentatonics).map(([k,v])=>({name: k, ascending:v, count:5, cat: 'Pentatonic', subcat: 'Major'})),
// ];
