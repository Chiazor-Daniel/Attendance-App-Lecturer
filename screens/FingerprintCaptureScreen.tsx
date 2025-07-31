import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';

const FingerprintCaptureScreen = ({ navigation }: any) => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  const pulseValue = new Animated.Value(1);

  useEffect(() => {
    if (isScanning) {
      // Pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [isScanning]);

  const startFingerprintCapturing = () => {
    setIsScanning(true);
    
    // Animate progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      // Simulate random success/failure
      const isSuccess = true;
      if (isSuccess) {
        navigation.navigate('FingerprintSuccess');
      } else {
        navigation.navigate('FingerprintFailed');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
          <Text style={styles.title}>Fingerprint Capturing</Text>
          <Text style={styles.subtitle}>
            Place your finger on the sensor and hold still until the scan is complete.
          </Text>
        </View>

        {/* Fingerprint Scanner */}
        <View style={styles.scannerArea}>
          <Animated.View style={[
            styles.fingerprintFrame,
            isScanning && styles.scanningFrame,
            { transform: [{ scale: isScanning ? pulseValue : 1 }] }
          ]}>
            <View style={styles.fingerprintContainer}>
              {/* Fingerprint pattern */}
              <View style={styles.fingerprintPattern}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.fingerprintRing, 
                      { 
                        width: 40 + (index * 20),
                        height: 40 + (index * 20),
                        borderColor: isScanning ? '#8B5CF6' : '#d1d5db',
                        opacity: isScanning ? 0.8 - (index * 0.1) : 0.3,
                      }
                    ]} 
                  />
                ))}
              </View>
            </View>
          </Animated.View>
          
          {isScanning && (
            <View style={styles.progressContainer}>
              <Text style={styles.scanningText}>Place your finger</Text>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Make sure your finger is clean and dry for the best results.
          </Text>
        </View>

        {/* Button */}
        {!isScanning && (
          <TouchableOpacity style={styles.captureButton} onPress={startFingerprintCapturing}>
            <Text style={styles.captureButtonText}>Start Fingerprint Capturing</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f0ff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintFrame: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#10b981',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  scanningFrame: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  fingerprintContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintPattern: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fingerprintRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 100,
  },
  progressContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 16,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  instructions: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  captureButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default FingerprintCaptureScreen;