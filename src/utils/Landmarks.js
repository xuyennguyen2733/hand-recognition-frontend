export const THUMB_TIP = 4;
export const INDEX_TIP = 8;
export const MIDDLE_TIP = 12;
export const RING_TIP = 16;
export const PINKY_TIP = 20;
export const WRIST_BASE = 0;
export const NOSE_TIP = 0;

export const HAND_LANDMARKS_LITE = [
  WRIST_BASE,
  THUMB_TIP,
  INDEX_TIP,
  MIDDLE_TIP,
  RING_TIP,
  PINKY_TIP,
];

export const normalize = (landmarks, [originX, originY]) => {
  // console.log('origin', originX, originY)
  return landmarks.map(([x, y]) => {
    // console.log('x, y', x, y);
    return ([x - originX, y - originY ])
  })
};

export const processForScatterGraph = (landmarks) => {
  const processedLandmarks = landmarks.map((landmark) => {
      // console.log('landmark', landmark)
        return [
          landmark.x,
          -landmark.y,
        ];
    });
    
  return processedLandmarks;
}

export const sample = (sequence, targetLength) => {
  const sequenceLength = sequence.length;
  let sampledSequence = [];
if (sequenceLength < targetLength) {
    const lengthDifference = targetLength - sequenceLength;
    
    let increment = (sequenceLength - 1) / lengthDifference;
        let index = increment;
        let currentIndex = 0;
        for (let i = 0; i < targetLength; i++) {
            sampledSequence.push(sequence[currentIndex]);
            if (currentIndex === Math.floor(index)) {
                index += increment;
            }
            else {
                currentIndex++;
            }
        }
    
} else if (sequenceLength > targetLength) {
    let increment = (sequenceLength - 1) / targetLength;
    let index = increment; 
    for (let i = 0; i < targetLength; i ++) {
        sampledSequence.push(sequence[Math.floor(index)]);
        index += increment;
    }
}
return sampledSequence;
};

export const handColorsFull = [
  "white",
  "white",
  "red",
  "red",
  "red",
  "green",
  "green",
  "green",
  "green",
  "blue",
  "blue",
  "blue",
  "blue",
  "pink",
  "pink",
  "pink",
  "pink",
  "purple",
  "purple",
  "purple",
  "purple",
  "transparent",
  "transparent",
  "transparent",
  "transparent",
];

export const handColorsLite = [
  "white",
  "red",
  "green",
  "blue",
  "pink",
  "purple",
  "transparent",
  "transparent",
  "transparent",
  "transparent",
];
