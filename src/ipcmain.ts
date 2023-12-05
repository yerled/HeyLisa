import {
  desktopCapturer,
  BrowserWindow,
  ipcMain,
  systemPreferences,
} from 'electron';
import util from 'electron-util';

const IS_OSX = process.platform === 'darwin';

ipcMain.handle('electronMain:openScreenSecurity', () =>
  util.openSystemPreferences('security', 'Privacy_ScreenCapture'),
);
ipcMain.handle(
  'electronMain:getScreenAccess',
  () =>
    !IS_OSX || systemPreferences.getMediaAccessStatus('screen') === 'granted',
);
ipcMain.handle('electronMain:screen:getSources', () => {
  return desktopCapturer
    .getSources({ types: ['window', 'screen'] })
    .then(async sources => {
      return sources.map(source => {
        source.thumbnailURL = source.thumbnail.toDataURL();
        return source;
      });
    });
});

let lcmLiveWindow: BrowserWindow | null = null;

ipcMain.handle(
  'open-lcm-live-window',
  (
    e,
    options: {
      width?: number;
      height?: number;
      url: string;
      alwaysOnTop?: boolean;
    },
  ) => {
    if (lcmLiveWindow !== null) {
      return;
    }

    const newWindow = new BrowserWindow({
      width: options.width,
      height: options.height,
    });
    newWindow.loadURL(options.url);
    lcmLiveWindow = newWindow;

    // 将新窗口始终置顶
    newWindow.setAlwaysOnTop(options.alwaysOnTop);

    newWindow.on('closed', () => {
      lcmLiveWindow = null;
      e.sender.send('lcm-live-window-closed');
    });
  },
);

ipcMain.handle('close-lcm-live-window', () => {
  if (lcmLiveWindow !== null) {
    lcmLiveWindow.close();
  }
});
