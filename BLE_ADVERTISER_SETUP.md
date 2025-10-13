# BLE Advertiser Setup Guide

This guide will help you set up `react-native-ble-advertiser` for the Attendance App Lecturer.

## Installation

```bash
npm install react-native-ble-advertiser --save
```

## Android Setup

### 1. Update AndroidManifest.xml

Add the following permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Bluetooth permissions for Android < 12 -->
    <uses-permission android:name="android.permission.BLUETOOTH"/>
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
    
    <!-- Bluetooth permissions for Android >= 12 -->
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
    <uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE"/>
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
    
    <!-- Location permissions (required for BLE scanning) -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
    
    <!-- Background location (optional but recommended) -->
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION"/>
    
    <!-- Hardware requirements -->
    <uses-feature 
        android:name="android.hardware.bluetooth_le" 
        android:required="true"/>
    
    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme">
        
        <!-- Your existing activities -->
        
    </application>
</manifest>
```

### 2. Update build.gradle (Module: app)

In `android/app/build.gradle`, ensure the following:

```gradle
android {
    compileSdkVersion 34
    targetSdkVersion 34
    minSdkVersion 21  // BLE Advertiser requires API 21+
    
    defaultConfig {
        // ... other config
    }
}

dependencies {
    // ... your existing dependencies
}
```

### 3. Proguard Rules (if using Proguard)

Add to `android/app/proguard-rules.pro`:

```
-keep class com.vitorpamplona.bleadvertiser.** { *; }
-dontwarn com.vitorpamplona.bleadvertiser.**
```

## iOS Setup

### 1. Update Info.plist

Add the following to `ios/AwesomeProject/Info.plist`:

```xml
<dict>
    <!-- Location permission (required for BLE) -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>This app needs location access to use Bluetooth for attendance tracking.</string>
    
    <!-- Bluetooth permission -->
    <key>NSBluetoothAlwaysUsageDescription</key>
    <string>This app uses Bluetooth to broadcast attendance sessions and detect nearby students.</string>
    
    <!-- Background modes for BLE -->
    <key>UIBackgroundModes</key>
    <array>
        <string>bluetooth-central</string>
        <string>bluetooth-peripheral</string>
    </array>
    
    <!-- Required device capabilities -->
    <key>UIRequiredDeviceCapabilities</key>
    <array>
        <string>bluetooth-le</string>
    </array>
    
    <!-- ... your other plist entries -->
</dict>
```

### 2. Install CocoaPods Dependencies

```bash
cd ios
pod install
cd ..
```

### 3. Update iOS Deployment Target

Ensure your iOS deployment target is at least iOS 10.0 in `ios/AwesomeProject.xcodeproj`.

## Usage in the App

### 1. Import the Library

```typescript
import BLEAdvertiser from 'react-native-ble-advertiser';
import { NativeEventEmitter, NativeModules } from 'react-native';
```

### 2. Basic Usage

```typescript
// Set your company ID (use your registered company identifier)
BLEAdvertiser.setCompanyId(0x0001);

// Start advertising
const serviceUUID = 'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C';
const manufacturerData = [1, 2, 3, 4]; // Your session data as byte array

BLEAdvertiser.broadcast(serviceUUID, manufacturerData, {})
    .then(success => console.log('Broadcasting started', success))
    .catch(error => console.log('Broadcasting failed', error));

// Stop advertising
BLEAdvertiser.stopBroadcast()
    .then(success => console.log('Broadcasting stopped', success))
    .catch(error => console.log('Stop broadcast error', error));
```

### 3. Scanning for Devices

```typescript
const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

// Listen for found devices
const subscription = eventEmitter.addListener('onDeviceFound', (event) => {
    console.log('Found device:', event);
    // Handle student attendance data here
});

// Start scanning
BLEAdvertiser.scanByService([serviceUUID], {})
    .then(success => console.log('Scanning started', success))
    .catch(error => console.log('Scanning failed', error));

// Stop scanning
BLEAdvertiser.stopScan()
    .then(success => console.log('Scanning stopped', success))
    .catch(error => console.log('Stop scan error', error));

// Don't forget to remove the listener
subscription.remove();
```

## Testing

### 1. Check BLE Support

Verify that the device supports BLE advertising:

```typescript
import { Platform } from 'react-native';

const checkBLESupport = () => {
    if (Platform.OS === 'android') {
        // Android API 21+ with BLE hardware
        return Platform.Version >= 21;
    } else {
        // iOS 10+ with BLE hardware
        return true; // iOS devices generally support BLE
    }
};
```

### 2. Test on Real Devices

**Important**: BLE advertising doesn't work on emulators/simulators. Always test on physical devices.

### 3. Check Permissions

```typescript
const eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);

eventEmitter.addListener('onBTStatusChange', (enabled) => {
    console.log('Bluetooth status:', enabled);
    if (!enabled) {
        // Handle Bluetooth disabled
        Alert.alert('Bluetooth Required', 'Please enable Bluetooth to use attendance features');
    }
});
```

## Troubleshooting

### Common Issues

1. **Advertising not starting**: Check permissions and Bluetooth status
2. **Devices not found**: Ensure both devices are advertising/scanning with the same service UUID
3. **Permission denied**: Make sure all required permissions are granted
4. **Build errors**: Ensure proper setup in AndroidManifest.xml and Info.plist

### Debugging Tips

1. Enable verbose logging in development
2. Test with multiple physical devices
3. Check Android Bluetooth stack limitations (concurrent connections)
4. Verify service UUID format (must be valid UUID)

### Android Specific

- Some Android devices have limitations on concurrent BLE operations
- Battery optimization may affect BLE performance
- Different Android versions handle BLE differently

### iOS Specific

- Background advertising has limitations
- iOS may throttle advertising when in background
- Core Bluetooth permissions are stricter

## Company ID Registration

For production apps, you should register for an official Company Identifier with the Bluetooth SIG:
- Visit: https://www.bluetooth.com/develop-with-bluetooth/join/
- Register your company
- Use your assigned Company ID instead of 0x0001

## Performance Considerations

1. **Battery Usage**: BLE advertising consumes battery - inform users
2. **Range**: BLE range is typically 10-100 meters depending on device
3. **Interference**: Other BLE devices may cause interference
4. **Platform Limits**: Each platform has different limits on concurrent operations

## Security Considerations

1. **Data Encryption**: Consider encrypting sensitive data in advertisements
2. **Session Validation**: Validate session data to prevent spoofing
3. **Time-based Tokens**: Use time-limited session tokens
4. **Privacy**: Be mindful of what data you broadcast publicly