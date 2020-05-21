// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable no-multi-spaces */
const config = {
  // General configuration
  backEnd: 'webgl',
  // back-end used by tensorflow for image processing, can be webgl, cpu, wasm
  maxSize: 780,
  // maximum image width or height that will be used for processing before resizing is required
  renderThumbnail: 230,
  // resolution in which to store image thumbnail embedded in result set
  listThumbnail: 130,
  // initial resolution in which to render stored thumbnail in gallery list view
  batchProcessing: 1,
  // how many images to process in parallel
  squareImage: false,
  // resize proportional to the original image or to a square image
  floatPrecision: false,
  // use float32 or float16 for WebGL tensors
  // Default models
  classify: {
    name: 'Inception v3',
    modelPath: 'models/inception-v3/model.json',
    score: 0.2,
    topK: 3
  },
  alternative: {
    name: 'MobileNet v2',
    modelPath: '/models/mobilenet-v2/model.json',
    score: 0.2,
    topK: 3
  },
  detect: {
    name: 'Coco/SSD v2',
    modelPath: 'models/cocossd-v2/model.json',
    score: 0.4,
    topK: 6,
    overlap: 0.1
  },
  person: {
    name: 'FaceAPI SSD',
    modelPath: 'models/faceapi/',
    score: 0.4,
    topK: 4,
    type: 'ssdMobilenetv1'
  }
  /*
  models that can be used for "classify" and "alternative" can be found at
    https://tfhub.dev/s?deployment-format=tfjs&module-type=image-classification&tf-version=tf2
  or just pick one from below
    classify: { name: 'MobileNet v1', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v1_100_224/classification/3/default/1' },
    classify: { name: 'MobileNet v2', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1' },
    classify: { name: 'Inception v1', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/inception_v1/classification/3/default/1' },
    classify: { name: 'Inception v2', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/inception_v2/classification/3/default/1' },
    classify: { name: 'Inception v3', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/inception_v3/classification/3/default/1' },
    classify: { name: 'Inception ResNet v2', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/inception_resnet_v2/classification/3/default/1' },
    classify: { name: 'ResNet v2', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/resnet_v2_101/classification/3/default/1' },
    classify: { name: 'NasNet Mobile', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/nasnet_mobile/classification/3/default/1' },
  */

  /*
  models that can be used for "detect" can be found at
    https://tfhub.dev/s?deployment-format=tfjs&module-type=image-object-detection
  or just pick one from below
    detect: { name: 'Coco/SSD v1', modelPath: 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v1/1/default/1', score: 0.4, topK: 6, overlap: 0.1 },
    detect: { name: 'Coco/SSD v2', modelPath: 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1', score: 0.4, topK: 6, overlap: 0.1 },
  or enable darknet/yolo model in a separate module (js module is not initialized by default)
  */

  /*
  models that can be used for "person" are
    person: { name: 'FaceAPI SSD', modelPath: 'models/faceapi/', score: 0.5, topK: 1, type: 'ssdMobilenetv1' },
    person: { name: 'FaceAPI Yolo', modelPath: 'models/faceapi/', score: 0.5, topK: 1, type: 'tinyYolov2' },
    person: { name: 'FaceAPI Tiny', modelPath: 'models/faceapi/', score: 0.5, topK: 1, type: 'tinyFaceDetector' },
    person: { name: 'FaceAPI MTCNN', modelPath: 'models/faceapi/', score: 0.5, topK: 1, type: 'mtcnn' },
  */

};
var _default = config;
exports.default = _default;
},{}],"log.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const div = {};

async function dot() {
  if (div.Log) div.Log.innerHTML += '.';
}

async function result(...msg) {
  let msgs = '';
  msgs += msg.map(a => a);
  if (div.Log) div.Log.innerHTML += `${msgs.replace(' ', '&nbsp')}<br>`;
  if (div.Log) div.Log.scrollTop = div.Log.scrollHeight;
  if (msgs.length > 0) fetch(`/api/log?msg=${msgs}`).then(res => res.text()); // eslint-disable-next-line no-console

  console.log(...msg);
}

async function active(...msg) {
  if (div && div.Active) div.Active.innerHTML = `${msg}<br>`; // eslint-disable-next-line no-console
  else console.log(...msg);
}

function init() {
  div.Log = document.getElementById('log');
  div.Active = document.getElementById('active');
}

const log = {
  result,
  active,
  init,
  dot
};
var _default = log;
exports.default = _default;
},{}],"gallery.js":[function(require,module,exports) {
"use strict";

var _config = _interopRequireDefault(require("./config.js"));

var _log = _interopRequireDefault(require("./log.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global moment */
let results = [];
let filtered = [];
const detailsConfig = {
  showDetails: true,
  showBoxes: true,
  showFaces: true,
  rawView: false
};
const listConfig = {
  showDetails: true,
  divider: ''
}; // draw boxes for detected objects, faces and face elements

function drawBoxes(img, object) {
  const canvas = document.getElementById('popup-canvas');
  canvas.style.position = 'absolute';
  canvas.style.left = img.offsetLeft;
  canvas.style.top = img.offsetTop;
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.linewidth = 2;
  ctx.font = '16px Roboto';
  const resizeX = img.width / object.processedSize.width;
  const resizeY = img.height / object.processedSize.height; // draw detected objects

  if (detailsConfig.showBoxes && object.detect) {
    ctx.strokeStyle = 'lightyellow';
    ctx.fillStyle = 'lightyellow';

    for (const obj of object.detect) {
      const x = obj.box[0] * resizeX;
      const y = obj.box[1] * resizeY;
      ctx.beginPath();
      ctx.rect(x, y, obj.box[2] * resizeX, obj.box[3] * resizeY);
      ctx.stroke();
      ctx.fillText(`${(100 * obj.score).toFixed(0)}% ${obj.class}`, x + 2, y + 18);
    }
  } // draw faces


  if (detailsConfig.showFaces && object.person) {
    for (const i in object.person) {
      if (object.person[i].box) {
        // draw box around face
        const x = object.person[i].box.x * resizeX;
        const y = object.person[i].box.y * resizeY;
        ctx.strokeStyle = 'deepskyblue';
        ctx.fillStyle = 'deepskyblue';
        ctx.beginPath();
        ctx.rect(x, y, object.person[i].box.width * resizeX, object.person[i].box.height * resizeY);
        ctx.stroke();
        ctx.fillText(`face#${1 + parseInt(i, 10)}`, x + 2, y + 18); // draw face points

        ctx.fillStyle = 'lightblue';
        const pointSize = 2;

        for (const pt of object.person[i].points) {
          ctx.beginPath();
          ctx.arc(pt.x * resizeX, pt.y * resizeY, pointSize, 0, 2 * Math.PI);
          ctx.fill();
        }
        /*
        const jaw = person.boxes.landmarks.getJawOutline() || [];
        const nose = person.boxes.landmarks.getNose() || [];
        const mouth = person.boxes.landmarks.getMouth() || [];
        const leftEye = person.boxes.landmarks.getLeftEye() || [];
        const rightEye = person.boxes.landmarks.getRightEye() || [];
        const leftEyeBrow = person.boxes.landmarks.getLeftEyeBrow() || [];
        const rightEyeBrow = person.boxes.landmarks.getRightEyeBrow() || [];
        faceDetails = `Points jaw:${jaw.length} mouth:${mouth.length} nose:${nose.length} left-eye:${leftEye.length} right-eye:${rightEye.length} left-eyebrow:${leftEyeBrow.length} right-eyebrow:${rightEyeBrow.length}`;
        */

      }
    }
  }
}

function JSONtoStr(json) {
  if (json) return JSON.stringify(json).replace(/{|}|"|\[|\]/g, '').replace(/,/g, ', ');
} // show details popup


async function showDetails() {
  const img = document.getElementById('popup-image');

  if (detailsConfig.rawView) {
    window.open(img.img, '_blank');
    return;
  }

  $('#popup').toggle(true);
  const object = filtered.find(a => a.image === img.img);
  if (!object) return;
  let classified = 'Classified ';
  if (object.classify) for (const obj of object.classify) classified += ` | ${(100 * obj.score).toFixed(0)}% ${obj.class}`;
  let alternative = 'Alternate ';
  if (object.alternative) for (const obj of object.alternative) alternative += ` | ${(100 * obj.score).toFixed(0)}% ${obj.class}`;
  let detected = 'Detected ';
  if (object.detect) for (const obj of object.detect) detected += ` | ${(100 * obj.score).toFixed(0)}% ${obj.class}`;
  let person = '';
  let nsfw = '';

  for (const i in object.person) {
    if (object.person[i].age) {
      person += `Person ${1 + parseInt(i, 10)} | 
          Gender: ${(100 * object.person[i].scoreGender).toFixed(0)}% ${object.person[i].gender} | 
          Age: ${object.person[i].age.toFixed(1)} | 
          Emotion: ${(100 * object.person[i].scoreEmotion).toFixed(0)}% ${object.person[i].emotion}<br>`;
    }

    if (object.person[i].class) {
      nsfw += `Class: ${(100 * object.person[i].scoreClass).toFixed(0)}% ${object.person[i].class} `;
    }

    if (object.person.length === 1) person = person.replace('Person 1', 'Person');
  }

  let desc = '<h2>Lexicon:</h2><ul>';

  if (object.descriptions) {
    for (const description of object.descriptions) {
      for (const lines of description) {
        desc += `<li><b>${lines.name}</b>: <i>${lines.desc}</i></li>`;
      }

      desc += '<br>';
    }
  }

  desc += '</ul>';
  let exif = '';

  if (object.exif) {
    const mp = (img.naturalWidth * img.naturalHeight / 1000000).toFixed(1);
    const complexity = img.naturalWidth * img.naturalHeight / object.exif.bytes;
    if (object.exif.make) exif += `Camera: ${object.exif.make} ${object.exif.model || ''} ${object.exif.lens || ''}<br>`;
    if (object.exif.bytes) exif += `Size: ${mp} MP in ${object.exif.bytes.toLocaleString()} bytes with compression factor ${complexity.toFixed(2)}<br>`;
    if (object.exif.created) exif += `Taken: ${moment(1000 * object.exif.created).format('dddd YYYY/MM/DD')} Edited: ${moment(1000 * object.exif.modified).format('dddd YYYY/MM/DD')}<br>`;
    if (object.exif.software) exif += `Software: ${object.exif.software}<br>`;
    if (object.exif.exposure) exif += `Settings: ${object.exif.fov || 0}mm ISO${object.exif.iso || 0} f/${object.exif.apperture || 0} 1/${(1 / (object.exif.exposure || 1)).toFixed(0)}sec<br>`;
  }

  let location = '';
  if (object.location && object.location.city) location += `Location: ${object.location.city}, ${object.location.state} ${object.location.country}, ${object.location.continent} (near ${object.location.near})<br>`;
  if (object.exif && object.exif.lat) location += `Coordinates: Lat ${object.exif.lat.toFixed(3)} Lon ${object.exif.lon.toFixed(3)}<br>`;
  const link = `<a class="download fa fa-arrow-alt-circle-down" style="font-size: 32px" href="${object.image}" download></a>`;
  const html = `
      <h2>Image: ${object.image}</h2>${link}
      Image size: ${img.naturalWidth} x ${img.naturalHeight}
        Total time ${object.perf.total.toFixed(0)} ms<br>
        Processed on ${moment(object.processed).format('dddd YYYY/MM/DD')} in ${object.perf.load.toFixed(0)} ms<br>
        Classified using ${_config.default.classify ? _config.default.classify.name : 'N/A'} in ${object.perf.classify.toFixed(0)} ms<br>
        Alternative using ${_config.default.alternative ? _config.default.alternative.name : 'N/A'}<br>
        Detected using ${_config.default.detect ? _config.default.detect.name : 'N/A'} in ${object.perf.detect.toFixed(0)} ms<br>
        Person using ${_config.default.person ? _config.default.person.name : 'N/A'} in ${object.perf.person.toFixed(0)} ms<br>
      <h2>Image Data</h2>
      ${exif}
      <h2>Location</h2>
      ${location}
      <h2>${classified}</h2>
      <h2>${alternative}</h2>
      <h2>${detected}</h2>
      <h2>${person} ${nsfw}</h2>
      ${desc}
      <h2>Tags</h2>
      <i>${JSONtoStr(object.tags)}</i>
      </div>
    `;

  if (detailsConfig.showDetails) {
    $('#popup-details').toggle(true);
    $('#popup-image').css('max-width', '80vw');
    $('#popup-details').width(window.innerWidth - $('#popup-image').width());
    $('#popup-details').html(html);
  } else {
    $('#popup-details').toggle(false);
    $('#popup-image').css('max-width', '100vw');
  }

  drawBoxes(img, object);
}

async function showNextDetails(left) {
  if ($('#popup').css('display') === 'none') return;
  const img = document.getElementById('popup-image');
  const id = filtered.findIndex(a => a.image === img.img);
  if (id === -1) return;

  if (left === true && id > 0 && filtered[id - 1]) {
    img.img = filtered[id - 1].image;
    img.src = filtered[id - 1].image;
  } else if (left === false && id <= filtered.length && filtered[id + 1]) {
    img.img = filtered[id + 1].image;
    img.src = filtered[id + 1].image;
  }
} // adds dividiers based on sort order


let previous;

function addDividers(object) {
  if (listConfig.divider === 'month') {
    const curr = moment(1000 * object.exif.timestamp).format('MMMM, YYYY');
    const prev = moment(previous ? 1000 * previous.exif.timestamp : 0).format('MMMM, YYYY');
    if (curr !== prev) $('#results').append(`<div class="row divider">${curr}</div>`);
  }

  if (listConfig.divider === 'size') {
    const curr = Math.round(object.pixels / 1000 / 1000);
    const prev = Math.round((previous ? previous.pixels : 1) / 1000 / 1000);
    if (curr !== prev) $('#results').append(`<div class="row divider">Size: ${curr} MP</div>`);
  }

  if (listConfig.divider === 'folder') {
    const curr = object.image.substr(0, object.image.lastIndexOf('/'));
    const prev = previous ? previous.image.substr(0, previous.image.lastIndexOf('/')) : 'none';
    if (curr !== prev) $('#results').append(`<div class="row divider">${curr}</div>`);
  }
} // print results strip with thumbnail for a given object


async function printResult(object) {
  addDividers(object);
  previous = object;
  let classified = '';
  let all = [...(object.classify || []), ...(object.alternative || [])];

  if (all.length > 0) {
    classified = 'Classified';
    all = all.sort((a, b) => b.score - a.score).map(a => a.class);
    all = [...new Set(all)];

    for (const item of all) {
      classified += ` | ${item}`;
    }
  }

  let person = '';
  let nsfw = '';
  if (object.person && object.person[0]) person = 'People';

  for (const i in object.person) {
    person += ` | ${object.person[i].gender} ${object.person[i].age.toFixed(0)}`;

    if (object.person[i].class) {
      nsfw += `Class: ${object.person[i].class} `;
    }
  }

  let detected = '';
  let personCount = 0;

  if (object.detect && object.detect[0]) {
    detected = 'Detected';

    for (const obj of object.detect) {
      if (obj.class !== 'person') detected += ` | ${obj.class}`;else personCount++;
    }

    personCount = Math.max(personCount, object.person ? object.person.length : 0);
    if (personCount === 1) detected += ' | person';else if (personCount > 1) detected += ` | ${personCount} persons`;
  }

  let location = '';

  if (object.location && object.location.city) {
    location = 'Location';
    location += ` | ${object.location.city}, ${object.location.state} ${object.location.country} (near ${object.location.near})`;
  }

  const timestamp = moment(1000 * object.exif.timestamp).format('dddd YYYY/MM/DD');
  const link = `<a class="download fa fa-arrow-alt-circle-down" href="${object.image}" download></a>`;
  const divItem = document.createElement('div');
  divItem.className = 'listitem';
  const root = window.user && window.user.root ? window.user.root : 'media/';
  divItem.innerHTML = `
    <div class="col thumbnail">
      <img class="thumbnail" id="thumb-${object.id}" src="${object.thumbnail}" align="middle" width=${_config.default.listThumbnail}px height=${_config.default.listThumbnail}px>
    </div>
    <div id="desc-${object.id}" class="col description">
      <b>${decodeURI(object.image).replace(root, '')}</b>${link}<br>
      ${timestamp} | Size ${object.naturalSize.width} x ${object.naturalSize.height}<br>
      ${location}<br>
      ${classified}<br>
      ${detected}<br>
      ${person} ${nsfw}<br>
    </div>
  `;
  $('#results').append(divItem);
  const divThumb = document.getElementById(`thumb-${object.id}`);
  divThumb.img = object.image;
  const img = document.getElementById('popup-image');
  img.addEventListener('load', showDetails);
  divThumb.addEventListener('click', evt => {
    img.img = evt.target.img;
    img.src = object.image; // this triggers showDetails via onLoad event(
  });
}

function resizeResults() {
  const thumbSize = parseInt($('#thumbsize')[0].value, 10);

  if (thumbSize !== _config.default.listThumbnail) {
    _config.default.listThumbnail = parseInt($('#thumbsize')[0].value, 10);
    $('#thumblabel').text(`Size: ${_config.default.listThumbnail}px`);
    $('#thumbsize')[0].value = _config.default.listThumbnail;
    $('.thumbnail').width(_config.default.listThumbnail);
    $('.thumbnail').height(_config.default.listThumbnail); // $('.thumbnail').css('min-width', `${config.listThumbnail}px`);
    // $('.thumbnail').css('min-height', `${config.listThumbnail}px`);
    // $('.thumbnail').css('max-width', `${config.listThumbnail}px`);
    // $('.thumbnail').css('max-height', `${config.listThumbnail}px`);

    $('.listitem').css('min-height', `${Math.max(144, 16 + _config.default.listThumbnail)}px`);
    $('.listitem').css('max-height', '144px');
  }
}

async function enumerateFolders() {
  $('#folders').html('');
  const list = [];

  for (const item of filtered) {
    const path = item.image.substr(0, item.image.lastIndexOf('/'));
    const folders = path.split('/').filter(a => a !== '');
    if (!list.find(a => a.path === path)) list.push({
      path,
      folders
    });
  }

  for (let i = 0; i < 10; i++) {
    for (const item of list) {
      if (item.folders[i]) {
        const folder = item.folders[i];
        const parent = item.folders[i > 0 ? i - 1 : 0];
        let path = '';

        for (let j = 0; j <= i; j++) path += `${item.folders[j]}/`;

        const root = window.user && window.user.root ? window.user.root : 'media/';
        const name = folder === root.replace(/\//g, '') ? 'All' : folder;
        const html = `
          <li id="dir-${folder}">
            <span tag="${path}" style="padding-left: ${i * 16}px" class="folder">&nbsp
              <i tag="${path}" class="fas fa-caret-right">&nbsp</i>${name}
            </span>
          </li>
        `;
        let parentElem = $(`#dir-${parent}`);
        if (parentElem.length === 0) parentElem = $('#folders');
        const currentElem = $(`#dir-${folder}`);
        if (currentElem.length === 0) parentElem.append(html);
      }
    }
  } // $('#folders').html(html);


  $('.folder').click(evt => {
    $('body').css('cursor', 'wait');
    const path = $(evt.target).attr('tag');

    _log.default.result(`Showing path: ${path}`);

    const root = window.user && window.user.root ? window.user.root : 'media/';
    if (path === root) filtered = results;else filtered = results.filter(a => a.image.startsWith(path)); // eslint-disable-next-line no-use-before-define

    redrawResults(false);
  });
}

async function redrawResults(generateFolders = true) {
  $('#number').html(filtered.length);
  $('#results').html('');
  if (generateFolders) enumerateFolders();

  for await (const obj of filtered) printResult(obj);

  $('.description').toggle(listConfig.showDetails);
  await resizeResults();
  $('body').css('cursor', 'pointer');
}

function filterWord(object, word) {
  if (!object) return null;
  const skip = ['in', 'a', 'the', 'of', 'with', 'using', 'wearing', 'and', 'at', 'during'];
  if (skip.includes(word)) return object;
  const res = object.filter(obj => {
    let ok = false;

    for (const tag of obj.tags) {
      const str = Object.values(tag) && Object.values(tag)[0] ? Object.values(tag)[0].toString() : '';
      ok |= str.startsWith(word.toLowerCase());
    }

    return ok;
  });
  return res;
}

function filterResults(words) {
  $('body').css('cursor', 'wait');
  filtered = results;
  previous = null;
  let foundWords = 0;

  for (const word of words.split(' ')) {
    filtered = filterWord(filtered, word);
    foundWords += filtered && filtered.length > 0 ? 1 : 0;
  }

  if (filtered && filtered.length > 0) _log.default.result(`Searching for "${words}" found ${foundWords} words in ${filtered.length || 0} results out of ${results.length} matches`);else _log.default.result(`Searching for "${words}" found ${foundWords} of ${words.split(' ').length} terms`);
  redrawResults();
} // Fisher-Yates (aka Knuth) Shuffle


function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex]; // eslint-disable-next-line no-param-reassign

    array[currentIndex] = array[randomIndex]; // eslint-disable-next-line no-param-reassign

    array[randomIndex] = temporaryValue;
  }

  return array;
}

function findDuplicates() {
  $('body').css('cursor', 'wait');
  previous = null;
  filtered = [];

  for (const obj of results) {
    const items = results.filter(a => a.hash === obj.hash);
    if (items.length !== 1) filtered.push(...items);
  }

  filtered = [...new Set(filtered)];

  _log.default.result(`Duplicates: ${filtered.length}`);

  redrawResults();
}

function sortResults(sort) {
  $('body').css('cursor', 'wait');

  _log.default.result(`Sorting: ${sort}`);

  if (!filtered || filtered.length === 0) filtered = results;
  if (sort.includes('random')) shuffle(filtered);
  previous = null; // sort by

  if (sort.includes('alpha-down')) filtered.sort((a, b) => a.image > b.image ? 1 : -1);
  if (sort.includes('alpha-up')) filtered.sort((a, b) => a.image < b.image ? 1 : -1);
  if (sort.includes('numeric-down')) filtered.sort((a, b) => b.exif.timestamp - a.exif.timestamp);
  if (sort.includes('numeric-up')) filtered.sort((a, b) => a.exif.timestamp - b.exif.timestamp);
  if (sort.includes('amount-down')) filtered.sort((a, b) => b.pixels - a.pixels);
  if (sort.includes('amount-up')) filtered.sort((a, b) => a.pixels - b.pixels); // how to group

  if (sort.includes('numeric-down') || sort.includes('numeric-up')) listConfig.divider = 'month';else if (sort.includes('amount-down') || sort.includes('amount-up')) listConfig.divider = 'size';else if (sort.includes('alpha-down') || sort.includes('alpha-up')) listConfig.divider = 'folder';else listConfig.divider = '';
  redrawResults();
} // calls main detectxion and then print results for all images matching spec


async function loadGallery() {
  $('body').css('cursor', 'wait');
  const t0 = window.performance.now();

  _log.default.result('Loading gallery ...');

  const res = await fetch('/api/get?find=all');
  results = await res.json();
  const t1 = window.performance.now();
  const size = JSON.stringify(results).length;

  _log.default.result(`Received ${results.length} images in ${size.toLocaleString()} bytes (${Math.round(size / (t1 - t0)).toLocaleString()} KB/sec)`);

  for (const id in results) results[id].id = id;

  listConfig.divider = 'month';
  filtered = results.sort((a, b) => b.exif.timestamp - a.exif.timestamp);
  redrawResults();
}

async function initUser() {
  const res = await fetch('/api/user');
  if (res.ok) window.user = await res.json();

  if (window.user) {
    $('#btn-user').toggleClass('fa-user-slash fa-user');
    $('#user').text(window.user.user);

    _log.default.result(`Logged in: ${window.user.user} root:${window.user.root} admin:${window.user.admin}`);
  }
} // pre-fetching DOM elements to avoid multiple runtime lookups


function initHandlers() {
  // hide those elements initially
  $('#popup').toggle(false);
  $('#searchbar').toggle(false);
  $('#optionslist').toggle(false);
  $('#optionsview').toggle(false);
  if (!window.user.admin) $('#btn-update').css('color', 'grey'); // navbar

  $('#btn-user').click(() => {
    $.post('/client/auth.html');
    if ($('#btn-user').hasClass('fa-user-slash')) window.location = '/client/auth.html';
    $('#btn-user').toggleClass('fa-user-slash fa-user');
  });
  $('#btn-search').click(() => {
    $('#optionslist').toggle(false);
    $('#optionsview').toggle(false);
    $('#searchbar').toggle('fast');
    $('#btn-search').toggleClass('fa-search fa-search-location');
    $('#search-input').focus();
  });
  $('#btn-list').click(() => {
    $('#searchbar').toggle(false);
    $('#optionsview').toggle(false);
    $('#optionslist').toggle('fast');
  });
  $('#btn-view').click(() => {
    $('#searchbar').toggle(false);
    $('#optionslist').toggle(false);
    $('#optionsview').toggle('fast');
  });
  $('#btn-doc').click(() => {
    window.open('https://github.com/vladmandic/photo-analysis/blob/master/README.md', '_blank');
  }); // starts image processing in a separate window

  $('#btn-update').click(() => {
    if (window.user.admin) {
      _log.default.result('Image database update requested ...');

      $('#searchbar').toggle(false);
      $('#optionslist').toggle(false);
      $('#optionsview').toggle(false);
      window.open('/process', '_blank');
    } else {
      _log.default.result('Image database update not authorized');
    }
  }); // starts live video detection in a separate window

  $('#btn-video').click(() => {
    window.open('/video', '_blank');
  }); // navline-search

  $('#search-input').keyup(() => {
    event.preventDefault();
    if (event.keyCode === 191) $('#search-input')[0].value = ''; // reset on key=/

    if (event.keyCode === 13) filterResults($('#search-input')[0].value);
  });
  $('#btn-searchnow').click(() => {
    filterResults($('#search-input')[0].value);
  });
  $('#btn-resetsearch').click(() => {
    $('#search-input')[0].value = '';
    filterResults('');
  }); // navline-list

  $('#btn-folder').click(() => {
    $('#folders').toggle('slow');
    $('#btn-folder').toggleClass('fa-folder fa-folder-open');
  });
  $('#btn-desc').click(() => {
    listConfig.showDetails = !listConfig.showDetails;
    $('.description').toggle('slow');
    $('#btn-desc').toggleClass('fa-eye fa-eye-slash');
  });
  $('#find-duplicates').click(() => {
    findDuplicates();
  });
  $('.sort').click(evt => {
    sortResults(evt.target.className);
  });
  $('#thumbsize').on('input', () => {
    resizeResults();
  }); // navline-view

  $('#details-desc').click(() => {
    $('#details-desc').toggleClass('fa-comment fa-comment-slash');
    detailsConfig.showDetails = !detailsConfig.showDetails;
  });
  $('#details-boxes').click(() => {
    $('#details-boxes').toggleClass('fa-store fa-store-slash');
    detailsConfig.showBoxes = !detailsConfig.showBoxes;
  });
  $('#details-faces').click(() => {
    $('#details-faces').toggleClass('fa-head-side-cough fa-head-side-cough-slash');
    detailsConfig.showFaces = !detailsConfig.showFaces;
  });
  $('#details-raw').click(() => {
    $('#details-raw').toggleClass('fa-video fa-video-slash');
    detailsConfig.rawView = !detailsConfig.rawView;
  }); // handle clicks inside popup

  $('#popup').click(() => {
    if (event.screenX < 50) showNextDetails(true);else if (event.screenX > window.innerWidth - 50) showNextDetails(false);else $('#popup').toggle('fast');
  }); // handle keypresses on main

  $('html').keydown(() => {
    const current = $('#results').scrollTop();
    const line = _config.default.listThumbnail + 16;

    const page = $('#results').height() - _config.default.listThumbnail;

    const bottom = $('#results').prop('scrollHeight');
    $('#results').stop();

    switch (event.keyCode) {
      case 38:
        $('#results').animate({
          scrollTop: current - line
        }, 400);
        break;
      // key=up: scroll line up

      case 40:
        $('#results').animate({
          scrollTop: current + line
        }, 400);
        break;
      // key=down; scroll line down

      case 33:
        $('#results').animate({
          scrollTop: current - page
        }, 400);
        break;
      // key=pgup; scroll page up

      case 34:
        $('#results').animate({
          scrollTop: current + page
        }, 400);
        break;
      // key=pgdn; scroll page down

      case 36:
        $('#results').animate({
          scrollTop: 0
        }, 1000);
        break;
      // key=home; scroll to top

      case 35:
        $('#results').animate({
          scrollTop: bottom
        }, 1000);
        break;
      // key=end; scroll to bottom

      case 37:
        showNextDetails(true);
        break;
      // key=left; previous image in details view

      case 39:
        showNextDetails(false);
        break;
      // key=right; next image in details view

      case 191:
        $('#btn-search').click();
        break;
      // key=/; open search input

      case 190:
        $('#btn-sort').click();
        break;
      // key=.; open sort options

      case 188:
        $('#btn-desc').click();
        break;
      // key=,; show/hide list descriptions

      case 220:
        loadGallery();
        break;
      // key=\; refresh all

      case 27:
        $('#popup').toggle(false);
        $('#searchbar').toggle(false);
        $('#optionslist').toggle(false);
        $('#optionsview').toggle(false);
        $('#popup').toggle(false);
        filterResults('');
        break;
      // key=esc; clear all filters

      default: // log.result('Unhandled keydown event', event.keyCode);

    }
  });
}

async function main() {
  _log.default.init();

  await initUser();
  initHandlers();
  await loadGallery();
}

window.onload = main;
},{"./config.js":"config.js","./log.js":"log.js"}]},{},["gallery.js"], null)
//# sourceMappingURL=/gallery.js.map