
//https://nickfever.com/music/midi-cc-list

export const ccIsLsbForCcMinus32 = (cc:number) => cc >=32 && cc <= 63;

// data is an on/off switch rather= than continuous
export const ccIsOnOff = (cc:number) => (cc >=64 && cc <= 68) ||(cc >=80 && cc <= 83);

export const ccNumbers:Record<number,string> =  {
  0: 'Bank Select', // Allows user to switch bank for patch selection. Program change used with Bank MIDI can access 16,384 patches per MIDI channel.
  1: 'Modulation', //often assigned to a vibrato or tremolo effect',
  2: 'Breath',
  4: 'Foot',
  5: 'Portamento Time',
  6: 'Data entry',
  7: 'Volume',
  8: 'Balance',


  10: 'Pan', //(0 = left; 64 = center; 127 = right)',
  11: 'Expression',      // (sometimes used also for volume control or similar, depending on the synthesizer)

  12: 'Effect Control 1', //Usually used to control a parameter of an effect within the synth/workstation.
  13: 'Effect Control 2', //Usually used to control a parameter of an effect within the synth/workstation.

  16: 'General Controller 1',
  17: 'General Controller 2',
  18: 'General Controller 3',
  19: 'General Controller 4',


  // 32-63 Controller 0-31 LSB
  32: 'Sound bank selection (LSB)',


  64: 'Sustain',      //(0 = no pedal; >= 64 => pedal ON)',
  65: 'Portamento',  // on/off
  66: 'Sostenuto', // on/off
  67: 'Soft pedal', // on/off
  68: 'Legato', // foot  switch,
  69: 'Hold 2',

  // sound controllers
  70: 'SC1 - e.g. Sound Variation',
  71: 'SC2 - e.g. Resonance/Timbre/Harmonics',
  72: 'SC3 - e.g. Release Time',
  73: 'SC4 - e.g. Attack Time',
  74: 'SC5 - e.g. Brightness',

  75: 'SC6',
  76: 'SC7',
  77: 'SC8',
  78: 'SC9',
  79: 'SC10',

  80: 'General Controller 5',
  81: 'General Controller 6',
  82: 'General Controller 7',
  83: 'General Controller 8',

  84: 'Portamento Control',

  // 85-90 undefined

  91: 'FX1 Depth - e.g. Reverb',
  92: 'FX2 Depth - e.g. Tremolo',
  93: 'FX3 Depth - e.g. Chorus',
  94: 'FX4 Depth - e.g. Detune',
  95: 'FX5 Depth - e.g. Phaser',

  96: 'Data increment',
  97: 'Data decrement',

  98: 'NRPN LSB',
  99: 'NRPN MSB',

  100: 'RPN LSB',  //For controllers 6, 38, 96, and 97, it selects the RPN parameter.
  101: 'RPN MSB', //For controllers 6, 38, 96, and 97, it selects the RPN parameter.
  // ----102-119 undefined

  //--- channel mode messages 120-127
  120: 'All Sound Off', //Mutes all sounding notes. It does so regardless of release time or sustain. (See MIDI CC 123)

  121: 'Reset All Controllers', //It will reset all controllers to their default.
  122: 'Local On/Off Switch', //Turns internal connection of a MIDI keyboard/workstation, etc. On or Off. If you use a computer, you will most likely want local control off to avoid notes being played twice. Once locally and twice whent the note is sent back from the computer to your keyboard.
  123: 'All notes off', // Mutes all sounding notes. Release time will still be maintained, and notes held by sustain will not turn off until sustain pedal is depressed.
  124: 'Omni Off',
  125: 'Omni On', //Mutes all sounding notes. Release time will still be maintained, and notes held by sustain will not turn off until sustain pedal is depressed.
  126: 'Mono On', //Sets device mode to Monophonic. [Channel Mode Message] Mono Mode On (+ poly off, + all notes off). This equals the number of channels, or zero if the number of channels equals the number of voices in the receiver.
  127: 'Poly On' //Sets device mode to Polyphonic. [Channel Mode Message] Poly Mode On (+ mono off, +all notes off).
};

// 0xbn 0x01-0x07 <data> carry msb of 14 bit values together with
// 0xbn 0x21-0x27 <data> carry lsb of 14 bit values in parallel
// these ccs are named   1: 'Modulation', 2: 'Breath', 4: 'Foot', 5: 'Portamento Time',  6: 'Data entry', 7: 'Volume',
// 0x03, 0x23 missing from above list
// 0x62, 0x63 NRPN and 0x64, 0x65 RPN are similarly paired but LSB is in the lower of the pair rather than the higher number

const Fmsgs = {
  //accounted 0,1,2,3  (4,5?) 6,7, 8,9,a,b,c (d?), e,f

  // sys ex
  0xf0: 'SysEx Start',
  0xf7: 'SysEx End',

  // system common
  0xf2: 'Song Pointer', // then lsb, msb
  0xf3: 'Song Select',  // then b1=song number
  0xf6: 'Tune Request', // no data




  // midi time code b1 = data
  0xf1: 'Quarter Frame',

  // these are system realtime, only measure end has a second byte, and it isn't used
  0xf8: 'Timing Clock',
  0xf9: 'Measure End',
  0xfa: 'Start',
  0xfb: 'Continue',
  0xfc: 'Stop',
  0xfe: 'Active Sensing',
  0xff: 'Reset',




};

