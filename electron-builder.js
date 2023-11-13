const packageJson = require('./package.json');

module.exports = {
  appId: 'com.popmart.heylisa',
  productName: packageJson.productName,
  mac: {
    // category: 'your.app.category.type',
    target: ['dmg', 'zip'],
    // identity: null,
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: 'build/entitlements.mac.plist',
    entitlementsInherit: 'build/entitlements.mac.plist',
  },
  afterSign: 'scripts/notarize.js',
  publish: [
    {
      provider: 'github',
      releaseType: 'release',
    },
  ],
};
