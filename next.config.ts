import type { NextConfig } from "next";

const config: NextConfig = {
  // Les fichiers de contenu sont lus au runtime : on les inclut dans le déploiement Vercel.
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
};

export default config;
