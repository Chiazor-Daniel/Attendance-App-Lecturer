"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, Animated } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const FacialDetectionScanningScreen = ({ navigation }) => {
  const [scanAnimation] = useState(new Animated.Value(0))

  useEffect(() => {
    // Start scanning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start()

    // Navigate to success screen after 4 seconds
    const timer = setTimeout(() => {
      navigation.navigate("FacialDetectionSuccess")
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="close" size={24} color="#333" />
        <Text style={styles.headerTitle}>Facial Detection</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Face Detection Frame */}
        <View style={styles.detectionContainer}>
          <View style={styles.detectionFrame}>
            <View style={styles.faceArea}>
              <View style={styles.scanningCircle} />
              <View style={styles.scanningRect} />

              {/* Scanning line animation */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [
                      {
                        translateY: scanAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-100, 100],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <Text style={styles.scanningText}>Scanning your face</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: scanAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["20%", "80%"],
                }),
              },
            ]}
          />
        </View>

        <Text style={styles.instructionText}>
          Please keep your face centered inside the frame and keep facing forward.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  detectionContainer: {
    marginTop: 40,
    marginBottom: 40,
  },
  detectionFrame: {
    width: 280,
    height: 200,
    borderWidth: 3,
    borderColor: "#10b981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    overflow: "hidden",
  },
  faceArea: {
    alignItems: "center",
    position: "relative",
  },
  scanningCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#8B5CF6",
    borderStyle: "dashed",
    marginBottom: 20,
  },
  scanningRect: {
    width: 120,
    height: 60,
    borderWidth: 2,
    borderColor: "#8B5CF6",
    borderStyle: "dashed",
    borderRadius: 8,
  },
  scanLine: {
    position: "absolute",
    width: 200,
    height: 2,
    backgroundColor: "#8B5CF6",
    opacity: 0.8,
  },
  scanningText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
  },
  progressContainer: {
    width: "80%",
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginBottom: 30,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
  },
  instructionText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
})

export default FacialDetectionScanningScreen
