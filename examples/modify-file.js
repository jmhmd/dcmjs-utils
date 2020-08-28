const path = require('path');
// const { dump } = require('../');
const dcmjs = require('@orionmd/dcmjs');
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const bufferToArrayBuffer = require('../src/util/buffer-to-arraybuffer');

// const file = path.join(__dirname, '../dcm/seriesuid in sequence/1.dcm');
const file = path.join(__dirname, '../dcm/corrupt us/1.dcm');
const stopAfterTag = '7FE00010';
const ignoreErrors = true;

async function main() {
  const fileBuffer = await readFile(file);
  const fileArrayBuffer = bufferToArrayBuffer(fileBuffer);
  const dicomData = dcmjs.data.DicomMessage.readFile(fileArrayBuffer, {
    ignoreErrors,
    // stopAfterTag,
  });
  const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  // eslint-disable-next-line no-underscore-dangle
  dataset._meta = dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta);
  console.log(dataset);
  console.log('write to file...');
  const buffer = dcmjs.data.datasetToBuffer(dataset);
  fs.writeFileSync('../dcm/corrupt us/out.dcm', buffer);
}

main();
// let dataset = dicomData.dict;

// dump({ path: file, ignoreErrors: false, naturalize: true, untilTag: '7FE00010', })
//   .then(results => console.log('RESULTS:', results))
//   .catch(err => console.error('ERROR:', err));
