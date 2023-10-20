import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import {LoggedInParamList, RootStackParamList, allParamList} from '../../App';
import {signIn} from '../firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useAppDispatch} from '../store';
import userSlice from '../slices/userSlice';
import {firebase} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import pushNoti from '../../pushNoti';
import notifee from '@notifee/react-native';
import usePermissions from '../hooks/usePermission';

// type SignInScreenProps = NativeStackScreenProps<RootStackParamList>;
type SignInScreenProps = NativeStackScreenProps<allParamList>;

function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [loading, setLoading] = useState(false);
  // returnType으로 next를 만든걸 누르면 안드에서는 커서가 비밀번호 칸으로 안넘어감
  // 그래서 직접 이동하도록 코딩할때 쓰는 useRef
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const usersCollection = firestore().collection('users');
  const dispatch = useAppDispatch();
  let userDeviceInfo = '';

  const onSubmit = useCallback(async () => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }

    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요');
    }
    console.log('submit');
    console.log(userDeviceInfo);
    try {
      //일단 잠시 문자열을 통해 로그인할 수 있도록 설정함
      if (email === 'email1' && password === 'password1') {
        AsyncStorage.setItem(
          'tokenData',
          JSON.stringify({
            email: email,
            deviceToken: userDeviceInfo,
          }),
        );

        dispatch(
          userSlice.actions.setUser({
            email: email,
            deviceToken: userDeviceInfo,
          }),
        );
      }

      //서버로 로그인 검증
      let getServerData = await axios.post(
        // `http://172.17.16.169:8080/bumilBoard/testtest.do`,
        `http://10.0.2.2:8080/bumilBoard/testtest.do`,
        {
          email: email,
          password: password,
        },
      );
      console.log(getServerData.data);

      //로그인 성공시
      if (getServerData.data === 'ok') {
        //디바이스에 저장
        AsyncStorage.setItem(
          'tokenData',
          JSON.stringify({
            email: email,
            deviceToken: userDeviceInfo,
          }),
        );

        //redux store에 저장
        dispatch(
          userSlice.actions.setUser({
            email: email,
            deviceToken: userDeviceInfo,
          }),
        );
      }

      Alert.alert('알림', '로그인 되었습니다.');
    } catch (error) {
      console.log(error);
      Alert.alert('알림', '로그인에 실패했습니다.');
    }
  }, [email, password, dispatch, usersCollection]);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);

  const canGoNext = email && password;

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  //////////////////////////
  useEffect(() => {
    // 디바이스 토큰 값
    const requestUserPermission = async () => {
      //알림 권한 체크
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('if enabled');
        return getToken();
      }
    };

    requestUserPermission();

    //아래 코드는 push 알림 다른방법을 사용하는 것
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //   // let content = remoteMessage.notification?.body;
    //   // Alert.alert(
    //   //   JSON.stringify(remoteMessage.notification?.title),
    //   //   JSON.stringify(remoteMessage),
    //   // );
    //   console.log(remoteMessage);
    //   pushNoti.displayNoti(remoteMessage);
    // });

    // // notifee.onForegroundEvent(remoteMessage => {
    // //   console.log('onNotificationOpendApp');
    // //   console.log(remoteMessage);
    // // });

    // return unsubscribe;
  }, []);

  //---------------------------------------------------------------

  //알림을 감지해서 실행되는 함수
  PushNotification.configure({
    // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
    onRegister: function (token: any) {
      console.log('TOKEN:', token);
      //setUserDevice(token);
      userDeviceInfo = token;
    },

    // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
    onNotification: async function (notification: any) {
      console.log('NOTIFICATION:', notification);
      // 알림 보냈을때 한번 호출되고 알림 클릭했을때 한번 더 호출됨
      // userInteraction이 false인 경우는 보냈을때 true는 noti 클릭했을때
      if (notification.userInteraction) {
        console.log('click');
        console.log(notification.data);
        console.log(userDeviceInfo);
        const token = await AsyncStorage.getItem('tokenData');
        userDeviceInfo = JSON.parse(token).deviceToken;
        console.log('token == =');
        console.log(token);
        console.log(userDeviceInfo);

        //현재 로컬주소로 연결해놨다.
        navigation.navigate('Delivery', {
          //urlLocation: 'https://msp.bumil.co.kr/',
          //urlLocation: 'http://10.0.2.2:8080/bumilBoard',
          // urlLocation: 'http://10.0.2.2:8080/hello2',
          urlLocation: 'http://10.0.2.2:8080/bumilBoard/testLoginInit1.do',
          deviceToken: userDeviceInfo,
          //urlLocation: 'https://www.naver.com',
        });
        console.log('delivery 로 이동');
      }

      if (notification.channelId === 'riders') {
        // if (notification.message || notification.data.message) {
        //   store.dispatch(
        //     userSlice.actions.showPushPopup(
        //       notification.message || notification.data.message,
        //     ),
        //   );
        // }
        console.log('notification riders');
      }
      // process the notification

      // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
    onAction: function (notification: any) {
      console.log('ACTION:', notification.action);
      console.log('NOTIFICATION:', notification);

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err: Error) {
      console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });

  //알림 채널 만들기
  PushNotification.createChannel(
    {
      channelId: 'riders', // (required)
      channelName: '앱 전반', // (required)
      channelDescription: '앱 실행하는 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`createChannel riders returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.createChannel(
    {
      channelId: 'noti', // (required)
      channelName: '공지사항', // (required)
      channelDescription: '앱 실행하는 알림', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: boolean) =>
      console.log(`createChannel riders returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  //파이어베이스에서 토큰 가져옴(여기에 있는 fcmToken으로 특정 디바이스에 메세지 보냄)
  const getToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('firebase 메세지 토큰값');
    console.log(fcmToken);

    // await AsyncStorage.setItem(
    //   'tokenData',
    //   JSON.stringify({
    //     //email: email,
    //     deviceToken: fcmToken,
    //   }),
    // );

    // dispatch(
    //   userSlice.actions.setUser({
    //     //email: email,
    //     deviceToken: fcmToken,
    //   }),
    // );
  };

  return (
    <>
      <View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            placeholder="이메일을 입력해주세요"
            onChangeText={onChangeEmail}
            //밑에는 삼성패스, 지문인식, 페이스 등등으로 자동 로그인 시키는 것들 세트
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            //emailAddress는 키보드에 @를 넣을 수 있는거 추가 됨
            keyboardType="email-address"
            // 키보드 맨 우측 하단에 있는 체크모양 바꾸는거
            returnKeyType="next"
            //엔터나 returnType='next'로 바꾼 거 눌렀을때 커서가 다음으로 이동하는거
            onSubmitEditing={() => {
              passwordRef.current?.focus(); // 밑에 passwordRef로 연결해놓은걸로 focus
            }}
            //키보드 내려가는거 막는거
            blurOnSubmit={false}
            ref={emailRef}
            //아이폰에서만 되는건데 이메일 입력하면 우측에 x표 뜨는데 한번에 삭제하는거
            //clearButtonMode="white-editing"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="비밀번호를 입력해주세요"
            onChangeText={onChangePassword}
            // 비밀번호 가려주느거
            secureTextEntry
            // 밑에는 삼성패스, 지문인식, 페이스 등등으로 자동 로그인 시키는 것들 세트
            // 리액트에서 문자 인증 같은거 다 지원됨
            importantForAutofill="yes"
            autoComplete="password"
            textContentType="password"
            //비밀번호 입력하고 키보드 내리고 로그인버튼 누르기 귀찮으니까 엔터쳤을때 onSubmit이 실행되도록 하는거
            onSubmitEditing={onSubmit}
            ref={passwordRef}
          />
        </View>

        <View style={styles.buttonZone}>
          <Pressable
            onPress={onSubmit}
            style={
              !canGoNext //!email || !password
                ? styles.loginButton
                : [styles.loginButton, styles.loginButtonActive] // StyleSheet.compose(style.loginButton, styles.loginButtonActive)
            }
            disabled={!canGoNext} //disabled={!email || !password}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>

          <Pressable onPress={toSignUp}>
            <Text>회원가입 버튼</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },

  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },

  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },

  loginButtonActive: {
    backgroundColor: 'blue',
  },

  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonZone: {
    alignItems: 'center',
  },
});
export default SignIn;
