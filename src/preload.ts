import { ipcRenderer, contextBridge } from 'electron';

let hasLcmLiveWindow = false;

contextBridge.exposeInMainWorld('__HEYLISA_ELECTRON__', {
  main: {
    isOSX: () => process.platform === 'darwin',
    isWindows: () => process.platform === 'win32',
    isLinux: () => /linux/.test(process.platform),
    openScreenSecurity: () =>
      ipcRenderer.invoke('electronMain:openScreenSecurity'),
    getScreenAccess: () => ipcRenderer.invoke('electronMain:getScreenAccess'),
    getScreenSources: () =>
      ipcRenderer.invoke('electronMain:screen:getSources'),
    openLCMLiveWindow: (options: {
      width?: number;
      height?: number;
      url: string;
      alwaysOnTop?: boolean;
    }) => {
      ipcRenderer.invoke('open-lcm-live-window', options);
      hasLcmLiveWindow = true;
    },
    hasLcmLiveWindow: () => !!hasLcmLiveWindow,
    closeLCMLiveWindow: () => {
      ipcRenderer.invoke('close-lcm-live-window');
      hasLcmLiveWindow = false;
    },
  },
});

ipcRenderer.on('lcm-live-window-closed', () => {
  hasLcmLiveWindow = false;
});
