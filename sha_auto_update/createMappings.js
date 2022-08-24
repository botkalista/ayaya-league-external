const fs = require('fs');

const getFilesMappings = require('./getFileMappings.js');

const files_mapping = JSON.stringify(getFilesMappings());
fs.writeFileSync('files_sha.json', files_mapping);
