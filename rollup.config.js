import typescript from "@rollup/plugin-typescript";
// import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: "src/azurite.ts",
  output: {
    dir: "./",
    format: "cjs"
  },
  plugins: [typescript()] // TODO: Leverage nodeResolve() to bundle all dependencies
};
