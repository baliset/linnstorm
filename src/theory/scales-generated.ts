import {cumulate} from '../utils/cumulate';

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
    ['E♭', 'F',  'G',  'A♭', 'B♭', 'C',  'D',  'E♭'],
    ['E',  'F♯', 'G♯', 'A',  'B',  'C♯', 'D♯', 'E' ],
    ['F',  'G',  'A',  'B♭', 'C',  'D',  'E',  'F' ],
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
  return arr;
}

const rotateOneLeft = (arr:any[])=>[...arr.slice(1), ...arr.slice(0,1)];
export const rotateNRight =(arr:any[],n:number)=>[...arr.slice(arr.length-n, arr.length), ...arr.slice(0, arr.length-n)];
export const rotateNLeft = (arr:any[],n:number)=>[...arr.slice(n, arr.length), ...arr.slice(0, n)];
const rotate = (arr:any[])=>[...arr.slice(1), ...arr.slice(0,1)];

const modeIt = (modeIndex:number, arr:any[]) => {
  let result = arr;


  for(let i = 0; i < modeIndex; ++i)
    result = rotate(result);

  console.log(`modeitt ${modeIndex}`, result, arr);
  return result;
}

const romanNumerals = ['I','II', 'III', 'IV', 'V', 'VI', 'VII'];
const romanize = (arr:any[],index:number)=>(index>0 || arr.length>1)?` (Mode ${romanNumerals[index]})`:'';

export type ExpandedScale = {
  name:string,
  semis:SemisType,
  semisToIndices:number[],
  projectedIndices:number[],
  count:number,
  perTonicScales:escale[]
};

// the perTonicScales need to be rotated the inverse of the mode index
// IOW, ionic is mode index 0 (aka I), and Dorian is index 1 (aka mode II)
// since ionic semis is 2,2,1,2,2,2,1 moving from zero to mode index 1 means
// that the last two arrays need to be rotated to be first two arrays, since they naturally start two semitones later

export function expandScales(): ExpandedScale[]
{
  const result:any[] = [];
  unexpanded.forEach((nscale:NScale)=> {
    const {modes, scales, prefix, semis:oSemis} = nscale;
    // semis looks like 2,2,1,2,2,2,1
    // semisToIndices looks like 0,2,4,5,7,9,11,12
    // projected looks like [0,-1, 2,-1, 4...etc.]

    const count = scales[0].length - 1; // how many unique notes in scale 7,6, or 5


    const cumOSemis = cumulate([0,...oSemis]); // use this to rotate scales consistent to same tonic

    modes.forEach((mode, index)=>{

      const semis = rotateNLeft(oSemis, index);
      const semisToIndices:number[] = cumulate([0,...semis]);

      const temp = scales.map(scale=>{
        const slimScale = scale.slice(0,-1);
        const rotated = rotateNLeft(slimScale, index);
        return [...rotated, rotated[0]];
        // return modeIt(index,scale)

      });

      const perTonicScales = rotateNRight(temp,cumOSemis[index]);

      const projectedIndices = projectSemis(semis);

      const modename = (typeof mode === 'string')? mode: mode.join('/');
      const pfx = prefix.length?
        (modename.length? `${prefix}-`:`${prefix}`):
        '';
      const name = `${pfx}${modename}${romanize(modes,index)}`;
      result.push({name, semis, semisToIndices, projectedIndices, count, perTonicScales})
    });

  });
  console.log(`expandScales`, result);
  return result;
}

export function twelveFor(tonic:number, exSc:ExpandedScale): escale
{
  const {perTonicScales, semis} = exSc;
  const scale = perTonicScales[tonic];

  const arr:escale = Array.from(new Array(12).fill(''));
  let walkingIndex = 0;
  semis.forEach((v,i)=>{
    arr[walkingIndex] = scale[i];
    walkingIndex += v;
  });
  return arr;
}

