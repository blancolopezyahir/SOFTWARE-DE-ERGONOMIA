import { access } from 'node:fs/promises';
for (const file of [
  'index.html',
  'src/main.js',
  'src/styles.css',
  'src/model.css',
  'src/config/rulaConfig.ts',
  'src/utils/rula.ts',
  'public/models/free3d-rigged-male-human-source.json',
]) await access(file);
console.log('Build validation passed: application files are present.');
