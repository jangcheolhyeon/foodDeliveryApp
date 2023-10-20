import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import Ing from './Ing';
import Complete from './Complete';
import WebView from 'react-native-webview';
import {allParamList} from '../../App';
import CookieManager from '@react-native-cookies/cookies';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();

type DeliveryProps = NativeStackScreenProps<allParamList, 'Delivery'>;

function Delivery({route}: DeliveryProps) {
  // const deviceToken = useSelector((state: RootState) => {
  //   return state.user.deviceToken;
  // });
  //const dispatch = useDispatch();

  console.log(route);

  // const getToken = async () => {};

  const setCookie = async () => {
    try {
      // await CookieManager.set('http://10.0.2.2:8080/hello2', {
      //   name: 'deviceToken',
      //   // value: '2414asdf34t6sf34345345ffffr',
      //   value: route.params.deviceToken.token,
      //   path: 'http://10.0.2.2:8080/',
      //   domain: '10.0.2.2',
      // });

      // CookieManager.get('http://10.0.2.2:8080/bumilBoard').then(cookies => {
      //   console.log('CookieManager.get =>', cookies);
      // });

      //알림을 누르면 PushNotification을 통해 이 페이지로 이동됨
      //쿠키 매니저를 통해 저 주소로 token을 보냄
      await CookieManager.set(
        'http://10.0.2.2:8080/bumilBoard/testLoginInit1.do',
        {
          name: 'deviceToken',
          // value: '2414asdf34t6sf34345345ffffr',
          value: route.params.deviceToken.token,
          path: 'http://10.0.2.2:8080/bumilBoard/',
          domain: '10.0.2.2',
        },
      );

      // 쿠키매니저를 통해서 쿠키 값 가져오기 (쿠키값 잘 들어가는지 테스트용도로 넣었음)
      CookieManager.get('http://10.0.2.2:8080/bumilBoard').then(cookies => {
        console.log('CookieManager.get =>', cookies);
      });

      console.log('Cookie set successfully');
    } catch (error) {
      console.error('Failed to set cookie', error);
    } finally {
      console.log('setCookie 끝');
    }
  };

  useEffect(() => {
    setCookie();
    console.log('delivery 실행');
  }, []);
  // const debugging = `
  //    // Debug
  //    console = new Object();
  //    console.log = function(log) {
  //      window.webViewBridge.send("console", log);
  //    };
  //    console.debug = console.log;
  //    console.info = console.log;
  //    console.warn = console.log;
  //    console.error = console.log;
  //    `;

  return (
    // <Stack.Navigator initialRouteName="Ing">
    //   <Stack.Screen name="Ing" component={Ing} options={{headerShown: false}} />
    //   <Stack.Screen
    //     name="Complete"
    //     component={Complete}
    //     options={{headerShown: false}}
    //   />
    // </Stack.Navigator>
    <>
      <WebView
        source={{uri: route.params.urlLocation}}
        sharedCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </>
  );
}

export default Delivery;
