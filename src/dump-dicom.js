// const dcmjs = require('dcmjs');
const fs = require('fs');
const util = require('util');
const path = require('path');
const dcmjs = require('@orionmd/dcmjs');

const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);
const bufferToArrayBuffer = require('./util/buffer-to-arraybuffer');

// const file = fs.readFile('./dcm/1.dcm');

async function getFileDataset(filePath, options = {}) {
  const { ignoreErrors, naturalize } = options;
  const fileBuffer = await readFile(filePath);
  const fileArrayBuffer = bufferToArrayBuffer(fileBuffer);
  const dicomData = dcmjs.data.DicomMessage.readFile(fileArrayBuffer, { ignoreErrors });
  let dataset = dicomData.dict;
  let { meta } = dicomData;

  if (naturalize) {
    dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
    // eslint-disable-next-line no-underscore-dangle
    meta = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.meta);
  }

  // eslint-disable-next-line no-underscore-dangle
  dataset._meta = meta;
  return dataset;
}

function checkPattern(filename, pattern) {
  if (pattern instanceof RegExp) {
    return pattern.test(filename);
  }
  return filename.includes(pattern);
}

async function dump(options = {}) {
  const {
    path: dumpPath, pattern, ignoreErrors, naturalize = true,
  } = options;

  // check if path is a directory
  const fStat = await stat(dumpPath);
  if (fStat.isDirectory()) {
    let filenames = await readdir(dumpPath);
    if (pattern) {
      filenames = filenames.filter(filename => checkPattern(filename, pattern));
    }
    return Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(dumpPath, filename);
        try {
          return {
            filename,
            filePath,
            dataset: await getFileDataset(filePath, { ignoreErrors, naturalize }),
          };
        } catch (err) {
          return {
            filename,
            filePath,
            error: err.message || err,
          };
        }
      }),
    );
  }
  return getFileDataset(dumpPath, { ignoreErrors, naturalize });
}

module.exports = dump;
