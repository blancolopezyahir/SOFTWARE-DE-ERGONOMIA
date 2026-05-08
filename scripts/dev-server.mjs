import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const root = process.cwd();
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.glb':'model/gltf-binary', '.gltf':'model/gltf+json', '.bin':'application/octet-stream' };
const server = createServer(async (req,res)=>{ try { const url = new URL(req.url ?? '/', 'http://localhost'); const pathname = normalize(url.pathname).replace(/^([/\\])+/, ''); let file = join(root, pathname || 'index.html'); if ((await stat(file).catch(()=>null))?.isDirectory()) file = join(file, 'index.html'); const data = await readFile(file); res.writeHead(200, {'content-type': types[extname(file)] ?? 'application/octet-stream'}); res.end(data); } catch { res.writeHead(404); res.end('Not found'); } });
const port = Number(process.env.PORT || 5173); server.listen(port, '0.0.0.0', ()=>console.log(`Vite-compatible local dev server: http://localhost:${port}`));
