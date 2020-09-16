import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import KerasJS from '../assets/keras.min.js';

const jquery = require('jquery');
const tf = require('@tensorflow/tfjs/dist/tf.es2017.js');
const faceapi = require('@vladmandic/face-api');
const log = require('./log.js');
const config = require('./config.js').default;
const modelClassify = require('./modelClassify.js');
const modelDetect = require('./modelDetect.js');
const modelYolo = require('./modelYolo.js');
const processImage = require('./processImage.js');
const definitions = require('./models.js');

window.$ = jquery;
const models = [];
window.cache = [];
let stop = false;

async function init() {
  const res = await fetch('/api/user');
  if (res.ok) window.user = await res.json();
  if (window.user && window.user.user) {
    $('#btn-user').toggleClass('fa-user-slash fa-user');
    $('#user').text(window.user.user.split('@')[0]);
    log.div('log', true, `Logged in: ${window.user.user} root:${window.user.root} admin:${window.user.admin}`);
    if (!window.user.admin) $('#btn-update').css('color', 'gray');
  } else {
    window.location = '/client/auth.html';
  }
  log.div('log', true, `TensorFlow/JS Version: ${tf.version_core}`);
  await tf.setBackend(config.backEnd);
  await tf.enableProdMode();
  tf.ENV.set('DEBUG', false);
  window.tf = tf;
  window.faceapi = faceapi;

  // tf.ENV.set('WEBGL_BUFFER_SUPPORTED', false);
  // tf.ENV.set('WEBGL_CONV_IM2COL', false);
  // tf.ENV.set('WEBGL_CPU_FORWARD', false);
  // tf.ENV.set('WEBGL_FENCE_API_ENABLED', false);
  // tf.ENV.set('WEBGL_FORCE_F16_TEXTURES', false);
  // tf.ENV.set('WEBGL_LAZILY_UNPACK', false);
  // tf.ENV.set('WEBGL_PACK', false);
  // tf.ENV.set('WEBGL_PACK_ARRAY_OPERATIONS', false);
  // tf.ENV.set('WEBGL_PACK_BINARY_OPERATIONS', false);
  // tf.ENV.set('WEBGL_PACK_CLIP', false);
  // tf.ENV.set('WEBGL_PACK_DEPTHWISECONV', false);
  // tf.ENV.set('WEBGL_PACK_IMAGE_OPERATIONS', false);
  // tf.ENV.set('WEBGL_PACK_UNARY_OPERATIONS', false);

  if (!config.floatPrecision) tf.ENV.set('WEBGL_FORCE_F16_TEXTURES', true);
  const f = `float Precision: ${config.floatPrecision ? '32bit' : '16bit'}`;
  log.div('log', true, `Configuration: backend: ${tf.getBackend().toUpperCase()} parallel processing: ${config.batchProcessing} image resize: ${config.maxSize}px shape: ${config.squareImage ? 'square' : 'native'} ${f}`);
}

async function loadClassify(options) {
  let engine;
  const stats = {};
  engine = await tf.engine();
  stats.time0 = window.performance.now();
  stats.bytes0 = engine.state.numBytes;
  stats.tensors0 = engine.state.numTensors;

  const model = await modelClassify.load(options);
  engine = await tf.engine();
  stats.time1 = window.performance.now();
  stats.bytes1 = engine.state.numBytes;
  stats.tensors1 = engine.state.numTensors;

  stats.size = Math.round((stats.bytes1 - stats.bytes0) / 1024 / 1024);
  stats.tensors = Math.round(stats.tensors1 - stats.tensors0);
  stats.time = Math.round(stats.time1 - stats.time0);
  models.push({ name: options.name, stats, model });
  log.div('log', true, `Loaded model: ${options.name}  in ${stats.time.toLocaleString()} ms ${stats.size.toLocaleString()} MB ${stats.tensors.toLocaleString()} tensors`);
}

async function loadDetect(options) {
  let engine;
  const stats = {};
  stats.time0 = window.performance.now();
  engine = await tf.engine();
  stats.bytes0 = engine.state.numBytes;
  stats.tensors0 = engine.state.numTensors;

  const model = await modelDetect.load(options);
  engine = await tf.engine();
  stats.time1 = window.performance.now();
  stats.bytes1 = engine.state.numBytes;
  stats.tensors1 = engine.state.numTensors;

  stats.size = Math.round((stats.bytes1 - stats.bytes0) / 1024 / 1024);
  stats.tensors = Math.round(stats.tensors1 - stats.tensors0);
  stats.time = Math.round(stats.time1 - stats.time0);
  models.push({ name: options.name, stats, model });
  log.div('log', true, `Loaded model: ${options.name}  in ${stats.time.toLocaleString()} ms ${stats.size.toLocaleString()} MB ${stats.tensors.toLocaleString()} tensors`);
}

async function print(file, image, results) {
  window.cache.push({ file, results });
  let text = '';
  for (const model of results) {
    let classified = model.model.name || model.model;
    if (model.data) {
      for (const res of model.data) {
        if (res.score && res.class) classified += ` | ${Math.round(res.score * 100)}% ${res.class} [id:${res.id}]`;
        if (res.age && res.gender) classified += ` | gender: ${Math.round(100 * res.genderProbability)}% ${res.gender} age: ${res.age.toFixed(1)}`;
        if (res.expression) {
          const emotion = Object.entries(res.expressions).reduce(([keyPrev, valPrev], [keyCur, valCur]) => (valPrev > valCur ? [keyPrev, valPrev] : [keyCur, valCur]));
          classified += ` emotion: ${emotion[1]}% ${emotion[0]}`;
        }
      }
    }
    text += `${classified}<br>`;
  }
  const item = document.createElement('div');
  item.className = 'listitem';
  item.style = `min-height: ${16 + window.options.listThumbSize}px; max-height: ${16 + window.options.listThumbSize}px; contain-intrinsic-size: ${16 + window.options.listThumbSize}px`;
  item.innerHTML = `
    <div class="col thumbnail">
      <img class="thumbnail" src="${image.thumbnail}" align="middle" tag="${file}">
    </div>
    <div class="col description">
      <p class="listtitle">${file}</p>
      ${text}
    </div>
  `;
  $('#results').append(item);
}

async function classify() {
  stop = false;
  log.server('Compare: Classify');
  log.div('log', true, 'Loading models ...');
  for (const def of definitions.models.classify) await loadClassify(def);

  log.div('log', true, 'Warming up ...');
  const warmup = await processImage.getImage('assets/warmup.jpg');
  await modelClassify.classify(models[0].model, warmup.canvas);
  log.div('log', true, 'TensorFlow Memory:', tf.memory());
  log.div('log', true, 'TensorFlow Flags:');
  log.div('log', true, tf.ENV.flags);

  const api = await fetch('/api/dir?folder=Tests/Objects/');
  // const api = await fetch('/api/dir?folder=Tests/NSFW/');
  const files = await api.json();
  log.div('log', true, `Received list from server: ${files.length} images`);

  const stats = [];
  // eslint-disable-next-line no-unused-vars
  for (const m in models) stats.push(0);
  for (const file of files) {
    if (stop) break;
    const results = [];
    const image = await processImage.getImage(file);
    for (const m in models) {
      const t0 = window.performance.now();
      const data = await modelClassify.classify(models[m].model, image.canvas);
      const t1 = window.performance.now();
      stats[m] += (t1 - t0);
      results.push({ model: models[m], data });
      log.debug('Classify', file, models[m], data);
    }
    print(file, image, results);
  }
  // eslint-disable-next-line no-console
  console.table('Finished', tf.memory());
  for (const m in models) {
    log.div('log', true, `${models[m].name}: ${Math.round(stats[m]).toLocaleString()} ms / ${Math.round(stats[m] / files.length)} avg`);
  }
}

// eslint-disable-next-line no-unused-vars
async function yolo() {
  stop = false;
  log.div('log', true, 'Loading models ...');
  const yolov1tiny = await modelYolo.v1tiny();
  const yolov2tiny = await modelYolo.v2tiny();
  const yolov3tiny = await modelYolo.v3tiny();
  const yolov3full = await modelYolo.v3();
  log.div('log', true, 'TensorFlow Memory:', tf.memory());
  log.div('log', true, 'TensorFlow Flags:');
  log.div('log', true, tf.ENV.flags);

  const api = await fetch('/api/dir?folder=Tests/Objects/');
  const files = await api.json();
  log.div('log', true, `Received list from server: ${files.length} images`);

  const stats = [];
  // eslint-disable-next-line no-unused-vars
  for (const m in models) stats.push(0);
  let data;
  for (const file of files) {
    if (stop) break;
    const results = [];
    const image = await processImage.getImage(file);
    data = await yolov1tiny.predict(image.canvas);
    results.push({ model: 'CoCo DarkNet/Yolo v1 Tiny', data });
    data = await yolov2tiny.predict(image.canvas);
    results.push({ model: 'CoCo DarkNet/Yolo v2 Tiny', data });
    data = await yolov3tiny.predict(image.canvas);
    results.push({ model: 'CoCo DarkNet/Yolo v3 Tiny', data });
    data = await yolov3full.predict(image.canvas);
    results.push({ model: 'CoCo DarkNet/Yolo v1 Full', data });
    print(file, image, results);
  }
  log.div('log', true, '');
}

// eslint-disable-next-line no-unused-vars
async function person() {
  stop = false;
  log.div('log', true, `FaceAPI version: ${faceapi.tf.version_core} backend ${faceapi.tf.getBackend()}`);
  log.div('log', true, 'Loading models ...');

  let engine;
  let stats = {};
  stats.time0 = window.performance.now();
  engine = await tf.engine();
  stats.bytes0 = engine.state.numBytes;
  stats.tensors0 = engine.state.numTensors;

  const options = definitions.models.person[0];
  if (options.exec === 'yolo') await faceapi.nets.tinyFaceDetector.load(options.modelPath);
  if (options.exec === 'ssd') await faceapi.nets.ssdMobilenetv1.load(options.modelPath);
  await faceapi.nets.ageGenderNet.load(options.modelPath);
  await faceapi.nets.faceLandmark68Net.load(options.modelPath);
  await faceapi.nets.faceRecognitionNet.load(options.modelPath);
  await faceapi.nets.faceExpressionNet.load(options.modelPath);
  if (options.exec === 'yolo') faceapi.options = new faceapi.TinyFaceDetectorOptions({ scoreThreshold: options.score, inputSize: options.tensorSize });
  if (options.exec === 'ssd') faceapi.options = new faceapi.SsdMobilenetv1Options({ minConfidence: options.score, maxResults: options.topK });

  log.div('log', true, 'Warming up ...');
  const warmup = await processImage.getImage('assets/warmup.jpg');
  await faceapi.detectAllFaces(warmup.canvas, options.face);
  log.div('log', true, 'TensorFlow Memory:', faceapi.tf.memory());
  log.div('log', true, 'TensorFlow Flags:');
  log.div('log', true, faceapi.tf.ENV.flags);

  engine = await tf.engine();
  stats.time1 = window.performance.now();
  stats.bytes1 = engine.state.numBytes;
  stats.tensors1 = engine.state.numTensors;

  stats.size = Math.round((stats.bytes1 - stats.bytes0) / 1024 / 1024);
  stats.tensors = Math.round(stats.tensors1 - stats.tensors0);
  stats.time = Math.round(stats.time1 - stats.time0);
  log.div('log', true, `Loaded model: FaceAPI in ${stats.time.toLocaleString()} ms ${stats.size.toLocaleString()} MB ${stats.tensors.toLocaleString()} tensors`);

  const api = await fetch('/api/dir?folder=Tests/Persons/');
  const files = await api.json();
  log.div('log', true, `Received list from server: ${files.length} images`);

  stats = 0;
  for (const file of files) {
    if (stop) break;
    const results = [];
    const image = await processImage.getImage(file);
    const t0 = window.performance.now();
    const data = await faceapi
      .detectAllFaces(image.canvas, options.face)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
      .withAgeAndGender();
    const t1 = window.performance.now();
    stats += t1 - t0;
    log.debug('Person', file, options, data);
    results.push({ model: options, data });
    print(file, image, results);
  }
  log.div('log', true, `${options.name}: ${Math.round(stats).toLocaleString()} ms / ${Math.round(stats / files.length)} avg`);
}

// eslint-disable-next-line no-unused-vars
async function detect() {
  stop = false;
  log.server('Compare: Detect');
  log.div('log', true, 'Loading models ...');
  for (const def of definitions.models.detect) await loadDetect(def);

  log.div('log', true, 'Warming up ...');
  const warmup = await processImage.getImage('assets/warmup.jpg');
  await modelDetect.exec(models[0].model, warmup.canvas);
  log.div('log', true, 'TensorFlow Memory:', tf.memory());
  log.div('log', true, 'TensorFlow Flags:');
  log.div('log', true, tf.ENV.flags);

  const api = await fetch('/api/dir?folder=Tests/Objects/');
  // const api = await fetch('/api/dir?folder=Tests/NSFW/');
  const files = await api.json();
  log.div('log', true, `Received list from server: ${files.length} images`);

  const stats = [];
  // eslint-disable-next-line no-unused-vars
  for (const m in models) stats.push(0);
  log.div('log', true, 'TensorFlow Memory:', tf.memory());
  for (const file of files) {
    if (stop) break;
    const results = [];
    const image = await processImage.getImage(file);
    for (const m in models) {
      const t0 = window.performance.now();
      const data = await modelDetect.exec(models[m].model, image.canvas);
      const t1 = window.performance.now();
      stats[m] += (t1 - t0);
      results.push({ model: models[m], data });
      log.debug('Detect', file, models[m], data);
    }
    print(file, image, results);
  }
  for (const m in models) {
    log.div('log', true, `${models[m].name}: ${Math.round(stats[m]).toLocaleString()} ms / ${Math.round(stats[m] / files.length)} avg`);
  }
}

async function keras() {
  log.server('Compare: Detect');
  const res = await fetch('/models/imagenet-efficientnet-b5/classes.json');
  const labels = await res.json();

  function preprocess(image) {
    const dataTensor = ndarray(new Float32Array(image.data), [image.width, image.height, 4]);
    const dataProcessedTensor = ndarray(new Float32Array(image.width * image.height * 3), [image.width, image.height, 3]);
    ops.subseq(dataTensor.pick(null, null, 2), 103.939);
    ops.subseq(dataTensor.pick(null, null, 1), 116.779);
    ops.subseq(dataTensor.pick(null, null, 0), 123.68);
    ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 2));
    ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1));
    ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 0));
    const preprocessedData = dataProcessedTensor.data;
    return preprocessedData;
  }

  function decode(values) {
    const pairs = [];
    for (const i in values) pairs.push({ score: values[i], index: i });
    const results = pairs
      .filter((a) => (a.score) > 0.1)
      .sort((a, b) => b.score - a.score)
      .map((a) => {
        const id = parseInt(a.index);
        const wnid = labels[id] ? labels[id][0] : a.index;
        const label = labels[id] ? labels[id][1] : `unknown id:${a.index}`;
        return { wnid, id, class: label.toLowerCase(), score: a.score };
      });
    if (results && results.length > 10) results.length = 10;
    return results;
  }

  log.div('log', true, 'Loading models ...');
  // use keras-js/python/encoder.py to convert from keras h5 to bin
  models.push({ name: 'Imagenet SqueezeNet v1.1', exec: new KerasJS.Model({ filepath: 'models/kerasjs/squeezenet_v1.1.bin', gpu: true }), size: 227, input: 'input_1', output: 'loss' });
  models.push({ name: 'Imagenet Inception v3', exec: new KerasJS.Model({ filepath: 'models/kerasjs/inception_v3.bin', gpu: true }), size: 299, input: 'input_1', output: 'predictions' });
  models.push({ name: 'Imagenet DenseNet-121', exec: new KerasJS.Model({ filepath: 'models/kerasjs/densenet121.bin', gpu: true }), size: 224, input: 'input_2', output: 'dense_2' });
  models.push({ name: 'Imagenet ResNet-50', exec: new KerasJS.Model({ filepath: 'models/kerasjs/resnet50.bin', gpu: true }), size: 224, input: 'input_1', output: 'fc1000' });

  const promises = models.map((a) => a.exec.ready());
  await Promise.all(promises);

  log.div('log', true, 'TensorFlow Memory:', tf.memory());
  log.div('log', true, 'TensorFlow Flags:');
  log.div('log', true, tf.ENV.flags);

  const api = await fetch('/api/dir?folder=Tests/Objects/');
  const files = await api.json();
  log.div('log', true, `Received list from server: ${files.length} images`);

  const stats = [];
  // eslint-disable-next-line no-unused-vars
  for (const m in models) stats.push(0);
  log.div('log', true, 'TensorFlow Memory:', tf.memory());
  for (const file of files) {
    if (stop) break;
    const results = [];
    for (const m in models) {
      const image = await processImage.getImage(file, models[m].size);
      const t0 = window.performance.now();
      const data = preprocess(image.data);
      const obj = {};
      obj[models[m].input] = new Float32Array(data);
      const values = await models[m].exec.predict(obj);
      console.log(values);
      const output = decode(values[models[m].output]);
      const t1 = window.performance.now();
      stats[m] += (t1 - t0);
      results.push({ model: models[m].name, data: output });
      log.debug('Detect', file, models[m].name, output);
    }
    const thumb = await processImage.getImage(file);
    print(file, thumb, results);
  }
  for (const m in models) {
    log.div('log', true, `${models[m].name}: ${Math.round(stats[m]).toLocaleString()} ms / ${Math.round(stats[m] / files.length)} avg`);
  }
}

async function main() {
  await init();
  $('#btn-classify').click(() => classify());
  $('#btn-keras').click(() => keras());
  $('#btn-detect').click(() => detect());
  $('#btn-person').click(() => person());
  // $('#btn-detect').click(() => yolo());
  $('#btn-stop').click(() => { stop = true; });
}

window.onload = main;
