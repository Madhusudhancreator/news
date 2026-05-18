// Stub: Prisma's WASM engine is never invoked when using the PrismaNeonHTTP
// driver adapter — all queries go over HTTP, not through the WASM binary.
// This file replaces .wasm imports so webpack does not generate fs.readFile
// code that would crash Cloudflare Workers at startup.
module.exports = {};
