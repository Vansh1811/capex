// One-off routeTree regeneration (normally the @lovable vite-tanstack-config
// plugin regenerates it during dev/build). Usage: node scripts/gen-routes.mjs
import { Generator, getConfig } from "@tanstack/router-generator";

const config = getConfig(
  {
    routeToken: "$",
    quoteStyle: "single",
    semicolons: true,
  },
  process.cwd(),
);
const gen = new Generator({ config, root: process.cwd() });
await gen.run();
console.log("routeTree.gen.ts regenerated");
