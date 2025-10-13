import BLEAdvertiser from 'react-native-ble-advertiser';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
} from 'react-native';

export interface AttendanceData {
  studentId: string;
  name: string;
  timestamp: string;
  verificationMethod: 'facial' | 'fingerprint' | 'pin';
  meetingId: string;
  courseCode: string;
}

export class BleService {
  private readonly SERVICE_UUID = 'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C';
  private readonly COMPANY_ID = 0x0001; // Company identifier - change to your registered company ID
  private isAdvertising = false;
  private eventEmitter: NativeEventEmitter;
  private btStatusListener: any;
  private deviceFoundListener: any;
  private attendanceCallback?: (data: AttendanceData) => void;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(NativeModules.BLEAdvertiser);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Bluetooth status change listener
    this.btStatusListener = this.eventEmitter.addListener(
      'onBTStatusChange',
      enabled => {
        console.log('Bluetooth status changed:', enabled);
        if (!enabled && this.isAdvertising) {
          console.warn('Bluetooth was disabled during advertising session');
          this.isAdvertising = false;
        }
      },
    );

    // Device found listener (for scanning if needed)
    this.deviceFoundListener = this.eventEmitter.addListener(
      'onDeviceFound',
      event => {
        console.log('Device found:', event);
        if (this.attendanceCallback && this.isValidAttendanceData(event)) {
          try {
            const attendanceData = this.parseAttendanceData(event);
            this.attendanceCallback(attendanceData);
          } catch (error) {
            console.error('Error parsing attendance data:', error);
          }
        }
      },
    );
  }

  async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version.toString(), 10);

      if (apiLevel >= 31) {
        // Android 12 or higher
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        return Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        // Android < 12
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        return Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );
      }
    }

    // iOS permissions are handled by the library and Info.plist
    return true;
  }

  async startAdvertising(sessionId: string, courseCode: string): Promise<void> {
    try {
      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) {
        throw new Error('Bluetooth permissions not granted');
      }

      // Set company ID
      BLEAdvertiser.setCompanyId(this.COMPANY_ID);

      // Prepare manufacturer data with session information
      const sessionData = {
        sessionId,
        courseCode,
        type: 'lecturer',
        timestamp: new Date().toISOString(),
      };

      // Convert session data to bytes for manufacturer data
      const sessionDataString = JSON.stringify(sessionData);
      const manufacturerData = Array.from(
        Buffer.from(sessionDataString, 'utf8'),
      );

      console.log(
        'Starting BLE advertising with session:',
        sessionId,
        'course:',
        courseCode,
      );

      // Start broadcasting with service UUID and manufacturer data
      await BLEAdvertiser.broadcast(this.SERVICE_UUID, manufacturerData, {
        advertiseMode:
          Platform.OS === 'android' ? 'ADVERTISE_MODE_LOW_LATENCY' : undefined,
        txPowerLevel:
          Platform.OS === 'android' ? 'ADVERTISE_TX_POWER_HIGH' : undefined,
        connectable: false, // We don't need connections, just advertising
      });

      this.isAdvertising = true;
      console.log('BLE advertising started successfully');
    } catch (error) {
      console.error('Failed to start advertising:', error);
      this.isAdvertising = false;
      throw error;
    }
  }

  async stopAdvertising(): Promise<void> {
    try {
      if (this.isAdvertising) {
        await BLEAdvertiser.stopBroadcast();
        this.isAdvertising = false;
        console.log('BLE advertising stopped successfully');
      }
    } catch (error) {
      console.error('Failed to stop advertising:', error);
      throw error;
    }
  }

  async startScanning(): Promise<void> {
    try {
      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) {
        throw new Error('Bluetooth permissions not granted');
      }

      // Set company ID for scanning
      BLEAdvertiser.setCompanyId(this.COMPANY_ID);

      // Start scanning by service UUID to find student devices
      await BLEAdvertiser.scanByService([this.SERVICE_UUID], {
        scanMode:
          Platform.OS === 'android' ? 'SCAN_MODE_LOW_LATENCY' : undefined,
      });

      console.log('BLE scanning started');
    } catch (error) {
      console.error('Failed to start scanning:', error);
      throw error;
    }
  }

  async stopScanning(): Promise<void> {
    try {
      await BLEAdvertiser.stopScan();
      console.log('BLE scanning stopped');
    } catch (error) {
      console.error('Failed to stop scanning:', error);
      throw error;
    }
  }

  onStudentAttendance(callback: (data: AttendanceData) => void): void {
    this.attendanceCallback = callback;
  }

  private isValidAttendanceData(event: any): boolean {
    try {
      // Check if the event contains valid attendance data structure
      return (
        event &&
        (event.manufacturerData || event.serviceData) &&
        event.uuid === this.SERVICE_UUID
      );
    } catch (error) {
      return false;
    }
  }

  private parseAttendanceData(event: any): AttendanceData {
    try {
      // Try to parse manufacturer data first
      let dataString = '';

      if (event.manufacturerData && Array.isArray(event.manufacturerData)) {
        // Convert byte array back to string
        dataString = Buffer.from(event.manufacturerData).toString('utf8');
      } else if (event.serviceData && event.serviceData[this.SERVICE_UUID]) {
        dataString = event.serviceData[this.SERVICE_UUID];
      } else {
        throw new Error('No valid data found in BLE advertisement');
      }

      const parsedData = JSON.parse(dataString);

      // Validate that this is attendance data from a student
      if (parsedData.type !== 'student_attendance') {
        throw new Error('Invalid data type - expected student_attendance');
      }

      return {
        studentId: parsedData.studentId,
        name: parsedData.name,
        timestamp: parsedData.timestamp,
        verificationMethod: parsedData.verificationMethod,
        meetingId: parsedData.meetingId,
        courseCode: parsedData.courseCode,
      };
    } catch (error) {
      console.error('Error parsing attendance data:', error);
      throw error;
    }
  }

  getAdvertisingStatus(): boolean {
    return this.isAdvertising;
  }

  destroy(): void {
    // Stop advertising and scanning
    this.stopAdvertising().catch(console.error);
    this.stopScanning().catch(console.error);

    // Remove event listeners
    if (this.btStatusListener) {
      this.btStatusListener.remove();
    }
    if (this.deviceFoundListener) {
      this.deviceFoundListener.remove();
    }

    // Clear callback
    this.attendanceCallback = undefined;
  }
}

export default BleService;
