const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const { inverseLerp, clamp } = require('canvas-sketch-util/math');

/**
 * Input
 */

const settings = {
  dimensions: [ 2048, 2048 ]
};

// 0 to 1
const noiseFrequency = 0.0013;
const noiseAmplitude = 0.4;

// -1 to 1
const lightnessOffset = 0.3;

const seed = random.getRandomSeed();
random.setSeed(seed);

// eslint-disable-next-line no-console
console.log('seed:', seed);

const gridCount = [
  32,
  32
];

const cellDimensions = [
  settings.dimensions[0] / gridCount[0],
  settings.dimensions[1] / gridCount[1]
];


/**
 * Process
 */

const noiseGrid = Array.from({ length: gridCount[0] }, (emptyColumn, columnIndex) => {
  return Array.from({ length: gridCount[1] }, (emptyRow, rowIndex) => {
    const left = columnIndex * cellDimensions[0];
    const top = rowIndex * cellDimensions[1];
    const noiseValue = random.noise2D(left, top, noiseFrequency, noiseAmplitude);
    const lightness = inverseLerp(-1, 1, noiseValue);
    const offsestLightness = clamp(lightness + lightnessOffset, 0, 1);

    return {
      left,
      top,
      color: `hsl(0, 0%, ${ offsestLightness * 100 }%)`
    };
  });
});

const drawCell = ({
  context,
  left,
  top,
  color,
  width,
  height
}) => {
  context.fillStyle = color;
  context.fillRect(left, top, width, height);
};


/**
 * Output
 */

const sketch = () => {
  return ({ context }) => {
    noiseGrid.forEach(column => {
      column.forEach(cell => {
        drawCell({
          context,
          width: cellDimensions[0],
          height: cellDimensions[1],
          ...cell
        });
      });
    })
  };
};

canvasSketch(sketch, settings);
