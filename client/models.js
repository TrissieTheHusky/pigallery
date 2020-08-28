/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const models = {};
exports.models = models;

models.classify = [
  // { name: 'ImageNet MobileNet v1', modelPath: 'models/mobilenet-v1', score: 0.2, topK: 3 },
  // { name: 'ImageNet MobileNet v1', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v1_100_224/classification/3/default/1' },
  // { name: 'ImageNet MobileNet v2', modelPath: 'models/mobilenet-v2', score: 0.2, topK: 3 },
  // { name: 'ImageNet MobileNet v2', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1' },
  // { name: 'ImageNet Inception v1', modelPath: 'models/inception-v1', score: 0.2, topK: 3 },
  // { name: 'ImageNet Inception v1', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/inception_v1/classification/3/default/1' },
  // { name: 'ImageNet Inception v2', modelPath: 'models/inception-v2', score: 0.2, topK: 3 },
  // { name: 'ImageNet Inception v2', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/inception_v2/classification/3/default/1' },
  // { name: 'ImageNet Inception v3', modelPath: 'models/inception-v3', score: 0.2, topK: 3 },
  // { name: 'ImageNet Inception v3', modelPath: 'https://tfhub.dev/google/tfjs-model/imagenet/inception_v3/classification/3/default/1' },
//  { name: 'ImageNet Inception v4', modelPath: 'models/imagenet-inception-v4', score: 0.22, topK: 3, tensorSize: 299, scoreScale: 200, offset: 1 },
  // { name: 'ImageNet EfficientNet B0', modelPath: 'models/efficientnet-b0', score: 0.2, topK: 3, slice: 0, tensorSize: 224, offset: 0 },
  // { name: 'ImageNet EfficientNet B4', modelPath: 'models/efficientnet-b4', score: 0.1, topK: 3, slice: 0, tensorSize: 380, offset: 0 },
//  { name: 'ImageNet EfficientNet B5', modelPath: 'models/imagenet-efficientnet-b5', score: 0.2, topK: 3, tensorSize: 456, scoreScale: 1, offset: 0 },
  // { name: 'ImageNet EfficientNet B7', modelPath: 'models/efficientnet-b7', score: 0.2, topK: 3, slice: 0, tensorSize: 600, offset: 0 },
  // { name: 'ImageNet ResNet v2-50', modelPath: 'models/resnet-v2-50', score: 0.2, topK: 3 },
  // { name: 'ImageNet ResNet v2-101', modelPath: 'models/resnet-v2-101', score: 0.2, topK: 3 },
  // { name: 'ImageNet Inception-ResNet v2', modelPath: '/models/inception-resnet-v2', score: 0.2, topK: 3 },
  // { name: 'ImageNet NASNet-A Mobile', modelPath: 'models/nasnet-mobile', score: 0.2, topK: 3, slice: 0 },
  // { name: 'ImageNet-21k BiT-S R101x1', modelPath: 'models/bit-s-r101x1', score: 0.2, topK: 3, slice: 0, offset: 1 },
  // { name: 'ImageNet-21k BiT-M R101x1', modelPath: 'models/bit-m-r101x1', score: 0.2, topK: 3, slice: 0, offset: 1 },
//  { name: 'DeepDetect Inception v3', modelPath: 'models/deepdetect-inception-v3', score: 0.1, topK: 5, tensorSize: 299, scoreScale: 1000, offset: 0 },
  { name: 'AIY MobileNet Food', modelPath: 'models/aiy-mobilenet-food', score: 0.35, topK: 1, tensorSize: 192, scoreScale: 500, offset: 0 },
  // { name: 'iNaturalist Plants MobileNet v2', modelPath: 'models/inaturalist/plants', score: 0.2, scoreScale: 200, topK: 1, classes: 'assets/iNaturalist-Plants-Labels.json', offset: 0, background: 2101 },
  // { name: 'iNaturalist Birds MobileNet v2', modelPath: 'models/inaturalist/birds', score: 0.25, scoreScale: 200, topK: 1, classes: 'assets/iNaturalist-Birds-Labels.json', offset: 0, background: 964 },
  // { name: 'iNaturalist Insects MobileNet v2', modelPath: 'models/inaturalist/insects', score: 0.3, scoreScale: 200, topK: 1, classes: 'assets/iNaturalist-Insects-Labels.json', offset: 0, background: 1021 },
  { name: 'NSFW Inception v3', modelPath: 'models/nsfw-inception-v3-quant', score: 0.7, topK: 4, tensorSize: 299, scoreScale: 2, offset: 0, background: 2, modelType: 'layers' },
];

models.detect = [
  // { name: 'CoCo SSD/MobileNet v1', modelPath: 'models/cocossd-v1', score: 0.4, topK: 6, overlap: 0.5, exec: 'coco' },
  // { name: 'Coco SSD/MobileNet v1', modelPath: 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v1/1/default/1', score: 0.4, topK: 6, overlap: 0.1 },
  { name: 'CoCo SSD/MobileNet v2', modelPath: 'models/coco-ssd-mobilenet-v2', score: 0.4, topK: 6, overlap: 0.5, useFloat: false, exec: 'coco' },
  // { name: 'Coco SSD/MobileNet v2', modelPath: 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1', score: 0.4, topK: 6, overlap: 0.1 },
  // { name: 'CoCo DarkNet/Yolo v1 Tiny', modelPath: 'models/yolo-v1-tiny', score: 0.4, topK: 6, overlap: 0.5, modelType: 'layers' },
  // { name: 'CoCo DarkNet/Yolo v2 Tiny', modelPath: 'models/yolo-v2-tiny', score: 0.4, topK: 6, overlap: 0.5, modelType: 'layers' },
  // { name: 'CoCo DarkNet/Yolo v3 Tiny', modelPath: 'models/yolo-v3-tiny', score: 0.4, topK: 6, overlap: 0.5, modelType: 'layers' },
  // { name: 'CoCo DarkNet/Yolo v3 Full', modelPath: 'models/yolo-v3-full', score: 0.4, topK: 6, overlap: 0.5, modelType: 'layers' },
  { name: 'OpenImages SSD/MobileNet v2', modelPath: 'models/openimages-ssd-mobilenet-v2', score: 0.2, topK: 6, useFloat: true, exec: 'ssd' },
  // { name: 'OpenImages RCNN/Inception-ResNet v2', modelPath: 'models/rcnn-inception-resnet-v2', score: 0.2, topK: 6, classes: 'assets/OpenImage-Labels.json', exec: 'ssd' },
];

models.person = [
  // { name: 'FaceAPI TinyYolo', modelPath: 'models/faceapi/', exec: 'yolo', score: 0.3, topK: 1, size: 416 },
  { name: 'FaceAPI SSD/MobileNet v1', modelPath: 'models/faceapi/', exec: 'ssd', score: 0.3, topK: 1, size: 416 },
];
