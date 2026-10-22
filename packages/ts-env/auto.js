import { activate } from './lib.js';

activate({ on: 'development', envs: ['development', 'test', 'production'] });
