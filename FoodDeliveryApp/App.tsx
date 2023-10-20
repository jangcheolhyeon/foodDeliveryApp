import * as React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect} from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
import AppInner from './src/AppInner';
import messaging from '@react-native-firebase/messaging';
import pushNoti from './pushNoti';
import notifee from '@notifee/react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {NavigationContainer} from '@react-navigation/native';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type allParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Orders: undefined;
  Settings: undefined;
  Delivery: {urlLocation: string; deviceToken: string};
  Complete: {orderId: string};
};

function App() {
  return (
    <Provider store={store}>
      {/* NavigationContainer */}
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
