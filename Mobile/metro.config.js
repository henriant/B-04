const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Finne mobile-mappen og roten av monorepo
const projectRoot = _dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// Metro overvåker kildekoden i både mobile-mappen og monorepo (root)
config.watchFolders = [workspaceRoot];

// Metro skal prioritere begge steder under leting av pakker:
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
];

module.exports = config;