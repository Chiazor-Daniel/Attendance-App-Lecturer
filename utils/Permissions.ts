import { Platform, Linking } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
  requestMultiple,
} from 'react-native-permissions';
import { BleManager } from 'react-native-ble-plx';

export interface PermissionStatus {
  bluetooth: boolean;
  location: boolean;
  backgroundLocation?: boolean;
  bluetoothHardwareOn?: boolean;
  locationHardwareOn?: boolean;
  isBlocked?: boolean;
}

class PermissionsManager {
  private static bleManager = new BleManager();

  static async checkAndRequestPermissions(): Promise<PermissionStatus> {
    const status: PermissionStatus = {
      bluetooth: false,
      location: false,
      isBlocked: false,
    };

    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      const permissionsToRequest = apiLevel >= 31
        ? [
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

      const results = await requestMultiple(permissionsToRequest);

      if (apiLevel >= 31) {
        status.bluetooth =
          results[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED &&
          results[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED &&
          results[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE] === RESULTS.GRANTED;

        status.location = results[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED;

        status.isBlocked = Object.values(results).some(res => res === RESULTS.BLOCKED);
      } else {
        status.bluetooth = true; // Legacy, granted via manifest
        status.location = results[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED;
        status.isBlocked = results[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.BLOCKED;
      }

    } else {
      const results = await requestMultiple([
        PERMISSIONS.IOS.BLUETOOTH,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ]);

      status.bluetooth = results[PERMISSIONS.IOS.BLUETOOTH] === RESULTS.GRANTED;
      status.location = results[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.GRANTED;
      status.isBlocked =
        results[PERMISSIONS.IOS.BLUETOOTH] === RESULTS.BLOCKED ||
        results[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] === RESULTS.BLOCKED;
    }

    // Check hardware states
    const bleState = await this.bleManager.state();
    status.bluetoothHardwareOn = bleState === 'PoweredOn';
    // For location hardware check, usually we'd need another lib, but for now we focus on permissions

    return status;
  }

  static async goToSettings() {
    await openSettings();
  }

  static async hasRequiredPermissions(): Promise<boolean> {
    const status = await this.checkAndRequestPermissions();
    return status.bluetooth && status.location;
  }
}

export default PermissionsManager;

