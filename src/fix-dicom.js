/**
 * This tries to fix a corrupt DICOM file by parsing with dcmjs using the `ignore-errors` option,
 * which should hopefully exclude any corrupted or erroneous elements, then write the resulting
 * dataset back to file.
 */

// const dcmjs = require('dcmjs');
const fs = require('fs');
const util = require('util');
const dcmjs = require('@orionmd/dcmjs');

const readFile = util.promisify(fs.readFile);
const bufferToArrayBuffer = require('./util/buffer-to-arraybuffer');

async function fix(options = {}) {
  const { path: filePath, outputPath } = options;
  const fileBuffer = await readFile(filePath);
  const fileArrayBuffer = bufferToArrayBuffer(fileBuffer);
  const dicomData = dcmjs.data.DicomMessage.readFile(fileArrayBuffer, {
    ignoreErrors: true,
    stopAfterTag: '7FE00010',
  });
  const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  // eslint-disable-next-line no-underscore-dangle
  dataset._meta = dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta);
  const buffer = dcmjs.data.datasetToBuffer(dataset);
  fs.writeFileSync(outputPath, buffer);
}

module.exports = fix;
