/**
 * @format
 */

import {AppRegistry, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import pushNoti from './pushNoti';
import notifee from '@notifee/react-native';

// messaging().setBackgroundMessageHandler(async msg => {
//   console.log('background');
//   console.log(msg);
//   //아래꺼 쓰면 알림이 2개 날라옴
//   //pushNoti.displayNoti(msg);
// });

// notifee.onBackgroundEvent(msg => {
//   console.log('backgorund notifiee');
//   console.log(msg);
// });

// messaging().onNotificationOpenedApp(remoteMessage => {
//   console.log('notification123123');
//   console.log(remoteMessage);
// });

// messaging().getInitialNotification(remoteMessage => {
//   console.log('notification352554645');
//   console.log(remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);
