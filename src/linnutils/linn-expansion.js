export const assignments = ['Oct Down', 'Oct Up', 'Sustain', 'CC65', 'Arp', 'Alt Split',
  'Auto Octave', 'Tap Tempo', 'Legato', 'Latch', 'Preset Up', 'Preset Down', 'Rev. Pitch X',
  'Sequencer Play', 'Sequencer Previous', 'Sequencer Next', 'Send Midi Clock', 'Sequencer Mute'];

export const arpDir = ['Up','Down','Up Down', 'Random', 'Replay All'];
export const tempoValues = ['?', '1/8', '1/8 Tri', '1/16', '1/16 Swing', '1/16 Tri', '1/32', '1/32 Tri'];
export const rowOffsets = ['No Overlap', '*','*', 3,4,5,6,7,'*','*','*','*', 12, 'Guitar'];

// {nrpn:237, key: 'ArpOctaveExtension',     min: 0, max:   2, desc: "Arp Octave Extension (0: None, 1: +1, 2: +2)"},

const arpOctExt= ['None', '+1', '+2'];

export const animations = [
  'Cell', 'Same', 'Crosses', 'Circles','Squares', 'Diamonds',
  'Stars', 'Sparkles', 'Curtains', 'Blinds', 'Targets',
  'Up', 'Down', 'Left', 'Right','Orbits'
];


const colors = ['!as set!','red','yellow','green','cyan','blue','magenta','!off!','white','orange','lime','pink'];
const octave = [-5,-4,-3,-2,-1, 0,'+1','+2','+3','+4','+5'];
const trPitch = [-7,-6,-5,-4,-3,-2,-1,0,'+1','+2','+3','+4','+5','+6','+7'];
export const pitchClass = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; // flats are BEA sharps FC

export function vfParamType(nrpn)
{
  // there are pairs of values 0-66 and 100-166 that have same formatting
  const nrpnNormalizedForSwitch = nrpn >= 100 && nrpn <=166? nrpn - 100: nrpn;

  switch(nrpnNormalizedForSwitch)
  {
    case  30:
    case  31:
    case  32:
    case  33: return 'color';
    case  61: return 'anim';
    case 201: return 'leftright';

    case 235: return 'arpdir';
    case 236: return 'tempo';
    case 237: return 'arpoctext'
    default:  return '';

  }



}
export function vfExpander(nrpn, v)
{
  if(v === undefined || v === null)
    return '?';

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
