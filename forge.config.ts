import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { VitePlugin } from '@electron-forge/plugin-vite';
import 'dotenv/config';

const iconPath = 'assets/icons/icon';
const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    prune: false,
    icon: iconPath,
    osxSign: {},
    osxNotarize: {
      tool: 'notarytool',
      appleId: process.env.APPLE_ID ?? '',
      appleIdPassword: process.env.APPLE_ID_PASSWORD ?? '',
      teamId: process.env.TEAM_ID ?? '',
    },
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'HeyLisa',
      // iconUrl: `${iconPath}.ico`,
      // setupIcon: `${iconPath}.ico`,
    }),
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
    // {
    //   name: '@electron-forge/maker-zip',
    //   config: {},
    // },
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
        },
        {
          entry: 'src/serve.js',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
  publishers: [
    // {
    //   name: '@electron-forge/publisher-electron-release-server',
    //   config: {
    //     baseUrl: process.env.ELECTRON_RELEASE_SERVER_URL ?? '',
    //     username: process.env.ELECTRON_RELEASE_SERVER_USERNAME ?? '',
    //     password: process.env.ELECTRON_RELEASE_SERVER_PASSWORD ?? '', // string
    //   },
    // },
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'yerled',
          name: 'HeyLisa',
        },
        prerelease: true,
      },
    },
  ],
};

export default config;
