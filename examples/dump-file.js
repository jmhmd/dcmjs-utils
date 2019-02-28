const path = require('path');
const { dump } = require('../');

const file = path.join(__dirname, '../dcm/seriesuid in sequence/1.dcm');

dump({ path: file, ignoreErrors: false, naturalize: true })
  .then(results => console.log('RESULTS:', results))
  .catch(err => console.error('ERROR:', err));
