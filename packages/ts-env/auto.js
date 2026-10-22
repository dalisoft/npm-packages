import { activate } from './lib.js';

activate({ envs: ['development', 'test', 'production'], on: 'development' });
