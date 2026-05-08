import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const defaultPath = 'public/models/final low poly character rigged.glb';
const filePath = process.argv[2] || defaultPath;
const unusableMessage = 'El modelo GLB no contiene un rig/skinning utilizable para deformación. Debe exportarse nuevamente desde Blender con Armature y Skinning.';

function getNodePath(nodes, parents, index) {
  const parts = [];
  const seen = new Set();
  let cursor = index;
  while (cursor !== undefined && cursor !== null && !seen.has(cursor)) {
    seen.add(cursor);
    parts.unshift(nodes[cursor]?.name || `node_${cursor}`);
    cursor = parents.get(cursor);
  }
  return parts.join(' / ');
}

function readGlbJson(buffer) {
  const magic = buffer.toString('utf8', 0, 4);
  if (magic !== 'glTF') throw new Error(`Archivo no es GLB válido: magic=${magic}`);
  const version = buffer.readUInt32LE(4);
  const declaredLength = buffer.readUInt32LE(8);
  let offset = 12;
  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.toString('utf8', offset + 4, offset + 8);
    offset += 8;
    const chunk = buffer.subarray(offset, offset + chunkLength);
    offset += chunkLength;
    if (chunkType === 'JSON') {
      return { version, declaredLength, json: JSON.parse(chunk.toString('utf8')) };
    }
  }
  throw new Error('GLB no contiene chunk JSON.');
}

if (!existsSync(filePath)) {
  console.error(`No existe el archivo GLB físico: ${filePath}`);
  process.exit(2);
}

const buffer = await readFile(filePath);
const { version, declaredLength, json } = readGlbJson(buffer);
const nodes = json.nodes || [];
const skins = json.skins || [];
const meshes = json.meshes || [];
const parents = new Map();

nodes.forEach((node, index) => {
  for (const child of node.children || []) parents.set(child, index);
});

const skeletonJointIndexes = new Set();
const skeletonNames = new Map();
skins.forEach((skin, skinIndex) => {
  for (const joint of skin.joints || []) {
    skeletonJointIndexes.add(joint);
    skeletonNames.set(joint, skin.name || `skin_${skinIndex}`);
  }
});

const skinnedNodes = nodes
  .map((node, index) => ({ node, index }))
  .filter(({ node }) => node.skin !== undefined);

const boneRows = [...skeletonJointIndexes].sort((a, b) => a - b).map((index) => {
  const node = nodes[index] || {};
  return {
    index,
    name: node.name || '',
    parent: parents.has(index) ? (nodes[parents.get(index)]?.name || `node_${parents.get(index)}`) : '',
    children: (node.children || []).map((child) => nodes[child]?.name || `node_${child}`).join(', '),
    path: getNodePath(nodes, parents, index),
    localPosition: JSON.stringify(node.translation || [0, 0, 0]),
    localRotation: JSON.stringify(node.rotation || [0, 0, 0, 1]),
    localScale: JSON.stringify(node.scale || [1, 1, 1]),
    skeleton: skeletonNames.get(index) || '',
  };
});

const skinnedRows = skinnedNodes.map(({ node, index }) => ({
  index,
  name: node.name || '',
  mesh: node.mesh ?? '',
  meshName: node.mesh !== undefined ? (meshes[node.mesh]?.name || `mesh_${node.mesh}`) : '',
  skin: node.skin ?? '',
  skinName: node.skin !== undefined ? (skins[node.skin]?.name || `skin_${node.skin}`) : '',
  joints: node.skin !== undefined ? (skins[node.skin]?.joints?.length || 0) : 0,
  path: getNodePath(nodes, parents, index),
}));

console.log(`GLB: ${filePath}`);
console.log(`Version: ${version} | Declared length: ${declaredLength} | Actual bytes: ${buffer.length}`);
console.log(`Nodes: ${nodes.length} | Meshes: ${meshes.length} | Skins: ${skins.length} | Skinned nodes: ${skinnedRows.length} | Joints: ${boneRows.length}`);
console.log('\nSkinnedMesh / skin users:');
console.table(skinnedRows);
console.log('\nBones / joints:');
console.table(boneRows);

if (!skins.length || !skinnedRows.length || !boneRows.length) {
  console.error(`\n${unusableMessage}`);
  process.exit(1);
}

console.log('\nRig usable: se detectaron skins, nodos con skin y joints. Usa estos nombres para explicitBones en src/config/humanModelConfig.ts.');
