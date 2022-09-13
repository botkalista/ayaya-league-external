

const fs = require('fs');

fs.rmSync('./dist/components/winapi/cpp', { force: true, recursive: true })
fs.cpSync('./src/components/winapi/cpp', './dist/components/winapi/cpp', { force: true, recursive: true });
fs.cpSync('./src/offsets.min.js', './dist/offsets.min.js', { force: true, recursive: true });