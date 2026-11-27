const { withAppBuildGradle } = require('expo/config-plugins');

module.exports = function withNativeDebugSymbols(config) {
  return withAppBuildGradle(config, (cfg) => {
    const gradle = cfg.modResults.contents;
    if (!gradle.includes('debugSymbolLevel')) {
      cfg.modResults.contents = gradle.replace(
        /defaultConfig\s*\{/,
        (match) => `${match}\n        ndk {\n            debugSymbolLevel 'FULL'\n        }`,
      );
    }
    return cfg;
  });
};
