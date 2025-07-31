import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const [isOnline, setIsOnline] = useState(true);

  const classes = [
    {
      code: "BIO 202",
      time: "10am",
      color: "#8B5CF6",
      status: "active",
      statusText: "30.50",
      buttonText: "Join Class",
      buttonColor: "#8B5CF6",
    },
    {
      code: "CHM 212",
      time: "1pm",
      color: "#06b6d4",
      status: "upcoming",
      statusText: "Up Next!",
      buttonText: "Join Class",
      buttonColor: "#8B5CF6",
    },
    {
      code: "PHY 212",
      time: "3pm",
      color: "#10b981",
      status: "upcoming",
      statusText: "Up Next!",
      buttonText: "Join Class",
      buttonColor: "#8B5CF6",
    },
    {
      code: "MTH 104",
      time: "8am - 10am",
      color: "#f59e0b",
      status: "ended",
      statusText: "Absent",
      buttonText: "Class Over",
      buttonColor: "#9ca3af",
    },
  ]

  const attendanceData = [
    { course: 'PHY 101', mon: 'present', tue: 'late', wed: 'present', thu: 'present', fri: 'present' },
    { course: 'BIO 101', mon: 'present', tue: 'absent', wed: 'present', thu: 'present', fri: 'absent' },
    { course: 'CHM 101', mon: 'late', tue: 'present', wed: 'absent', thu: 'present', fri: 'present' },
    { course: 'PHS 101', mon: 'absent', tue: 'present', wed: 'absent', thu: 'absent', fri: 'present' },
  ];

  const chartData = [
    { week: 'Week 1', percentage: 85, color: '#8B5CF6' },
    { week: 'Week 2', percentage: 92, color: '#ec4899' },
    { week: 'Week 3', percentage: 78, color: '#1f2937' },
    { week: 'Week 4', percentage: 88, color: '#8B5CF6' },
    { week: 'Week 5', percentage: 95, color: '#ec4899' },
    { week: 'Week 6', percentage: 82, color: '#1f2937' },
    { week: 'Week 7', percentage: 90, color: '#8B5CF6' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'late': return '#f59e0b';
      case 'absent': return '#ef4444';
      default: return '#d1d5db';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return '✓';
      case 'late': return '⚠';
      case 'absent': return '✕';
      default: return '-';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RJ</Text>
            </View>
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>Good Morning!</Text>
              <Text style={styles.userName}>Raymond Joe</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.syncButton}>
            <Ionicons name="sync-outline" size={20} color="white" />
            <Text style={styles.syncText}>Sync Data</Text>
          </TouchableOpacity>
        </View>

        {/* Schedule */}
        <View style={styles.scheduleSection}>
          <Text style={styles.scheduleTitle}>Day's Schedule: 12th June 2024</Text>
          <View style={styles.classGrid}>
        {classes.map((classItem, index) => (
          <View key={index} style={styles.classCard}>
            <View style={[styles.classHeader, { backgroundColor: classItem.color }]}>
              <Text style={styles.classTime}>{classItem.time}</Text>
              <Text style={styles.classCode}>{classItem.code}</Text>
            </View>
            <View style={styles.classBody}>
              <Text style={[styles.statusText, { color: classItem.status === "ended" ? "#ef4444" : "#8B5CF6" }]}>
                {classItem.statusText}
              </Text>
              <TouchableOpacity
                style={[styles.classActionButton, { backgroundColor: classItem.buttonColor }]}
                onPress={() => {
                  if (classItem.status !== "ended") {
                    navigation.navigate("AttendanceSession")
                  }
                }}
                disabled={classItem.status === "ended"}
              >
                <Text style={styles.classActionText}>{classItem.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
        </View>

        {/* Join Class Button (when offline) */}
        {!isOnline && (
          <View style={styles.offlineSection}>
            <Text style={styles.offlineText}>You are currently offline...</Text>
            <TouchableOpacity style={styles.joinClassButton}>
              <Text style={styles.joinClassButtonText}>Join a Class Session</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Attendance Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>% Attendance Per Course</Text>
            <Text style={styles.weekDropdown}>Week 1 ▼</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <View style={styles.chartYAxis}>
              {[100, 80, 60, 40, 20, 0].map((value) => (
                <Text key={value} style={styles.yAxisLabel}>{value}</Text>
              ))}
            </View>
            
            <View style={styles.chartBars}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: (item.percentage / 100) * 120,
                          backgroundColor: item.color 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.week}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendText}>Current Offline</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ec4899' }]} />
              <Text style={styles.legendText}>Saved Offline</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#1f2937' }]} />
              <Text style={styles.legendText}>Missed Attendance Offline</Text>
            </View>
          </View>
        </View>

        {/* Current Week Attendance */}
        <View style={styles.attendanceSection}>
          <View style={styles.attendanceHeader}>
            <Text style={styles.attendanceTitle}>Current Week Attendance</Text>
            <Text style={styles.weekDropdown}>Week 10</Text>
          </View>
          
          <View style={styles.attendanceTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.courseColumn]}>Course</Text>
              <Text style={styles.tableHeaderText}>MON</Text>
              <Text style={styles.tableHeaderText}>TUE</Text>
              <Text style={styles.tableHeaderText}>WED</Text>
              <Text style={styles.tableHeaderText}>THUR</Text>
              <Text style={styles.tableHeaderText}>FRI</Text>
            </View>
            
            {attendanceData.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.courseText, styles.courseColumn]}>{row.course}</Text>
                {['mon', 'tue', 'wed', 'thu', 'fri'].map((day) => (
                  <View key={day} style={[styles.statusCell, { backgroundColor: getStatusColor(row[day]) }]}>
                    <Text style={styles.statusText}>{getStatusIcon(row[day])}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.attendanceLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Late</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  syncButton: {
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  syncIcon: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  syncText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  scheduleSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
 
  classButton: {
    width: (width - 60) / 4,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeClass: {
    borderWidth: 2,
    borderColor: '#1f2937',
  },
 
  offlineSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  joinClassButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  joinClassButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  weekDropdown: {
    fontSize: 14,
    color: '#6b7280',
  },
 
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  chartYAxis: {
    justifyContent: 'space-between',
    height: 120,
    marginRight: 12,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
    width: 20,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 16,
    borderRadius: 2,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#6b7280',
  },
  attendanceSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  attendanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  attendanceTable: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    flex: 1,
    textAlign: 'center',
  },
  courseColumn: {
    flex: 1.5,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,

  },
  courseText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  statusCell: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
 
  attendanceLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  classGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  classCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  classHeader: {
    padding: 12,
    alignItems: "center",
  },
  classTime: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  classCode: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  classBody: {
    padding: 12,
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  classActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
  },
  classActionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default DashboardScreen;