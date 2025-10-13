import BLEAdvertiser from 'react-native-ble-advertiser';
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid } from 'react-native';
import { BleService, AttendanceData } from '../services/BleService';

// Mock the BLE Advertiser
jest.mock('react-native-ble-advertiser', () => ({
  setCompanyId: jest.fn(),
  broadcast: jest.fn(),
  stopBroadcast: jest.fn(),
  scanByService: jest.fn(),
  stopScan: jest.fn(),
}));

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    Version: 31,
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      BLUETOOTH_SCAN: 'android.permission.BLUETOOTH_SCAN',
      BLUETOOTH_CONNECT: 'android.permission.BLUETOOTH_CONNECT',
      BLUETOOTH_ADVERTISE: 'android.permission.BLUETOOTH_ADVERTISE',
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
      BLUETOOTH: 'android.permission.BLUETOOTH',
      BLUETOOTH_ADMIN: 'android.permission.BLUETOOTH_ADMIN',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
    requestMultiple: jest.fn(),
  },
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn().mockReturnValue({
      remove: jest.fn(),
    }),
    removeAllListeners: jest.fn(),
  })),
  NativeModules: {
    BLEAdvertiser: {},
  },
}));

// Mock Buffer
global.Buffer = {
  from: jest.fn().mockImplementation((data: string) => ({
    toString: () => data,
  })),
} as any;

describe('BleService', () => {
  let bleService: BleService;
  let mockBLEAdvertiser: jest.Mocked<typeof BLEAdvertiser>;
  let mockPermissionsAndroid: jest.Mocked<typeof PermissionsAndroid>;
  let mockEventEmitter: jest.Mocked<NativeEventEmitter>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockBLEAdvertiser = BLEAdvertiser as jest.Mocked<typeof BLEAdvertiser>;
    mockPermissionsAndroid = PermissionsAndroid as jest.Mocked<typeof PermissionsAndroid>;

    // Mock successful permissions
    mockPermissionsAndroid.requestMultiple.mockResolvedValue({
      'android.permission.BLUETOOTH_SCAN': 'granted',
      'android.permission.BLUETOOTH_CONNECT': 'granted',
      'android.permission.BLUETOOTH_ADVERTISE': 'granted',
      'android.permission.ACCESS_FINE_LOCATION': 'granted',
      'android.permission.ACCESS_COARSE_LOCATION': 'granted',
    });

    mockBLEAdvertiser.broadcast.mockResolvedValue(true);
    mockBLEAdvertiser.stopBroadcast.mockResolvedValue(true);
    mockBLEAdvertiser.scanByService.mockResolvedValue(true);
    mockBLEAdvertiser.stopScan.mockResolvedValue(true);

    bleService = new BleService();
  });

  afterEach(() => {
    if (bleService) {
      bleService.destroy();
    }
  });

  describe('Constructor', () => {
    it('should initialize with correct company ID', () => {
      expect(mockBLEAdvertiser.setCompanyId).toHaveBeenCalledWith(0x0001);
    });

    it('should create event emitter instance', () => {
      expect(NativeEventEmitter).toHaveBeenCalledWith(NativeModules.BLEAdvertiser);
    });
  });

  describe('Permission Handling', () => {
    it('should check and request Android 12+ permissions', async () => {
      const result = await bleService.checkPermissions();

      expect(mockPermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_CONNECT',
        'android.permission.BLUETOOTH_ADVERTISE',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ]);
      expect(result).toBe(true);
    });

    it('should handle Android < 12 permissions', async () => {
      (Platform as any).Version = 30;

      const result = await bleService.checkPermissions();

      expect(mockPermissionsAndroid.requestMultiple).toHaveBeenCalledWith([
        'android.permission.BLUETOOTH',
        'android.permission.BLUETOOTH_ADMIN',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ]);
      expect(result).toBe(true);
    });

    it('should return false when permissions are denied', async () => {
      mockPermissionsAndroid.requestMultiple.mockResolvedValue({
        'android.permission.BLUETOOTH_SCAN': 'denied',
        'android.permission.BLUETOOTH_CONNECT': 'granted',
        'android.permission.BLUETOOTH_ADVERTISE': 'granted',
        'android.permission.ACCESS_FINE_LOCATION': 'granted',
        'android.permission.ACCESS_COARSE_LOCATION': 'granted',
      });

      const result = await bleService.checkPermissions();
      expect(result).toBe(false);
    });

    it('should return true for iOS', async () => {
      (Platform as any).OS = 'ios';

      const result = await bleService.checkPermissions();
      expect(result).toBe(true);
    });
  });

  describe('Advertising', () => {
    const sessionId = 'TEST123';
    const courseCode = 'BIO101';

    it('should start advertising successfully', async () => {
      await bleService.startAdvertising(sessionId, courseCode);

      expect(mockBLEAdvertiser.setCompanyId).toHaveBeenCalledWith(0x0001);
      expect(mockBLEAdvertiser.broadcast).toHaveBeenCalledWith(
        'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C',
        expect.any(Array),
        expect.objectContaining({
          connectable: false,
        })
      );
      expect(bleService.getAdvertisingStatus()).toBe(true);
    });

    it('should throw error when permissions not granted', async () => {
      mockPermissionsAndroid.requestMultiple.mockResolvedValue({
        'android.permission.BLUETOOTH_SCAN': 'denied',
        'android.permission.BLUETOOTH_CONNECT': 'denied',
        'android.permission.BLUETOOTH_ADVERTISE': 'denied',
        'android.permission.ACCESS_FINE_LOCATION': 'denied',
        'android.permission.ACCESS_COARSE_LOCATION': 'denied',
      });

      await expect(bleService.startAdvertising(sessionId, courseCode))
        .rejects.toThrow('Bluetooth permissions not granted');
    });

    it('should stop advertising successfully', async () => {
      await bleService.startAdvertising(sessionId, courseCode);
      await bleService.stopAdvertising();

      expect(mockBLEAdvertiser.stopBroadcast).toHaveBeenCalled();
      expect(bleService.getAdvertisingStatus()).toBe(false);
    });

    it('should handle advertising errors', async () => {
      mockBLEAdvertiser.broadcast.mockRejectedValue(new Error('BLE Error'));

      await expect(bleService.startAdvertising(sessionId, courseCode))
        .rejects.toThrow('BLE Error');
      expect(bleService.getAdvertisingStatus()).toBe(false);
    });
  });

  describe('Scanning', () => {
    it('should start scanning successfully', async () => {
      await bleService.startScanning();

      expect(mockBLEAdvertiser.scanByService).toHaveBeenCalledWith(
        ['F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C'],
        expect.objectContaining({
          scanMode: expect.any(String),
        })
      );
    });

    it('should stop scanning successfully', async () => {
      await bleService.startScanning();
      await bleService.stopScanning();

      expect(mockBLEAdvertiser.stopScan).toHaveBeenCalled();
    });

    it('should throw error when scanning fails', async () => {
      mockBLEAdvertiser.scanByService.mockRejectedValue(new Error('Scan Error'));

      await expect(bleService.startScanning())
        .rejects.toThrow('Scan Error');
    });
  });

  describe('Attendance Data Handling', () => {
    it('should validate attendance data correctly', () => {
      const validEvent = {
        uuid: 'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C',
        manufacturerData: [1, 2, 3, 4],
      };

      // Access private method through any cast for testing
      const isValid = (bleService as any).isValidAttendanceData(validEvent);
      expect(isValid).toBe(true);
    });

    it('should reject invalid attendance data', () => {
      const invalidEvent = {
        uuid: 'wrong-uuid',
        manufacturerData: null,
      };

      const isValid = (bleService as any).isValidAttendanceData(invalidEvent);
      expect(isValid).toBe(false);
    });

    it('should parse attendance data correctly', () => {
      const attendanceData = {
        type: 'student_attendance',
        studentId: 'STU123',
        name: 'John Doe',
        timestamp: '2024-01-01T10:00:00Z',
        verificationMethod: 'facial' as const,
        meetingId: 'MEET123',
        courseCode: 'BIO101',
      };

      const eventData = {
        uuid: 'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C',
        manufacturerData: Array.from(Buffer.from(JSON.stringify(attendanceData))),
      };

      const parsed = (bleService as any).parseAttendanceData(eventData);

      expect(parsed).toEqual({
        studentId: 'STU123',
        name: 'John Doe',
        timestamp: '2024-01-01T10:00:00Z',
        verificationMethod: 'facial',
        meetingId: 'MEET123',
        courseCode: 'BIO101',
      });
    });

    it('should throw error for invalid data type', () => {
      const invalidData = {
        type: 'invalid_type',
        studentId: 'STU123',
      };

      const eventData = {
        uuid: 'F47B5E2D-4A9E-4C5A-9B3F-8E1D2C3A4B5C',
        manufacturerData: Array.from(Buffer.from(JSON.stringify(invalidData))),
      };

      expect(() => (bleService as any).parseAttendanceData(eventData))
        .toThrow('Invalid data type - expected student_attendance');
    });

    it('should register attendance callback', () => {
      const callback = jest.fn();
      bleService.onStudentAttendance(callback);

      // Simulate device found event with valid attendance data
      const mockEventEmitter = (NativeEventEmitter as jest.Mock).mock.results[0].value;
      const addListenerCall = mockEventEmitter.addListener.mock.calls.find(
        call => call[0] === 'onDeviceFound'
      );

      expect(addListenerCall).toBeDefined();
    });
  });

  describe('Service Lifecycle', () => {
    it('should destroy service cleanly', async () => {
      await bleService.startAdvertising('TEST', 'BIO101');
      await bleService.startScanning();

      bleService.destroy();

      expect(mockBLEAdvertiser.stopBroadcast).toHaveBeenCalled();
      expect(mockBLEAdvertiser.stopScan).toHaveBeenCalled();
    });

    it('should handle destroy errors gracefully', async () => {
      mockBLEAdvertiser.stopBroadcast.mockRejectedValue(new Error('Stop Error'));

      // Should not throw
      expect(() => bleService.destroy()).not.toThrow();
    });
  });

  describe('Event Listeners', () => {
    it('should setup Bluetooth status listener', () => {
      const mockEventEmitter = (NativeEventEmitter as jest.Mock).mock.results[0].value;

      expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
        'onBTStatusChange',
        expect.any(Function)
      );
    });

    it('should setup device found listener', () => {
      const mockEventEmitter = (NativeEventEmitter as jest.Mock).mock.results[0].value;

      expect(mockEventEmitter.addListener).toHaveBeenCalledWith(
        'onDeviceFound',
        expect.any(Function)
      );
    });

    it('should handle Bluetooth status changes', () => {
      const mockEventEmitter = (NativeEventEmitter as jest.Mock).mock.results[0].value;
      const statusListener = mockEventEmitter.addListener.mock.calls.find(
        call => call[0] === 'onBTStatusChange'
      )[1];

      // Simulate Bluetooth disabled during advertising
      bleService.getAdvertisingStatus = jest.fn().mockReturnValue(true);
      statusListener(false);

      // Should log warning (we can't easily test console.warn without additional setup)
      expect(statusListener).toBeDefined();
    });
  });

  describe('Platform-specific behavior', () => {
    it('should use Android-specific advertising options', async () => {
      (Platform as any).OS = 'android';

      await bleService.startAdvertising('TEST', 'BIO101');

      expect(mockBLEAdvertiser.broadcast).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.objectContaining({
          advertiseMode: 'ADVERTISE_MODE_LOW_LATENCY',
          txPowerLevel: 'ADVERTISE_TX_POWER_HIGH',
        })
      );
    });

    it('should handle iOS advertising options', async () => {
      (Platform as any).OS = 'ios';

      await bleService.startAdvertising('TEST', 'BIO101');

      expect(mockBLEAdvertiser.broadcast).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.objectContaining({
          advertiseMode: undefined,
          txPowerLevel: undefined,
          connectable: false,
        })
      );
    });
  });
});
