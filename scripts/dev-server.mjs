// Servidor estático mínimo, sem dependências, apenas para desenvolvimento local.
// Em produção, a pasta /public é publicada diretamente na hospedagem.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const PORT = Number(process.env.PORT) || 3000;
const ROOT = resolve("public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function resolveFile(urlPath) {
  const safePath = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(ROOT, safePath);
  if (!filePath.startsWith(ROOT)) return null;

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, "index.html");
    await stat(filePath);
    return filePath;
  } catch {
    try {
      const withHtml = `${filePath}.html`;
      await stat(withHtml);
      return withHtml;
    } catch {
      return null;
    }
  }
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  const filePath = await resolveFile(pathname);
  const target = filePath ?? join(ROOT, "404.html");

  try {
    const content = await readFile(target);
    response.writeHead(filePath ? 200 : 404, {
      "Content-Type": MIME_TYPES[extname(target)] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Erro interno do servidor.");
  }
}).listen(PORT, () => {
  console.log(`Vilar Tecnologia rodando em http://localhost:${PORT}`);
});
