import { access } from 'node:fs/promises';
for (const file of [
  'index.html',
  'src/main.js',
  'src/styles.css',
  'src/model.css',
  'src/config/rulaConfig.ts',
  'src/config/humanModelConfig.ts',
  'src/utils/rula.ts',
  'public/models/free3d-rigged-male-human-source.json',
]) await access(file);
try {
  await access('public/models/humano-rula-rigged.glb');
  console.log('GLB model found: public/models/humano-rula-rigged.glb');
} catch {
  console.warn('Warning: public/models/humano-rula-rigged.glb is not present; runtime will use the CSS fallback until the GLB is added.');
}
console.log('Build validation passed: application files are present.');
