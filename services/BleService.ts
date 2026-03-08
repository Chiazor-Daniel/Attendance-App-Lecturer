import BleBroadcastService from './BleBroadcastService';
import PermissionsManager from '../utils/Permissions';

export interface AttendanceData {
  studentId: string;
  name: string;
  timestamp: string;
  verificationMethod: 'facial' | 'fingerprint' | 'pin';
  meetingId: string;
  courseCode: string;
}

export class BleService {
  private broadcastService: BleBroadcastService;
  private isAdvertising = false;

  constructor() {
    this.broadcastService = BleBroadcastService.getInstance();
  }

  async checkPermissions(): Promise<boolean> {
    return await PermissionsManager.hasRequiredPermissions();
  }

  async startAdvertising(sessionId: string, courseCode: string): Promise<void> {
    try {
      const hasPermissions = await this.checkPermissions();
      if (!hasPermissions) {
        throw new Error('Bluetooth permissions not granted');
      }

      // Use the reliable broadcast service
      await this.broadcastService.startBroadcast(sessionId);
      this.isAdvertising = true;
      console.log('Started broadcasting session:', sessionId);

      // Also start scanning for student responses
      await this.broadcastService.startScanning();
    } catch (error) {
      console.error('Failed to start advertising:', error);
      throw error;
    }
  }

  async stopAdvertising(): Promise<void> {
    try {
      if (this.isAdvertising) {
        await this.broadcastService.stopBroadcast();
        await this.broadcastService.stopScanning();
        this.isAdvertising = false;
      }
    } catch (error) {
      console.error('Failed to stop advertising:', error);
      throw error;
    }
  }

  onStudentAttendance(callback: (data: AttendanceData) => void): () => void {
    // Map the device found event to attendance data
    // Assuming students broadcast their data in a specific format
    return this.broadcastService.onDeviceFound((event: any) => {
      try {
        // Find the manufacturer data or service data that contains student info
        if (event && event.serviceData) {
          // Basic parsing logic - in a real app, you'd decode the buffer
          // For now, we assume the student ID is passed in the event
          const data: AttendanceData = {
            studentId: event.deviceName || 'Unknown',
            name: event.deviceName || 'Student',
            timestamp: new Date().toISOString(),
            verificationMethod: 'pin',
            meetingId: '', // Should be matched against active session
            courseCode: '',
          };
          callback(data);
        }
      } catch (e) {
        console.error('Error parsing student data:', e);
      }
    });
  }

  destroy(): void {
    this.stopAdvertising().catch(console.error);
    this.broadcastService.destroy();
  }
}

export default BleService;
