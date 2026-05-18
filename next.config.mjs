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
    // Force webpack to use the WASM Prisma runtime (not the Node.js library engine)
    // so that Cloudflare Workers (which lacks fs.readdir) can run Prisma queries
    webpack: (config, { isServer }) => {
      if (isServer) {
        // Alias @prisma/client to our WASM proxy before externals are checked
        config.resolve.alias = {
          ...config.resolve.alias,
          "@prisma/client$": resolve(__dirname, "prisma/prisma-client-wasm.js"),
        };

        // Enable WebAssembly for the Prisma WASM engine (only loaded if no driver adapter is used)
        config.experiments = { ...config.experiments, asyncWebAssembly: true };

        // Prevent @prisma/client from being externalized so the alias takes effect
        const originalExternals = config.externals ?? [];
        config.externals = [
          (ctx, cb) => {
            if (ctx.request === "@prisma/client" || ctx.request === "@prisma/client$") return cb(); // bundle it
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
