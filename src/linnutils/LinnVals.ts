import {oReduce} from '../utils/oreduce';

type LinnValue = {nrpn: number; value: number; };  // this is what we can send and receive, it is associated nrpn as key  to specific LinnParam;


type LinnSplit     = {cat: 'PerSplit'; side:'Left'|'Right'; }
type LinnParamType = {cat:'Global'|'PerSplit'|'Device'; subcat?:'PerNote'|'PerChannel'|'ColorType', side?:'Left'|'Right';}
type LinnGlobalType ={cat:'Global'|'Device';}
type LinnSubCat = {}

export type LinnParam = Partial<LinnParamType> & {nrpn: number, min:number, max:number; desc:string, key?:string }
type LinnBoolParam = LinnParam & {min:0, max:1};

type LinnSplitParam = LinnParam & LinnSplit;  // a LinnSplitParam must specify which side is meant, left or right

// these must have min max of 0/1
const splitBooleans:LinnBoolParam[] = [
  {nrpn:20, key: 'SendX',  desc:"Send X (0: Off, 1: On)"},
  {nrpn:24, key: 'SendY',  desc:"Send Y (0: Off, 1: On)"},
  {nrpn:27, key: 'SendZ',  desc:"Send Z (0: Off, 1: On)"},

  {nrpn:21, key: 'Quantize',                  desc:"Pitch Quantize (0: Off, 1: On)"},
  {nrpn:23, key: 'PitchResetOnRelease',       desc:"Pitch Reset On Release (unprinted parameter, 0: Off, 1: On)"},
  {nrpn:26, key: 'RelativeY',                 desc:"Relative Y (0: Off, 1: On)"},
  {nrpn:48, key: 'LowRowXBehavior',           desc:"LowRow X Behavior (0: Hold, 1: Fader)"},
  {nrpn:50, key: 'LowRowXYZBehavior',         desc:"LowRow XYZ Behavior (0: Hold, 1: Fader)"},
  {nrpn:60, key: 'ChannelPerRowChannelOrder', desc:"Channel Per Row MIDI Channel Order (0: Normal, 1: Reversed)"},
].map(o=>({...o, min:0, max:1}));


// append Split Left or Split Right to final description, then
const someSplits: LinnParam[] = [
  ...splitBooleans,
  {nrpn: 0, key: 'MidiMode',            min: 0, max:   2, desc: "MIDI Mode (0: One Channel, 1: Channel Per Note, 2: Channel Per Row)"},
  {nrpn: 1, key: 'MainChan',            min: 1, max:  16, desc: "MIDI Main Channel"},
  {nrpn:18, key: 'PerRowLowestChannel', min: 1, max:  16, desc: "MIDI Per Row Lowest Channel"},
  {nrpn:19, key: 'BendRange',           min: 1, max:  96, desc: "MIDI Bend Range"},
  {nrpn:22, key: 'QuantizeHold',        min: 0, max:   3, desc: "Pitch Quantize Hold (0: Off, 1: Medium, 2: Fast, 3: Slow)"},
  {nrpn:25, key: 'CCforY',              min: 0, max: 127, desc: "MIDI CC For Y (CC 1 or CC 74 are recommended, any CC is possible though)"},
  {nrpn:28, key: 'ExpressionForZ',      min: 0, max:   2, desc: "MIDI Expression For Z (0: Poly Aftertouch, 1: Channel Aftertouch, 2: CC defined in #29)"},
  {nrpn:29, key: 'CCforZ',              min: 0, max: 127, desc: "MIDI CC For Z (CC 11 is recommended, any CC is possible though)"},
  {nrpn:30, key: 'ColorMain',           min: 1, max:   6, desc: "Color Main (see color value table below)"},
  {nrpn:31, key: 'ColorAccent',         min: 1, max:   6, desc: "Color Accent (see color value table below)"},
  {nrpn:32, key: 'ColorPlayed',         min: 0, max:   6, desc: "Color Played (see color value table below)"},
  {nrpn:33, key: 'ColorLowRow',         min: 1, max:   6, desc: "Color LowRow (see color value table below)"},
  {nrpn:34, key: 'LowRowMode',          min: 0, max:   7, desc: "LowRow Mode (0: Off, 1: Sust, 2: Restr, 3: Strum, 4: Arp, 5: Bend, 6: CC1, 7: CC16-18)"},
  {nrpn:35, key: 'Special',             min: 0, max:   3, desc: "Special (0: Off, 1: Arpeg, 2: CC Faders, 3: Strum, 4: Sequencer)"},
  {nrpn:36, key: 'Octave',              min: 0, max:  10, desc: "Octave (0: —5, 1: -4, 2: -3, 3: -2, 4: -1, 5: 0, 6: +1, 7: +2, 8: +3, 9: +4. 10: +5)"},
  {nrpn:37, key: 'TransPitch',          min: 0, max:  14, desc: "Transpose Pitch (0-6: -7 to -1, 7: 0, 8-14: +1 to +7)"},
  {nrpn:38, key: 'TransLightsAndPitch', min: 0, max:  14, desc: "Transpose Lights (0-6: -7 to -1, 7: 0, 8-14: +1 to +7)"},
  {nrpn:39, key: 'ExpressionForY',      min: 0, max:   2, desc: "MIDI Expression For Y (0: Poly Aftertouch, 1: Channel Aftertouch, 2: CC defined in #25)"},
  {nrpn:40, key: 'CCforFader1',         min: 0, max: 128, desc: "MIDI CC For Fader 1 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:41, key: 'CCforFader2',         min: 0, max: 128, desc: "MIDI CC For Fader 2 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:42, key: 'CCforFader3',         min: 0, max: 128, desc: "MIDI CC For Fader 3 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:43, key: 'CCforFader4',         min: 0, max: 128, desc: "MIDI CC For Fader 4 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:44, key: 'CCforFader5',         min: 0, max: 128, desc: "MIDI CC For Fader 5 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:45, key: 'CCforFader6',         min: 0, max: 128, desc: "MIDI CC For Fader 6 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:46, key: 'CCforFader7',         min: 0, max: 128, desc: "MIDI CC For Fader 7 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:47, key: 'CCforFader8',         min: 0, max: 128, desc: "MIDI CC For Fader 8 (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:49, key: 'CCforLowRow',         min: 0, max: 128, desc: "MIDI CC For LowRow X (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:51, key: 'CCforLowRowXyzX',     min: 0, max: 128, desc: "MIDI CC For LowRow XYZ X (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:52, key: 'CCforLowRowXyzY',     min: 0, max: 128, desc: "MIDI CC For LowRow XYZ Y (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:53, key: 'CCforLowRowXyzZ',     min: 0, max: 128, desc: "MIDI CC For LowRow XYZ Z (0-127: CC, 128: Channel Aftertouch)"},
  {nrpn:54, key: 'CCYmin',              min: 0, max: 127, desc: "Minimum CC Value For Y"},
  {nrpn:55, key: 'CCYmax',              min: 0, max: 127, desc: "Maximum CC Value For Y"},
  {nrpn:56, key: 'CCZmin',              min: 0, max: 127, desc: "Minimum CC Value For Z"},
  {nrpn:57, key: 'CCZmax',              min: 0, max: 127, desc: "Maximum CC Value For Z"},
  {nrpn:58, key: 'CCforZ14bit',         min: 0, max:   1, desc: "CC Value For Z in 14-bit"},
  {nrpn:59, key: 'InitValRelativeY',    min: 0, max: 127, desc: "Initial Value For Relative Y"},
  {nrpn:61, key: 'TouchAnimation',      min: 0, max:  11, desc: "Touch Animation (0: Same, 1: Crosses, 2: Circles, 3: Squares, 4: Diamonds, 5: Stars, 6: Sparkles, 7: Curtains, 8: Blinds, 9: Targets, 10: Up, 11: Down, 12: Left, 13: Right, 14: Orbits)"},
  {nrpn:65, key: 'SeqSelectPattern',    min: 0, max:   3, desc: "Sequencer Select Pattern Number"},


];

const chan16Arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

// append Split Left or Split Right to final description, then
// append 'MIDI Per Note ; to description
// designate them as off/on booleans  (0: Off, 1: On)
// 2-17 are channels 1-16
const perNoteSplits:LinnBoolParam[] = chan16Arr.map(n=>({nrpn:1+n, min:0, max:1, desc:`MIDI Per Note Channel:${n}`})) ;


function splitify(o:LinnParam, side:'Left'|'Right'):LinnSplitParam {
  return {...o, cat: 'PerSplit', side, desc: `Split ${side} ${o.desc}`};
}

export const allSplitParams = [
  ...someSplits.map(   o=>({...o,                  cat: 'PerSplit', side: 'Left'})),
  ...perNoteSplits.map(o=>({...o,                  cat: 'PerSplit', side: 'Left',  subcat:'PerNote', desc:`Split Left ${o.desc}`, key:`SLPerNote${o.desc}`})),
  // rights are like lefts different side, and nrpn value is incremented by 100
  ...someSplits.map(   o=>({...o, nrpn:o.nrpn+100, cat: 'PerSplit', side: 'Right'})),
  ...perNoteSplits.map(o=>({...o, nrpn:o.nrpn+100, cat: 'PerSplit', side: 'Right', subcat:'PerNote', desc:`Split Right ${o.desc}`,key:`SRPerNote${o.desc}` })),
];

// this nrpns perform actions, and return no values (so min and max are both 1)

const splitCommands = [
  {nrpn:62, key: 'SeqTogglePlay',   min: 1, max: 1, desc:"Sequencer Toggle Play"},
  {nrpn:63, key: 'SeqPrevPattern',  min: 1, max: 1, desc:"Sequencer Previous Pattern"},
  {nrpn:64, key: 'SeqNextPattern',  min: 1, max: 1, desc:"Sequencer Next Pattern"},
  {nrpn:66, key: 'SeqToggleMute',   min: 1, max: 1, desc:"Sequencer Toggle Mute"},  // not queryable
];

//... todo enforce types here, had some typescript complaints about LinnSplitParams
export const allSplitCommands = [
  ...splitCommands.map(   o=>({...o,                  cat: 'PerSplit', side: 'Left' })),
  ...splitCommands.map(   o=>({...o, nrpn:o.nrpn+100, cat: 'PerSplit', side: 'Right'})),
]

const NoteLightsMain:LinnBoolParam[] = [
    {nrpn:203, desc:"C" }, {nrpn:204, desc:"C#"}, {nrpn:205, desc:"D"},  {nrpn:206, desc:"D#"}, {nrpn:207, desc:"E" }, {nrpn:208, desc:"F"},
    {nrpn:209, desc:"F#"}, {nrpn:210, desc:"G" }, {nrpn:211, desc:"G#"}, {nrpn:212, desc:"A" }, {nrpn:213, desc:"A#"}, {nrpn:214, desc:"B"},
  ].map(o=>({...o, key:`NoteLightsMain${o.desc}`, min:0, max:1, desc:`Main Note Light ${o.desc} (0: Off, 1: On)`}));

const NoteLightsAccent= [
    {nrpn:215, desc:"C" }, {nrpn:216, desc:"C#"}, {nrpn:217, desc:"D" }, {nrpn:218, desc:"D#"}, {nrpn:219, desc:"E" }, {nrpn:220, desc:"F"},
    {nrpn:221, desc:"F#"}, {nrpn:222, desc:"G" }, {nrpn:223, desc:"G#"}, {nrpn:224, desc:"A" }, {nrpn:225, desc:"A#"},{nrpn:226, desc:"B"},
].map(o=>({...o, key:`NoteLightsAccent${o.desc}`, min:0, max:1, desc:`Accent Note Light ${o.desc} (0: Off, 1: On)`}));

const GuitarTuningPerRow= [0,1,2,3,4,5,6,7].map((v:number)=>({nrpn:v+263, min:0, max: 127, key:`GuitarRow${v+1}`, desc:`Note Number For Guitar Tuning Row ${v+1}`}));

const assignments = 'Assignment (0: Oct Down, 1: Oct Up, 2: Sustain, 3: CC65, 4: Arp, 5: Alt Split, 6: Auto Octave, 7: Tap Tempo, 8: Legato, 9: Latch, 10: Preset Up, 11: Preset Down, 12: Reverse Pitch X, 13: Sequencer Play, 14: Sequencer Previous, 15: Sequencer Next, 16: Send MIDI Clock, 17: Sequencer Mute)'
const both = 'Both Splits (0: Off, 1: On)';
const otherGlobal = [
  {nrpn:200, key: 'SplitActive',            min: 0, max:   1, desc: "Split Active (0: Inactive, 1: Active)"},
  {nrpn:201, key: 'SplitSelected',          min: 0, max:   1, desc: "Selected Split (0: Left Split, 1: Right Split)"},
  {nrpn:202, key: 'SplitPointColumn',       min: 2, max:  25, desc: "Split Point Column"},

  {nrpn:227, key: 'RowOffset',              min: 0, max:  13, desc: "Row Offset (only supports, 0: No overlap, 3 4 5 6 7 12: Intervals, 13: Guitar, 127: 0 offset)"},
  {nrpn:228, key: 'Switch1Assignment',      min: 0, max:   5, desc: `Switch 1 ${assignments}`},
  {nrpn:229, key: 'Switch2Assignment',      min: 0, max:   5, desc: `Switch 2 ${assignments}`},
  {nrpn:230, key: 'FootLeftAssignment',     min: 0, max:   5, desc: `Foot Left ${assignments}`},
  {nrpn:231, key: 'FootRightAssignment',    min: 0, max:   5, desc: `Foot Right ${assignments}`},
  {nrpn:232, key: 'SensitivityVelocity',    min: 0, max:   3, desc: "Velocity Sensitivity (0: Low, 1: Medium, 2: High, 3: Fixed)"},
  {nrpn:233, key: 'SensitivityPressure',    min: 0, max:   2, desc: "Pressure Sensitivity (0: Low, 1: Medium, 2: High)"},
  {nrpn:235, key: 'ArpDirection',           min: 0, max:   4, desc: "Arp Direction (0: Up, 1: Down, 2: Up Down, 3: Random, 4: Replay All)"},
  {nrpn:236, key: 'ArpTempoNoteValue',      min: 1, max:   7, desc: "Arp Tempo Note Value (1: 8, 2: 8 Tri, 3: 16, 4: 16 Swing, 5: 16 Tri, 6: 32, 7: 32 Tri)"},
  {nrpn:237, key: 'ArpOctaveExtension',     min: 0, max:   2, desc: "Arp Octave Extension (0: None, 1: +1, 2: +2)"},
  {nrpn:238, key: 'ClockBeatsPerMin',       min: 1, max: 360, desc: "Clock BPM (applies when receiving no MIDI clock)"},
  {nrpn:239, key: 'Switch1BothSplits',      min: 0, max:   1, desc: `Switch 1 ${both}`},
  {nrpn:240, key: 'Switch2BothSplits',      min: 0, max:   1, desc: `Switch 2 ${both}`},
  {nrpn:241, key: 'FootLeftBothSplits',     min: 0, max:   1, desc: `Foot Left ${both}`},
  {nrpn:242, key: 'FootRightBothSplits',    min: 0, max:   1, desc: `Foot Right ${both}`},
  {nrpn:243, key: 'LoadPreset',             min: 0, max:   5, desc: "Settings Preset Load"},
  {nrpn:244, key: 'PressureAftertouch',     min: 0, max:   1, desc: "Pressure Aftertouch (0: Off, 1: On)"},

  {nrpn:247, key: 'ActiveNoteLightsPreset', min: 0, max:  11, desc: "Active Note Lights Preset"},
  {nrpn:248, key: 'LegacyCCForSwitchCC65',  min: 0, max: 127, desc: "MIDI CC For Switch CC65 (Changes the CC for all switches - Legacy option, see NRPN 255-258)"},
  {nrpn:249, key: 'VelocityMin',            min: 1, max: 127, desc: "Minimum Value For Velocity"},
  {nrpn:250, key: 'VelocityMax',            min: 1, max: 127, desc: "Maximum Value For Velocity"},
  {nrpn:251, key: 'VelocityFixed',          min: 1, max: 127, desc: "Value For Fixed Velocity"},
  {nrpn:253, key: 'CustomRowOffset',        min: 0, max:  33, desc: "Custom Row Offset Instead Of Octave (0-32: -16-16 semitone intervals, 33: inverted Guitar)"},

  {nrpn:255, key: 'CCForFootLeftCC65',      min: 0, max: 127, desc: "MIDI CC For Foot Left CC65"},
  {nrpn:256, key: 'CCForFootRightCC65',     min: 0, max: 127, desc: "MIDI CC For Foot Right CC65"},
  {nrpn:257, key: 'CCForSwitch1CC65',       min: 0, max: 127, desc: "MIDI CC For Switch 1 CC65"},
  {nrpn:258, key: 'CCForSwitch2CC65',       min: 0, max: 127, desc: "MIDI CC For Switch 2 CC65"},
  {nrpn:259, key: 'CCForFootLeftSustain',   min: 0, max: 127, desc: "MIDI CC For Foot Left Sustain"},
  {nrpn:260, key: 'CCForFootRightSustain',  min: 0, max: 127, desc: "MIDI CC For Foot Right Sustain"},
  {nrpn:261, key: 'CCForSwitch1Sustain',    min: 0, max: 127, desc: "MIDI CC For Switch 1 Sustain"},
  {nrpn:262, key: 'CCForSwitch2Sustain',    min: 0, max: 127, desc: "MIDI CC For Switch 2 Sustain"},
];

export const allGlobals = [
  ...NoteLightsAccent, ...NoteLightsMain, ...GuitarTuningPerRow,
  ...otherGlobal
].map(o=>({...o, cat:'Global', desc:`Global ${o.desc}`}));

export const deviceSettings = [
  {key:'IO', nrpn:234, min: 0, max: 1, desc:"Device MIDI I/O (0: MIDI Jacks, 1: USB)"},
  {key: 'FirmwareMode', nrpn:245, min: 0, max: 1, desc:"Device User Firmware Mode (0: Off, 1: On)"},
  {key: 'LeftHandedOperation', nrpn:246, min: 0, max: 1, desc:"Device Left Handed Operation (0: Off, 1: On)"},
  {key: 'MinIntervalBetweenMidiBytes', nrpn:252, min: 0, max: 512, desc:"Device Minimum Interval Between MIDI Bytes Over USB"},
  {key:'MidiThru', nrpn:254, min: 0, max: 1, desc:"Device MIDI Through (0: Off, 1: On)"},
].map(o=>({...o, key:`${o.key}`, cat: 'Device'}))      ;

//todo why is type LinnParam[] not working here
export const allParams:any[] = [...deviceSettings, ...allGlobals, ...allSplitParams].map(o=>({...o, a:'', b:'', c:'', d:''}));

// lookup a key by nrpn, or by key
export const allParamsByNrpn = oReduce(allParams,(o:LinnParam)=>[o.nrpn,o], {});
export const allParamsByKey  = oReduce(allParams,(o:LinnParam)=>[o.key, o], {});

//==============


export function paramNumToName(n:number): string {
  const found = allParamsByNrpn[n];
  return found?.key || found?.desc ||    `unparsedParam[${n}]`
}

// if(Object.keys(allParamsByKey).length !== allParams.length)
//   throw new Error('There must be a duplicate key for a linnstrument parameter');
// if(Object.keys(allParamsByNrpn).length !== allParams.length)
//   throw new Error('There must be a duplicate nrpn for a linnstrument parameter');


// create a comparison showing which records are the same, which are different
// which are present in one but missing in the other
export function compareVals(a:Record<number,number>, b:Record<number,number>)
{


}
