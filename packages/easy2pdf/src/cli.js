#!/usr/bin/env node
const buildPDF = require('./api.js');

const [_runtime, _currfile, target] = process.argv;

buildPDF(target);
