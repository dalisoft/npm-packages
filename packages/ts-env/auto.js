import { activate } from './lib';

activate({ on: 'development', envs: ['development', 'test', 'production'] });
