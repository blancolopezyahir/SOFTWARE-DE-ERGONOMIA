import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const root = process.cwd();
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.glb':'model/gltf-binary', '.gltf':'model/gltf+json', '.bin':'application/octet-stream' };
async function existingFile(path) { const info = await stat(path).catch(() => null); return info?.isDirectory() ? join(path, 'index.html') : info ? path : null; }
const server = createServer(async (req,res)=>{ try { const url = new URL(req.url ?? '/', 'http://localhost'); const pathname = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, ''); const candidates = [join(root, pathname || 'index.html'), join(root, 'public', pathname)]; let file = null; for (const candidate of candidates) { file = await existingFile(candidate); if (file) break; } if (!file) throw new Error('Not found'); const data = await readFile(file); res.writeHead(200, {'content-type': types[extname(file)] ?? 'application/octet-stream'}); res.end(data); } catch { res.writeHead(404); res.end('Not found'); } });
const port = Number(process.env.PORT || 5173); server.listen(port, '0.0.0.0', ()=>console.log(`Vite-compatible local dev server: http://localhost:${port}`));
