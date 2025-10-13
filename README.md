This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: BLE Advertiser Setup

This app uses `react-native-ble-advertiser` for Bluetooth Low Energy advertising functionality. Follow these additional setup steps:

### Install BLE Advertiser

```bash
npm install react-native-ble-advertiser --save
```

### Android Setup

Update `android/app/src/main/AndroidManifest.xml` with Bluetooth permissions:

```xml
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE"/>
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
```

### iOS Setup

Update `ios/AwesomeProject/Info.plist`:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app uses Bluetooth to broadcast attendance sessions.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access is required for Bluetooth functionality.</string>
<key>UIBackgroundModes</key>
<array>
    <string>bluetooth-central</string>
    <string>bluetooth-peripheral</string>
</array>
```

**Important**: Always test on physical devices - BLE advertising doesn't work on emulators/simulators.

See `BLE_ADVERTISER_SETUP.md` and `MIGRATION_GUIDE.md` for detailed setup instructions.

## Step 4: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native Attendance App. :partying_face:

# App Features

## 📱 Lecturer Attendance Management System

This React Native app enables lecturers to manage student attendance using Bluetooth Low Energy (BLE) technology.

### Key Features:
- **BLE-Based Attendance**: Uses Bluetooth advertising for proximity-based attendance
- **Session Management**: Create and manage attendance sessions with configurable rules
- **Real-time Monitoring**: Live attendance tracking during sessions
- **Multiple Verification Methods**: Support for facial recognition, fingerprint, and PIN verification
- **Comprehensive Reports**: Detailed attendance analytics and export capabilities
- **Offline Support**: Works without internet connectivity

### Core Components:
- **Dashboard**: Overview of classes, student counts, and attendance statistics
- **Session Setup**: Configure session duration and attendance windows
- **Live Session**: Real-time session monitoring with BLE status indicators
- **Reports**: Visual analytics and data export functionality
- **Profile Management**: Lecturer account and course management

### Technical Architecture:
- **BLE Advertising**: Uses `react-native-ble-advertiser` for session broadcasting
- **Background Processing**: Maintains sessions using background timers
- **Local Storage**: AsyncStorage for course and session data persistence
- **Cross-Platform**: Supports both Android (API 21+) and iOS (10+)

# Documentation

- `BLE_ADVERTISER_SETUP.md` - Complete BLE setup guide
- `MIGRATION_GUIDE.md` - Migration from react-native-ble-plx to react-native-ble-advertiser

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## BLE-Specific Issues

1. **Permissions**: Ensure all Bluetooth and location permissions are granted
2. **Hardware**: Test only on physical devices with BLE support
3. **Range**: BLE advertising range is typically 10-100 meters
4. **Battery**: BLE operations can impact battery life

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Attendance App for Lecturers

A comprehensive React Native application for managing student attendance through Bluetooth Low Energy technology.
