import React, {useState} from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {RootState} from './store/reducer';
import Orders from './pages/Orders';
import Delivery from './pages/Delivery';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useAppDispatch} from './store';
import userSlice from './slices/userSlice';
import {userCollection} from './firebase/users';
import SplashScreen from 'react-native-splash-screen';
import {LoggedInParamList} from '../App';
import messaging from '@react-native-firebase/messaging';
import pushNoti from '../pushNoti';
import usePermissions from './hooks/usePermission';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppInner = () => {
  const isLoggedIn = useSelector((state: RootState) => {
    return !!state.user.email;
  });

  // const isLoggedIn = false;
  const dispatch = useAppDispatch();

  // messaging().setBackgroundMessageHandler(async msg => {
  //   console.log('background');
  //   console.log(msg);
  //   //아래꺼 쓰면 알림이 2개 날라옴
  //   //pushNoti.displayNoti(msg);
  // });

  useEffect(() => {
    const getTokenRefresh = async () => {
      try {
        //앱을 키면 token가져옴
        const token = await AsyncStorage.getItem('tokenData');
        console.log('token = ' + token);
        //토근 없으면
        if (!token) {
          SplashScreen.hide();
          return;
        }
        //토근 있으면

        console.log(JSON.parse(token));
        dispatch(
          userSlice.actions.setUser({
            email: JSON.parse(token).email,
            deviceToken: JSON.parse(token).deviceToken,
          }),
        );
        console.log('email store에 넣기 완료');

        //유효기간 만료됐으면 로그아웃시키고 store, device 다 지우기
        //firebase exp 문서 좀 읽어보기
      } catch (error) {
        console.log(error);
        Alert.alert('알림', '다시 로그인해주세요');
      } finally {
        SplashScreen.hide();
      }
    };

    getTokenRefresh();
  }, [dispatch]);

  usePermissions();

  // 아래 로직들은 메세지 알림 코드이다.
  //  SignIn.tsx에 있는 PushNotification.configure()과 다른 방법
  // 2개 다 키면 아래 로직은 동작하지 않고 PushNotification만 잡는다.

  // messaging().setBackgroundMessageHandler(async msg => {
  //   console.log('background');
  //   console.log(msg);
  //   //아래꺼 쓰면 알림이 2개 날라옴
  //   //pushNoti.displayNoti(msg);
  // });
  // messaging().onNotificationOpenedApp(remoteMessage => {
  //   console.log('notification123123');
  //   console.log(remoteMessage);
  // });

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //     // let content = remoteMessage.notification?.body;
  //     // Alert.alert(
  //     //   JSON.stringify(remoteMessage.notification?.title),
  //     //   JSON.stringify(remoteMessage),
  //     // );
  //     console.log(remoteMessage);
  //     pushNoti.displayNoti(remoteMessage);
  //   });

  //   // notifee.onForegroundEvent(remoteMessage => {
  //   //   console.log('onNotificationOpendApp');
  //   //   console.log(remoteMessage);
  //   // });

  //   return unsubscribe;
  // }, []);
  //////////////////////////////

  return (
    <>
      {/* <NavigationContainer> */}
      {isLoggedIn ? (
        // <Tab.Navigator>
        //   <Tab.Screen
        //     name="Orders"
        //     component={Orders}
        //     options={{title: '오더 목록'}}
        //   />
        //   <Tab.Screen
        //     name="Delivery"
        //     component={Delivery}
        //     options={{headerShown: false}}
        //   />
        //   <Tab.Screen
        //     name="Settings"
        //     component={Settings}
        //     options={{title: '내 정보'}}
        //   />
        // </Tab.Navigator>
        <Stack.Navigator>
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{title: '내정보'}}
          />
          <Stack.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더'}}
          />
          <Stack.Screen
            name="Delivery"
            component={Delivery}
            options={{title: '배달'}}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
          <Stack.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더'}}
          />
          <Stack.Screen
            name="Delivery"
            component={Delivery}
            options={{title: '배달'}}
          />
        </Stack.Navigator>
      )}
      {/* </NavigationContainer> */}
    </>
  );
};

export default AppInner;
