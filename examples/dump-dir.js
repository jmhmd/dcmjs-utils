const path = require('path');
const { dump } = require('../');

const dir = path.join(__dirname, '../dcm/corrupt mri');

dump({ path: dir, ignoreErrors: true })
  .then(results => console.log('RESULTS:', results.map(r => r.filename)))
  .catch(err => console.error('ERROR:', err));
