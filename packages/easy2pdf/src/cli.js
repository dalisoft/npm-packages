#!/usr/bin/env node
import buildPDF from './api.js';

const [_runtime, _currfile, target] = process.argv;

buildPDF(target);
