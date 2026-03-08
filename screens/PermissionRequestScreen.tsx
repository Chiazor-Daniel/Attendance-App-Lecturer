import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  AppState,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PermissionsManager, { PermissionStatus } from '../utils/Permissions';

const PermissionRequestScreen = ({ navigation }: { navigation: any }) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
    bluetooth: false,
    location: false,
    isBlocked: false,
  });
  const appState = useRef(AppState.currentState);

  const checkPermissions = async () => {
    const status = await PermissionsManager.checkAndRequestPermissions();
    setPermissionStatus(status);

    if (status.bluetooth && status.location && status.bluetoothHardwareOn) {
      navigation.replace('LecturerDashboard');
    }
  };

  useEffect(() => {
    checkPermissions();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkPermissions();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const renderPermissionItem = (
    title: string,
    granted: boolean,
    icon: string,
    hardwareStatus?: boolean
  ) => (
    <View style={styles.permissionItem}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, granted && styles.iconContainerGranted]}>
          <Ionicons name={icon} size={18} color={granted ? '#fff' : '#8B5CF6'} />
        </View>
        <View>
          <Text style={styles.permissionTitle}>{title}</Text>
          {granted && !hardwareStatus && title === 'Bluetooth' && (
            <Text style={styles.hardwareWarning}>Hardware is turned OFF</Text>
          )}
        </View>
      </View>
      <Text style={[styles.permissionStatus, granted ? styles.statusGranted : styles.statusRequired]}>
        {granted ? '✓ Granted' : '✕ Required'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerIcon}>
          <Ionicons name="shield-checkmark" size={48} color="#8B5CF6" />
        </View>

        <Text style={styles.title}>Permissions Required</Text>
        <Text style={styles.description}>
          To provide a seamless attendance experience, we need access to your device's connectivity features.
        </Text>

        <View style={styles.permissionList}>
          {renderPermissionItem('Bluetooth', permissionStatus.bluetooth, 'bluetooth', permissionStatus.bluetoothHardwareOn)}
          {renderPermissionItem('Location', permissionStatus.location, 'location', true)}

          {permissionStatus.isBlocked && (
            <View style={styles.blockedNotice}>
              <Ionicons name="alert-circle" size={14} color="#ef4444" />
              <Text style={styles.blockedText}>
                Permissions are blocked. Enable them in settings.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {permissionStatus.isBlocked ? (
            <TouchableOpacity
              style={[styles.button, styles.settingsButton]}
              onPress={() => PermissionsManager.goToSettings()}
            >
              <Text style={styles.buttonText}>Open Device Settings</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={checkPermissions}>
              <Text style={styles.buttonText}>Grant All Permissions</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.note}>
            Data is encrypted and used only for attendance verification.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  description: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  permissionList: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 24,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconContainerGranted: {
    backgroundColor: '#10b981',
  },
  permissionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  hardwareWarning: {
    fontSize: 8,
    color: '#ef4444',
    fontWeight: '500',
  },
  permissionStatus: {
    fontSize: 9,
    fontWeight: '600',
  },
  statusGranted: {
    color: '#10b981',
  },
  statusRequired: {
    color: '#8B5CF6',
  },
  blockedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  blockedText: {
    fontSize: 8,
    color: '#ef4444',
    marginLeft: 4,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsButton: {
    backgroundColor: '#1f2937',
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  note: {
    fontSize: 8,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default PermissionRequestScreen;
