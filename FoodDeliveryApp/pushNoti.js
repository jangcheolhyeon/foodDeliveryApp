import {AppState} from 'react-native';
import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';

//알림 받으면 위에 배너처럼 뜨도록 만드는 코드
const displayNotification = async message => {
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: 'default channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_launcher', //
    },
  });
  console.log('pushNoti exe');
};

export default {
  displayNoti: remoteMessage => displayNotification(remoteMessage),
};
