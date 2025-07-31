import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native';

const FacialRecognitionScreen = ({ navigation }: any) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  const startFacialCapturing = () => {
    setIsCapturing(true);
    
    // Animate progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      // Simulate random success/failure
      const isSuccess = true;
      if (isSuccess) {
        // Navigate to success screen (replace with your actual success screen name)
        navigation.navigate('FacialCaptureSuccess'); 
        console.log('Facial Capture Success!'); // For demonstration
        setIsCapturing(false); // Reset for re-capture
        progress.setValue(0); // Reset progress
      } else {
        // Navigate to failure screen (replace with your actual failure screen name)
        navigation.navigate('FacialCaptureFailed');
        console.log('Facial Capture Failed!'); // For demonstration
        setIsCapturing(false); // Reset for re-capture
        progress.setValue(0); // Reset progress
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 1 of 3</Text>
          <Text style={styles.title}>Facial Recognition Capturing</Text>
          <Text style={styles.subtitle}>
            Position your face within the frame and remain still during the capture process.
          </Text>
        </View>

        {/* Face Frame */}
        <View style={styles.captureArea}>
          <View style={[styles.faceFrame, isCapturing && styles.capturingFrame]}>
            {/* Wrapper View to handle image clipping */}
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1613689036037-98c86d519b42?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDg0fHx8ZW58MHx8fHx8' }}
                resizeMode="cover" // Changed to cover
                style={styles.faceImage}
              />
            </View>
          </View>
          
          {isCapturing && (
            <View style={styles.progressContainer}>
              <Text style={styles.capturingText}>Scanning your face</Text>
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
            Make sure your face is well-lit and clearly visible in the frame.
          </Text>
        </View>

        {/* Button */}
        {!isCapturing && (
          <TouchableOpacity style={styles.captureButton} onPress={startFacialCapturing}>
            <Text style={styles.captureButtonText}>Start Facial Capturing</Text>
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
  captureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 280,
    height: 350,
    borderWidth: 3,
    borderColor: '#10b981',
    borderRadius: 140, // This applies to the border and background of the frame
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  capturingFrame: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  // New style for image wrapper
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 140, // Apply the same border radius here
    overflow: 'hidden', // Crucial for clipping the image
  },
  faceImage: {
    width: '100%',
    height: '100%',
    // zIndex: 1, // Not strictly necessary here, but doesn't hurt
  },
  progressContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  capturingText: {
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

export default FacialRecognitionScreen;
