# Migration Guide: From react-native-ble-plx to react-native-ble-advertiser

This guide will help you migrate from the existing `react-native-ble-plx` implementation to `react-native-ble-advertiser` for better BLE advertising capabilities in the Attendance App.

## Why Migrate?

The current implementation uses `react-native-ble-plx`, which is excellent for BLE communication but has limitations for advertising. `react-native-ble-advertiser` is specifically designed for BLE advertising scenarios, making it more suitable for our attendance system where lecturers need to broadcast their session information.

### Benefits of react-native-ble-advertiser:
- **Dedicated Advertising Support**: Built specifically for BLE advertising
- **Better Cross-Platform Compatibility**: Handles iOS/Android differences automatically
- **Simpler API**: Focused API for advertising use cases
- **Manufacturer Data Support**: Better support for custom data in advertisements
- **Contact Tracing Optimized**: Originally built for contact tracing, perfect for proximity-based attendance

## Pre-Migration Checklist

1. **Backup Current Code**: Ensure you have backups of your current BLE implementation
2. **Test Environment**: Set up testing with physical devices (BLE advertising doesn't work on emulators)
3. **Permissions**: Review and update permission requirements
4. **Dependencies**: Check compatibility with your current React Native version

## Step-by-Step Migration

### Step 1: Install New Dependency

```bash
# Install react-native-ble-advertiser
npm install react-native-ble-advertiser@0.0.15 --save

# For React Native >= 0.60, linking is automatic
# For older versions, you may need to run:
# react-native link react-native-ble-advertiser
```

### Step 2: Update Permissions

#### Android (AndroidManifest.xml)
```xml
<!-- Replace existing Bluetooth permissions with comprehensive set -->
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>

<!-- For Android 12+ -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE"/>
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>

<!-- Hardware requirement -->
<uses-feature 
    android:name="android.hardware.bluetooth_le" 
    android:required="true"/>
```

#### iOS (Info.plist)
```xml
<!-- Update existing entries or add new ones -->
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app uses Bluetooth to broadcast attendance sessions and detect nearby students.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access is required for Bluetooth functionality.</string>

<!-- Background modes -->
<key>UIBackgroundModes</key>
<array>
    <string>bluetooth-central</string>
    <string>bluetooth-peripheral</string>
</array>
```

### Step 3: Update Service Implementation

#### Old BleService.ts (using react-native-ble-plx)
```typescript
// OLD IMPLEMENTATION - REMOVE
import { BleManager, State } from 'react-native-ble-plx';

class BleService {
  private manager: BleManager;
  
  constructor() {
    this.manager = new BleManager();
  }
  
  async startAdvertising() {
    await this.manager.startAdvertising({
      serviceUUIDs: [this.SERVICE_UUID],
      localName: 'AttendanceSession'
    });
  }
}
```

#### New BleService.ts (using react-native-ble-advertiser)
```typescript
// NEW IMPLEMENTATION
import BLEAdvertiser from 'react-native-ble-advertiser';
import { NativeEventEmitter, NativeModules } from 'react-native';

class BleService {
  private eventEmitter: NativeEventEmitter;
  
  constructor() {
    BLEAdvertiser.setCompanyId(0x0001);
    this.eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
  }
  
  async startAdvertising(sessionId: string, courseCode: string) {
    const sessionData = { sessionId, courseCode, type: 'lecturer' };
    const manufacturerData = Array.from(Buffer.from(JSON.stringify(sessionData)));
    
    await BLEAdvertiser.broadcast(this.SERVICE_UUID, manufacturerData, {
      connectable: false
    });
  }
}
```

### Step 4: Update Permission Handling

#### Old Permission Logic
```typescript
// OLD - Using BleManager state checks
const state = await this.manager.state();
if (state !== State.PoweredOn) {
  throw new Error('Bluetooth not ready');
}
```

#### New Permission Logic
```typescript
// NEW - Using react-native-permissions with comprehensive checks
async checkPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return Object.values(granted).every(p => p === PermissionsAndroid.RESULTS.GRANTED);
    }
    // Handle older Android versions...
  }
  return true;
}
```

### Step 5: Update Session Manager

#### Key Changes in SessionManager
```typescript
// OLD
await this.bleService.startAdvertising(sessionId, courseCode);
this.bleService.onStudentAttendance((data) => {
  // Handle via characteristic monitoring
});

// NEW
await this.bleService.startAdvertising(sessionId, courseCode);
await this.bleService.startScanning(); // Now need to scan for student responses
this.bleService.onStudentAttendance((data) => {
  // Handle via device discovery events
});
```

### Step 6: Update Data Format

#### Old Data Format (Characteristic-based)
```typescript
// Data was sent via BLE characteristics
const characteristic = await device.writeCharacteristicWithResponse(
  serviceUUID, 
  characteristicUUID, 
  base64Data
);
```

#### New Data Format (Advertisement-based)
```typescript
// Data is embedded in BLE advertisements
const sessionData = {
  sessionId: 'ABC123',
  courseCode: 'BIO101',
  type: 'lecturer',
  timestamp: new Date().toISOString()
};
const manufacturerData = Array.from(Buffer.from(JSON.stringify(sessionData)));
```

### Step 7: Update Event Handling

#### Old Event System
```typescript
// OLD - Direct characteristic monitoring
this.manager.monitorCharacteristicForService(serviceUUID, charUUID, callback);
```

#### New Event System
```typescript
// NEW - Event emitter for device discovery
const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
eventEmitter.addListener('onDeviceFound', (event) => {
  // Parse manufacturer data for attendance info
});
```

## Testing Migration

### 1. Unit Tests Update
```typescript
// Update your tests to mock react-native-ble-advertiser
jest.mock('react-native-ble-advertiser', () => ({
  setCompanyId: jest.fn(),
  broadcast: jest.fn().mockResolvedValue(true),
  stopBroadcast: jest.fn().mockResolvedValue(true),
  scanByService: jest.fn().mockResolvedValue(true),
  stopScan: jest.fn().mockResolvedValue(true),
}));
```

### 2. Integration Testing
```typescript
// Test with real devices
describe('BLE Advertising', () => {
  test('should start advertising with session data', async () => {
    const bleService = new BleService();
    await expect(
      bleService.startAdvertising('TEST123', 'BIO101')
    ).resolves.toBeTruthy();
  });
});
```

## Common Migration Issues

### Issue 1: Build Errors
```bash
# If you get build errors, try:
cd android && ./gradlew clean && cd ..
cd ios && rm -rf build && pod install && cd ..
```

### Issue 2: Permission Errors
```typescript
// Ensure you request all required permissions
const requiredPermissions = Platform.OS === 'android' 
  ? [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]
  : [];
```

### Issue 3: Data Format Issues
```typescript
// Ensure your data is properly formatted as byte array
const dataString = JSON.stringify(sessionData);
const manufacturerData = Array.from(Buffer.from(dataString, 'utf8'));
// NOT: manufacturerData = dataString (this won't work)
```

## Post-Migration Checklist

- [ ] **Remove old dependencies**: Uninstall `react-native-ble-plx` if no longer needed
- [ ] **Update documentation**: Update any API documentation or comments
- [ ] **Test on multiple devices**: Test on various Android/iOS devices
- [ ] **Performance testing**: Verify advertising range and reliability
- [ ] **Battery usage**: Monitor battery consumption patterns
- [ ] **Error handling**: Ensure proper error handling for new failure modes

## Rollback Plan

If issues arise, you can quickly rollback:

1. **Revert package.json**: Remove `react-native-ble-advertiser`, restore `react-native-ble-plx`
2. **Restore old service files**: Use your backed-up BleService implementation
3. **Revert permissions**: Restore original AndroidManifest.xml and Info.plist
4. **Clean build**: Clean and rebuild your project

```bash
# Quick rollback commands
git checkout HEAD~1 -- package.json
npm install
cd ios && pod install && cd ..
npx react-native run-android
```

## Performance Considerations

### Battery Optimization
- **Old**: BLE connections could drain battery during long sessions
- **New**: Advertisement-only mode is more battery efficient

### Range and Reliability
- **Old**: Connection-based, required pairing/connection establishment
- **New**: Advertisement-based, works on discovery without connections

### Data Throughput
- **Old**: Higher throughput via established connections
- **New**: Lower throughput but sufficient for attendance data

## Security Considerations

### Data Privacy
- **Old**: Data sent over established encrypted BLE connections
- **New**: Data broadcast publicly (consider encryption for sensitive data)

### Recommended Security Updates
```typescript
// Encrypt sensitive data in advertisements
const encryptedData = await encrypt(JSON.stringify(sessionData));
const manufacturerData = Array.from(Buffer.from(encryptedData));
```

## Timeline Suggestion

- **Week 1**: Install dependencies, update permissions, basic setup
- **Week 2**: Migrate core BLE service, update session manager
- **Week 3**: Update UI components, test integration
- **Week 4**: Comprehensive testing, performance optimization
- **Week 5**: Production deployment with monitoring

## Support and Resources

- [react-native-ble-advertiser GitHub](https://github.com/vitorpamplona/react-native-ble-advertiser)
- [BLE Advertising Specification](https://www.bluetooth.com/specifications/gatt/)
- [React Native BLE Best Practices](https://reactnative.dev/docs/native-modules-intro)

Remember: Always test on physical devices, as BLE functionality doesn't work on emulators!