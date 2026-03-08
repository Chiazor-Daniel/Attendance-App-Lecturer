import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SessionData } from '../services/SessionManager';

const SessionSuccessScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const { sessionData } = route.params as { sessionData: any };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Icon name="checkmark-done-circle" size={60} color="#10B981" />
          </View>
        </View>

        <Text style={styles.title}>Session Complete</Text>
        <Text style={styles.subtitle}>Attendance data has been synchronized</Text>

        <View style={styles.statsCard}>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Course Code</Text>
            <Text style={styles.statValue}>{sessionData.courseCode}</Text>
          </View>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Students Recorded</Text>
            <Text style={styles.statValue}>{sessionData.attendees.length}</Text>
          </View>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Total Duration</Text>
            <Text style={styles.statValue}>{sessionData.duration} mins</Text>
          </View>
          <View style={[styles.statLine, { borderBottomWidth: 0 }]}>
            <Text style={styles.statLabel}>Session ID</Text>
            <Text style={styles.statValue}>{sessionData.sessionId}</Text>
          </View>
        </View>

        <Text style={styles.infoText}>
          The attendance report is now available in your history dashboard.
          You can view detailed student logs and verification methods there.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('LecturerDashboard')}
        >
          <Text style={styles.primaryButtonText}>Finish & Close</Text>
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E1F9F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 24,
  },
  statLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  infoText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SessionSuccessScreen;
