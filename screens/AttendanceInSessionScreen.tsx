import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import SessionManager from '../services/SessionManager';

const AttendanceInSessionScreen = ({ navigation, route }) => {
  const [manualMode, setManualMode] = useState(false);
  const [sessionManager] = useState(() => new SessionManager());
  const [attendees, setAttendees] = useState([]);
  const [remainingTime, setRemainingTime] = useState('');
  const { sessionId, courseCode, duration, attendanceWindow } = route.params;

  useEffect(() => {
    const session = sessionManager.getActiveSession();
    if (!session) {
      Alert.alert('Error', 'No active session found');
      navigation.goBack();
      return;
    }

    // Update attendees list when new students join
    const updateInterval = setInterval(() => {
      const currentSession = sessionManager.getActiveSession();
      if (currentSession) {
        setAttendees(currentSession.attendees);

        // Update remaining time
        const now = new Date();
        const endTime = new Date(
          currentSession.startTime.getTime() + duration * 60 * 1000,
        );
        const diff = endTime.getTime() - now.getTime();
        if (diff <= 0) {
          clearInterval(updateInterval);
          handleEndSession();
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);

    return () => {
      clearInterval(updateInterval);
      sessionManager.destroy();
    };
  }, [sessionManager, duration, navigation]);

  const handleEndSession = async () => {
    try {
      const completedSession = await sessionManager.endSession();
      if (completedSession) {
        navigation.navigate('SessionSuccess', {
          attendees: completedSession.attendees,
          courseCode: completedSession.courseCode,
          duration: completedSession.duration,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to end session: ' + error.message);
    }
  };

  const students = attendees.map((attendee, index) => ({
    id: index + 1,
    name: attendee.name,
    time: new Date(attendee.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
    status: 'present',
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance in Session</Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{remainingTime}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>% of student in session</Text>
            <Text style={styles.progressValue}>{`${Math.round(
              (attendees.length / 69) * 100,
            )}% (${attendees.length}/69)`}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '70%' }]} />
          </View>
        </View>

        {/* Session Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Course</Text>
            <Text style={styles.detailValue}>{courseCode}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Session Duration</Text>
            <Text style={styles.detailValue}>{`${duration} minutes`}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Start Time</Text>
            <Text style={styles.detailValue}>08:00 am</Text>
          </View>
        </View>

        {/* Students Grid */}
        <ScrollView
          style={styles.studentsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.studentsGrid}>
            {students.map(student => (
              <View key={student.id} style={styles.studentCard}>
                <Image
                  source={{
                    uri: 'https://via.placeholder.com/50x50/8B5CF6/FFFFFF?text=S',
                  }}
                  style={styles.studentImage}
                />
                <View
                  style={[
                    styles.timeLabel,
                    {
                      backgroundColor:
                        student.status === 'present' ? '#10b981' : '#f59e0b',
                    },
                  ]}
                >
                  <Text style={styles.timeLabelText}>{student.time}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.paginationDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </ScrollView>

        {/* Manual Mode Switch */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Switch to manual mode</Text>
          <TouchableOpacity
            style={[styles.switch, manualMode && styles.switchActive]}
            onPress={() => setManualMode(!manualMode)}
          >
            <View
              style={[
                styles.switchThumb,
                manualMode && styles.switchThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={async () => {
              try {
                await sessionManager.endSession();
                navigation.goBack();
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to cancel session: ' + error.message,
                );
              }
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel Session</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endButton} onPress={handleEndSession}>
            <Text style={styles.endButtonText}>End Class Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#8B5CF6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  timerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  studentsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  studentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  studentCard: {
    width: '18%',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  timeLabel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeLabelText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '600',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
    marginHorizontal: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchActive: {
    backgroundColor: '#8B5CF6',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fecaca',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '600',
  },
  endButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  endButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AttendanceInSessionScreen;
