/**
 * We initialize these paths in production so that absolute
 * imports (ie. import {...} from 'src/models/User') still
 * work in the build. For more info, read:
 * https://www.npmjs.com/package/tsconfig-paths
 * https://github.com/ilearnio/module-alias/issues/74
 */
const tsConfig = require("./tsconfig.prod.json");
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = "./";

tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});
