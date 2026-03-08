import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useState, useCallback } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import Clipboard from '@react-native-clipboard/clipboard';
import SessionManager from '../services/SessionManager';
import { AttendanceData } from '../types/session';

const AttendanceInProgressScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { courseCode, duration, attendanceWindow } = route.params;
  const [sessionManager] = useState(() => new SessionManager());
  const [sessionId, setSessionId] = useState('');
  const [attendees, setAttendees] = useState<AttendanceData[]>([]);
  const [remainingTime, setRemainingTime] = useState(duration * 60);
  const [remainingWindow, setRemainingWindow] = useState(attendanceWindow * 60);
  const [isOnline, setIsOnline] = useState(true);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const session = await sessionManager.startSession(
          courseCode,
          duration,
          attendanceWindow,
        );
        setSessionId(session.sessionId);
      } catch (error) {
        Alert.alert('Error', 'Failed to start session');
        navigation.goBack();
      }
    };

    initializeSession();

    const timer = BackgroundTimer.setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) {
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });

      setRemainingWindow(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      BackgroundTimer.clearInterval(timer);
      sessionManager.destroy();
    };
  }, []);

  useEffect(() => {
    if (sessionId) {
      const subscription = sessionManager.onAttendanceUpdate(data => {
        setAttendees(prev => {
          if (prev.find(a => a.studentId === data.studentId)) return prev;
          return [...prev, data];
        });
      });

      return () => subscription?.();
    }
  }, [sessionId]);

  const handleEndSession = useCallback(async () => {
    setIsEnding(true);
    try {
      const sessionData = await sessionManager.endSession();
      if (sessionData) {
        navigation.replace('SessionSuccess', { sessionData });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to end session');
    } finally {
      setIsEnding(false);
    }
  }, [sessionManager, navigation]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copySessionId = () => {
    Clipboard.setString(sessionId);
    Alert.alert('Copied', 'Session ID copied');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Professional Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{courseCode}</Text>
          <Text style={styles.headerSubtitle}>Session ID: {sessionId}</Text>
        </View>
        <TouchableOpacity onPress={copySessionId} style={styles.copyIconButton}>
          <Icon name="copy-outline" size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Statistics Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={styles.statValue}>{formatTime(remainingTime)}</Text>
            <View style={styles.statProgress}>
              <View style={[styles.progressInner, { width: `${(remainingTime / (duration * 60)) * 100}%` }]} />
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Window</Text>
            <Text style={[styles.statValue, { color: remainingWindow > 0 ? '#10B981' : '#EF4444' }]}>
              {formatTime(remainingWindow)}
            </Text>
            <Text style={styles.statSmall}>Attendance window</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Present</Text>
            <Text style={styles.statValue}>{attendees.length}</Text>
            <Text style={styles.statSmall}>Students</Text>
          </View>
        </View>

        {/* Attendance Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attendance Logs</Text>
            <View style={[styles.statusBadge, { backgroundColor: remainingWindow > 0 ? '#E1F9F1' : '#FEE2E2' }]}>
              <Text style={[styles.statusBadgeText, { color: remainingWindow > 0 ? '#059669' : '#DC2626' }]}>
                {remainingWindow > 0 ? 'Accepting' : 'Closed'}
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {attendees.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="people-outline" size={32} color="#D1D5DB" />
                <Text style={styles.emptyText}>Waiting for students to join...</Text>
              </View>
            ) : (
              attendees.map((student, idx) => (
                <View key={idx} style={styles.studentChip}>
                  <View style={styles.studentAvatar}>
                    <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                    <Text style={styles.studentTime}>{new Date(student.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <Icon name="checkmark-circle" size={16} color="#10B981" />
                </View>
              ))
            )}
          </View>
        </View>

        {/* Settings Mini Card */}
        <View style={styles.settingsCard}>
          <View style={styles.settingsInfo}>
            <Icon name="wifi-outline" size={18} color="#8B5CF6" />
            <Text style={styles.settingsLabel}>Offline Sync Mode</Text>
          </View>
          <TouchableOpacity
            style={[styles.miniSwitch, isOnline && styles.miniSwitchActive]}
            onPress={() => setIsOnline(!isOnline)}
          >
            <View style={[styles.miniThumb, isOnline && styles.miniThumbActive]} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            Alert.alert('Cancel Session', 'Discard all attendance data?', [
              { text: 'Keep', style: 'cancel' },
              { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
            ]);
          }}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEndSession}
          disabled={isEnding}
        >
          {isEnding ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>End & Save Session</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  copyIconButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  statSmall: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statProgress: {
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: '#8B5CF6',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  grid: {
    gap: 8,
  },
  studentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  studentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111827',
  },
  studentTime: {
    fontSize: 8,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 8,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  miniSwitch: {
    width: 34,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  miniSwitchActive: {
    backgroundColor: '#8B5CF6',
  },
  miniThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  miniThumbActive: {
    alignSelf: 'flex-end',
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 2,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default AttendanceInProgressScreen;
