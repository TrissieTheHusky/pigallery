import * as tf from '@tensorflow/tfjs/dist/tf.es2017.js';
import * as log from '../shared/log.js';
import * as draw from './draw.js';
import * as modelDetect from '../process/modelDetect.js';
import * as definitions from '../shared/models.js';

let canvas;
let ctx;

async function run(name, input, config, objects) {
  const t0 = performance.now();
  if (!objects.models[name]) {
    document.getElementById('status').innerText = `loading model: ${name} ...`;
    const memory0 = await tf.memory();
    const options = definitions.models.detect.find((a) => a.name === name);
    objects.models[name] = await modelDetect.load(options);
    const memory1 = await tf.memory();
    document.getElementById('status').innerText = '';
    log.div('log', true, `Loaded model ${name}: ${(memory1.numBytes - memory0.numBytes).toLocaleString()} bytes ${(memory1.numTensors - memory0.numTensors).toLocaleString()} tensors`);
  }
  if (!objects.models[name]) {
    log.div('log', true, `Model ${name} not loaded`);
    return null;
  }
  if (!objects.canvases[name]) draw.appendCanvas(name, input.width, input.height, objects);
  canvas = objects.canvases[name];
  ctx = canvas.getContext('2d');

  const res = await modelDetect.detect(objects.models[name], input);
  ctx.drawImage(input, 0, 0, input.width, input.height, 0, 0, canvas.width, canvas.height);
  if (res) {
    if (!objects.detected[name]) objects.detected[name] = [];
    for (const item of res) {
      objects.detected[name].push(`${(100 * item.score).toFixed(1)}% ${item.class}`);
      if (config.ui.drawBoxes && item.bbox) {
        draw.rect({
          canvas,
          x: item.bbox.x,
          y: item.bbox.y,
          width: item.bbox.width,
          height: item.bbox.height,
          lineWidth: config.ui.lineWidth,
          color: config.ui.lineColor,
          title: item.class,
        });
      }
    }
  }

  const t1 = performance.now();
  objects.perf[name] = Math.trunc(t1 - t0);
  return { name: res };
}

exports.run = run;
