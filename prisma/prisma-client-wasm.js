// This proxy forces webpack to inline the WASM Prisma client instead of using
// the Node.js library engine (which calls fs.readdir, unavailable in Cloudflare Workers).
// eslint-disable-next-line @typescript-eslint/no-require-imports
module.exports = require('.prisma/client/wasm.js');
