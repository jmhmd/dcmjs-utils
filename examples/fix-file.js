const path = require('path');
const { fix } = require('../');

// const file = path.join(__dirname, '../dcm/seriesuid in sequence/1.dcm');
// const file = path.join(__dirname, '../dcm/corrupt us/1.dcm');
const file = path.join(__dirname, '../dcm/corrupt us/cine.dcm');

// dump({ path: file, ignoreErrors: false, naturalize: true, stopAfterTag: '7FE00010' })
fix({ path: file, outputPath: path.join(__dirname, '../dcm/corrupt us/fixed.dcm') })
  .then(() => {
    console.log('fixed file saved.');
  })
  .catch((err) => console.error('ERROR:', err));
