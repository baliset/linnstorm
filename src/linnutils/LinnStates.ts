
enum MidiMode {OneChannel,ChannelPerNote,ChannelPerRow}
enum QuantizeHolds {Off,Medium,Fast,Slow}
enum ZExpressions { PolyAfterTouch,ChannelAfterTouch,CCDefinedByCCforZ}
enum LinnColors { AsSet,Red,Yellow,Green,Cyan,Blue,Magenta,Off,Orange,White,Lime,Pink}
type PitchTransposeValue = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14;
type OctaveTransposeValue = 0|1|2|3|4|5|6|7|8|9|10;
type BendRange= number; // in reality
enum LowRowMode {Off,Sustain,Restr, Strum,ARp, Bend, CC1, CC16Thru18}
enum SpecialMode {Off,Arp,CCFaders,Strum,Sequencer}


export interface SplitState {
  midiMode: MidiMode;
  mainChannel: number; // 1-16
  enablePerNoteChannels:boolean[]; // 0-15 corresponds to 1-16 (native 0-1 values)
  perRowLowestChannel:number;
  bendRange: BendRange;

  sendX:                boolean;              // {nrpn:20, range:"0-1", desc:"Split Left Send X (0: Off, 1: On)"},
  quantize:             boolean;              // {nrpn:21, range:"0-1", desc:"Split Left Pitch Quantize (0: Off, 1: On)"},
  QuantizeHold:         QuantizeHolds;        // {nrpn:22, range:"0-3", desc:"Split Left Pitch Quantize Hold (0: Off, 1: Medium, 2: Fast, 3: Slow)"},
  PitchResetOnRelease:  boolean;              // {nrpn:23, range:"0-1", desc:"Split Left Pitch Reset On Release (unprinted parameter, 0: Off, 1: On)"},
  SendY:                boolean;              // {nrpn:24, range:"0-1", desc:"Split Left Send Y (0: Off, 1: On)"},
  CCforY:               number;               // 1, 74 or anything 0-127 {nrpn:25, range:"0-127", desc:"Split Left MIDI CC For Y (CC 1 or CC 74 are recommended, any CC is possible though)"},
  RelativeY:            boolean;              // {nrpn:26, range:"0-1", desc:"Split Left Relative Y (0: Off, 1: On)"},
  SendZ:                boolean;              // {nrpn:27, range:"0-1", desc:"Split Left Send Z (0: Off, 1: On)"},
  ExpressionForZ:       ZExpressions;         // {nrpn:28, range:"0-2", desc:"Split Left MIDI Expression For Z (0: Poly Aftertouch, 1: Channel Aftertouch, 2: CC defined in #29)"},
  CCforZ:               number;               // {nrpn:29, range:"0-127", desc:"Split Left MIDI CC For Z (CC 11 is recommended, any CC is possible though)"},
  ColorMain:            LinnColors;           // {nrpn:30, range:"1-6", desc:"Split Left Color Main (see color value table below)"},
  ColorAccent:          LinnColors;           // {nrpn:31, range:"1-6", desc:"Split Left Color Accent (see color value table below)"},
  ColorPlayed:          LinnColors;           // {nrpn:32, range:"0-6", desc:"Split Left Color Played (see color value table below)"},
  ColorLowRow:          LinnColors;           // {nrpn:33, range:"1-6", desc:"Split Left Color LowRow (see color value table below)"},
  LowRowMode:           LowRowMode;           // {nrpn:34, range:"0-7", desc:"Split Left LowRow Mode (0: Off, 1: Sust, 2: Restr, 3: Strum, 4: Arp, 5: Bend, 6: CC1, 7: CC16-18)"},
  Special:              SpecialMode;          // {nrpn:35, range:"0-3", desc:"Split Left Special (0: Off, 1: Arpeg, 2: CC Faders, 3: Strum, 4: Sequencer)"},
  Octave:               OctaveTransposeValue; // {nrpn:36, range:"0-10", desc:"Split Left Octave (0: —5, 1: -4, 2: -3, 3: -2, 4: -1, 5: 0, 6: +1, 7: +2, 8: +3, 9: +4. 10: +5)"},
  TransPitch:           PitchTransposeValue;  // {nrpn:37, range:"0-14", desc:"Split Left Transpose Pitch (0-6: -7 to -1, 7: 0, 8-14: +1 to +7)"},
  TransLightsAndPitch:  PitchTransposeValue;  // {nrpn:38, range:"0-14", desc:"Split Left Transpose Lights (0-6: -7 to -1, 7: 0, 8-14: +1 to +7)"},
  ExpressionForY:       ZExpressions;         // {nrpn:39, range:"0-2", desc:"Split Left MIDI Expression For Y (0: Poly Aftertouch, 1: Channel Aftertouch, 2: CC defined in #25)"},
}

interface PerSplitSettings {
  left: SplitState;
  right: SplitState;
}

