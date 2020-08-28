const path = require('path');
const { dump } = require('../');

// const file = path.join(__dirname, '../dcm/seriesuid in sequence/1.dcm');
const file = path.join(__dirname, '../dcm/corrupt us/1.dcm');

dump({ path: file, ignoreErrors: false, naturalize: true, untilTag: '7FE00010', })
  .then(results => console.log('RESULTS:', results))
  .catch(err => console.error('ERROR:', err));
