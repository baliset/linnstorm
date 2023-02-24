


 const westernScales = {
  // the following Western scales are listed starting with Major
  Ionian:     [2,2,1,2,2,2,1] , // (C Major playing white keys from C)
  Dorian:     [2,1,2,2,2,1,2] , // (like playing the C scale from D to D)
  Phrygian:   [1,2,2,2,1,2,2] , // (like playing the C scale from E to E)
  Lydian:     [2,2,2,1,2,2,1] , // (like playing the C scale from F to F)
  Mixolydian: [2,2,1,2,2,1,2] , // (like playing the C scale from G to G)
  Aeolian:    [2,1,2,2,1,2,2] , // (like playing the C scale from A to A — also known as the A natural minor scale)
  Locrian:    [1,2,2,1,2,2,2] , // (like playing the C scale from B to B)
  Flamenco:  [ 1,3,1,2,1,3,1], // example in E e,f,g#,a,b,c,d#, e
};


//The formula for the double harmonic major scale is: h, (W+h), h, W, h, (W+h), h
// https://muted.io/double-harmonic-major-scale/
 const doubleHarmonicScales7 = {
'1	Double harmonic major': [1,3,1,2,1,3,1], // 	1	♭2	3	4	5	♭6	7	8
'2	Lydian': [3,1,2,1,3,1,1], //??? ♯2 ♯6	1	♯2	3	♯4	5	♯6	7	8
'3	Ultraphrygian': [1,2,1,3,1,1,3], //	1	♭2	♭3	♭4	5	♭6	double flat7	8
'4	Hungarian/Gypsy minor': [2,1,3,1,1,3,1], //	1	2	♭3	♯4	5	♭6	7	8
'5	Oriental': [1,3,1,1,3,1,2], //	1	♭2	3	4	♭5	6	♭7	8
'6	Ionian': [3,1,1,3,1,2,1], // ♯2 ♯5	1	♯2	3	4	♯5	6	7	8
'7	Locrian double flat3 double flat7': [1,1,3,1,2,1,3], //	1	♭2	double flat3	4	♭5	♭6	double flat7	8 */
};


//https://en.wikipedia.org/wiki/Pentatonic_scale
//  I reordered by rotation
  const pentatonics = {
    'Pentatonic Major':      [2,2,3,2,3], // oomit 4 7
    'Pentatonic Suspended':  [2,3,2,3,2], // omit 3 6
    'Pentatonic Blues Minor':[3,2,3,2,2], // omit 2 5
    'Pentatonic Blues Major':[2,3,2,2,3],  // omit 3 7
    'Pentatonic Minor':      [3,2,2,3,2], // omit 2/6

  }

  const wholeToneScales = {WholeTone: [2,2,2,2,2,2]};

 const bluesMajorHexatonics = {
  BluesMajor1: [2,1,1,3,2,3,],
  BluesMajor2: [1,1,3,2,3,2,],
  BluesMajor3: [1,3,2,3,2,1,],
  BluesMajor4: [3,2,3,2,1,1,],
  BluesMajor5: [2,3,2,1,1,3,],
  BluesMajor6: [3,2,1,1,3,2,],
};

 const bluesMinorHexatonics = {
  BluesMinor1: [2,1,1,3,2,3,],
  BluesMinor2: [1,1,3,2,3,2,],
  BluesMinor3: [1,3,2,3,2,1,],
  BluesMinor4: [3,2,3,2,1,1,],
  BluesMinor5: [2,3,2,1,1,3,],
  BluesMinor6: [3,2,1,1,3,2,],
};


 const jlitScales = {
  // presented rotating
  'Mi Sheberach': [2,1,3,1,2,1,2],
  'Ahava Rabbah': [1,3,1,2,1,2,2],   // d, eb, f#,g,a,Bb,c,d  -- down: d, c,Bb, a, g

  // order?
  'Magen Avos': [2,1,2,2,1,2,2],  /// d,e,f,g,a,Bb,c d,  (looks like D minor / Aeolian exactly?? but Magen Avos is D minor, shifting to F major and back)
  'Yishtabach': [1,2,2,2,1,2,2],   // same as phrygian
  // 'Hashem Malach': [], // d.
}


export const scaleOfScales = [
  ...Object.entries(westernScales).map(([k,v])=>({name: k, ascending:v, count:7, cat: 'Western', subcat: ''})),
  ...Object.entries(doubleHarmonicScales7).map(([k,v])=>({name: k, ascending:v, count:7, cat: 'DoubleHarmonic', subcat: ''})),
  ...Object.entries(jlitScales).map(([k,v])=>({name: k, ascending:v, count:7, cat: 'Jewish Liturgy', subcat: ''})),
  ...Object.entries(wholeToneScales).map(([k,v])=>({name: k, ascending:v, count:6, cat: 'Wholetone', subcat: 'Wholetone'})),
  ...Object.entries(bluesMajorHexatonics).map(([k,v])=>({name: k, ascending:v, count:6, cat: 'Blues', subcat: 'Major'})),
  ...Object.entries(bluesMinorHexatonics).map(([k,v])=>({name: k, ascending:v, count:6, cat: 'Blues', subcat: 'Minor'})),
  ...Object.entries(pentatonics).map(([k,v])=>({name: k, ascending:v, count:5, cat: 'Pentatonic', subcat: 'Major'})),
];


// https://en.wikipedia.org/wiki/Flamenco_mode  e,f,g#,a,b,c,d#, e  1,3,1,2,1,3,1


export const altScaleName = {
'Double harmonic major': 'Byzantine',
  Aeolian: 'Minor',
  Ionian: 'Major',
  Phrygian: 'Yishtabach',
  'Ahava Rabbah': ['Freygish', 'Phrygian Dominant'],
  'Mi Sheberach': ['Ukrainian Dorian']
}
