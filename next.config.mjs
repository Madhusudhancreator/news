import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Force webpack to bundle @prisma/client as wasm.js (not index.js).
    // index.js (LibraryEngine) calls fs.readdir which is not implemented in Cloudflare Workers.
    // wasm.js lazily loads the WASM engine — with PrismaNeonHTTP driver adapter it is never invoked.
    webpack: (config, { isServer }) => {
      if (isServer) {
        // Alias @prisma/client to the WASM variant before webpack externalizes it
        config.resolve.alias = {
          ...config.resolve.alias,
          "@prisma/client$": resolve(__dirname, "node_modules/.prisma/client/wasm.js"),
        };

        // Treat .wasm files as static assets (no asyncWebAssembly → no fs.readFile chunk loading).
        // getQueryEngineWasmModule is never called when using PrismaNeonHTTP adapter.
        config.module.rules.push({ test: /\.wasm$/, type: "asset/resource" });

        // Prevent @prisma/client from being externalized so the alias takes effect
        const originalExternals = config.externals ?? [];
        config.externals = [
          (ctx, cb) => {
            if (ctx.request === "@prisma/client" || ctx.request === "@prisma/client$") return cb();
            if (typeof originalExternals === "function") return originalExternals(ctx, cb);
            const fns = Array.isArray(originalExternals) ? originalExternals : [originalExternals];
            const fn = fns.find((e) => typeof e === "function");
            return fn ? fn(ctx, cb) : cb();
          },
        ];
      }
      return config;
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'd1uo68v5hl2ge5.cloudfront.net' ,
          },
          {
            protocol: 'https',
            hostname: "firebasestorage.googleapis.com" ,
          },
          {
            protocol: 'https',
            hostname: "newscity24.com" ,
          },
          {
            protocol: 'https',
            hostname: "placehold.co" ,
          },
        ],
        unoptimized: true,
      },
      async headers() {
        return [
          // Cache only /api/public/*
          {
            source: "/api/public/:path*",
            headers: process.env.NODE_ENV === "development"
              ? [
                  {
                    key: "Cache-Control",
                    value: "no-store", // Disable caching in development
                  },
                ]
              : [
                  {
                    key: "Cache-Control",
                    value: "s-maxage=3600, stale-while-revalidate=59", // Cache for production
                  },
                ],
          },
        ];
      },
      turbopack: {
        rules: {
          '*.svg': {
            loaders: ['@svgr/webpack'],
            as: '*.js',
          },
        },
      },
};

export default nextConfig;
