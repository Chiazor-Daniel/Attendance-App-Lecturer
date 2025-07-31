import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import LogoScreen from './screens/LogoScreen';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import FacialRecognitionScreen from './screens/FacialRecognitionScreen';
import FacialCaptureSuccessScreen from './screens/FacialCaptureSuccessScreen';
import FacialCaptureFailedScreen from './screens/FacialCaptureFailedScreen';
import FingerprintCaptureScreen from './screens/FingerprintCaptureScreen';
import FingerprintSuccessScreen from './screens/FingerprintSuccessScreen';
import FingerprintFailedScreen from './screens/FingerprintFailedScreen';
import CreatePinScreen from './screens/CreatePinScreen';
import SetPinScreen from './screens/SetPinScreen';
import PinCreatedSuccessScreen from './screens/PinCreatedSuccessScreen';
import TabNavigator from './navigation/TabNavigator';
import AttendanceSessionScreen from './screens/AttendanceSessionScreen';
import AttendanceInProgressScreen from './screens/AttendanceInProgressScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Logo" component={LogoScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="FacialRecognition" component={FacialRecognitionScreen} />
        <Stack.Screen name="FacialCaptureSuccess" component={FacialCaptureSuccessScreen} />
        <Stack.Screen name="FacialCaptureFailed" component={FacialCaptureFailedScreen} />
        <Stack.Screen name="FingerprintCapture" component={FingerprintCaptureScreen} />
        <Stack.Screen name="FingerprintSuccess" component={FingerprintSuccessScreen} />
        <Stack.Screen name="FingerprintFailed" component={FingerprintFailedScreen} />
        <Stack.Screen name="CreatePin" component={CreatePinScreen} />
        <Stack.Screen name="SetPin" component={SetPinScreen} />
        <Stack.Screen name="PinCreatedSuccess" component={PinCreatedSuccessScreen} />
        <Stack.Screen name="Dashboard" component={TabNavigator} />
        <Stack.Screen name="AttendanceSession" component={AttendanceSessionScreen} />
        <Stack.Screen name="AttendanceInProgress" component={AttendanceInProgressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}