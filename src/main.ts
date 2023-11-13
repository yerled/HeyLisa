// main.js
import path from 'path';
// import { updateElectronApp } from 'update-electron-app';

import { app, BrowserWindow } from 'electron';
import { createWindow } from './window';

import { createTray } from './tray';
import { configDock } from './dock';
import AppUpdater from './auto-updater';

if (require('electron-squirrel-startup')) app.quit();

// updateElectronApp();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serve = require('./serve');
serve({ directory: 'renderer/out' });

// const isProd = process.env.NODE_ENV === 'production';

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  new AppUpdater();

  async function _createWindow() {
    const mainWindow = await createWindow('main', {
      // frame: false,
      // titleBarStyle: 'hidden',
      width: 960,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    // mainWindow.loadFile('index.html');
    await mainWindow.loadURL('app://location/index.html');
    mainWindow.webContents.openDevTools();
  }
  _createWindow();

  createTray();
  configDock();

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) _createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。