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

async function fix(options = {}) {
  const { path: filePath, outputPath } = options;
  // const fileBuffer = fs.readFileSync(filePath).buffer;
  const file = await readFile(filePath);
  const dicomData = dcmjs.data.DicomMessage.readFile(file.buffer, {
    ignoreErrors: true,
    stopAfterTag: '7FE00010',
  });
  // const dataset = dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict);
  // // eslint-disable-next-line no-underscore-dangle
  // dataset._meta = dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta);
  // console.log(dataset.FrameIncrementPointer);
  // const buffer = dcmjs.data.datasetToBuffer(dataset);
  // fs.writeFileSync(outputPath, buffer);
  fs.writeFileSync(outputPath, Buffer.from(dicomData.write()));
}

module.exports = fix;
