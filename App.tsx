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
import Header from './components/header';

const Stack = createStackNavigator();

const screens = [
  { name: 'Splash', component: SplashScreen, auth: true },
  { name: 'Logo', component: LogoScreen, auth: true },
  { name: 'SignUp', component: SignUpScreen, auth: true },
  { name: 'SignIn', component: SignInScreen, auth: true },
  { name: 'OTPVerification', component: OTPVerificationScreen, auth: true },
  { name: 'FacialRecognition', component: FacialRecognitionScreen, auth: true },
  { name: 'FacialCaptureSuccess', component: FacialCaptureSuccessScreen, auth: true },
  { name: 'FacialCaptureFailed', component: FacialCaptureFailedScreen, auth: true },
  { name: 'FingerprintCapture', component: FingerprintCaptureScreen, auth: true },
  { name: 'FingerprintSuccess', component: FingerprintSuccessScreen, auth: true },
  { name: 'FingerprintFailed', component: FingerprintFailedScreen, auth: true },
  { name: 'CreatePin', component: CreatePinScreen, auth: true },
  { name: 'SetPin', component: SetPinScreen, auth: true },
  { name: 'PinCreatedSuccess', component: PinCreatedSuccessScreen, auth: true },
  { name: 'Dashboard', component: TabNavigator},
  { name: 'AttendanceSession', component: AttendanceSessionScreen },
  { name: 'AttendanceInProgress', component: AttendanceInProgressScreen },
];

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {screens.map(({ name, component, auth }) => (
          <Stack.Screen
            key={name}
            name={name}
            children={props => (
              <>
                {!auth && <Header />}
                {React.createElement(component, props)}
              </>
            )}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
