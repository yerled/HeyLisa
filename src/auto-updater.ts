import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';
import log from 'electron-log';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;

    this.checkForUpdates();
  }

  checkForUpdates() {
    setTimeout(() => {
      this._checkForUpdates();
    }, 5 * 1000);
    setInterval(() => {
      this._checkForUpdates();
      // autoUpdater.checkForUpdatesAndNotify();
    }, 60 * 1000);

    autoUpdater.on('update-downloaded', () => {
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        detail:
          'A new version has been downloaded. Restart the application to apply the updates.',
      };

      dialog.showMessageBox(dialogOpts as any).then(returnValue => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall();
      });
    });

    autoUpdater.on('update-not-available', message => {
      log.info('update-not-available:' + message);
    });
    autoUpdater.on('update-available', message => {
      log.info('update-available:' + message);
    });

    autoUpdater.on('error', message => {
      log.error('autoUpdater error:' + message);
    });
  }

  _checkForUpdates() {
    autoUpdater.checkForUpdates();
  }
}
