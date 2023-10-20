import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {signOut} from '../firebase/auth';
import {useAppDispatch} from '../store';
import userSlice from '../slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Setting() {
  const dispatch = useAppDispatch();

  const onLogout = async () => {
    //firebase 로그아웃
    // signOut();

    // store에 제거
    dispatch(
      userSlice.actions.setUser({
        email: '',
        deviceToken: '',
      }),
    );

    //디바이스 token 삭제
    AsyncStorage.removeItem('tokenData');
  };
  const storeInfo = useSelector((state: RootState) => {
    return state.user;
  });

  console.log(storeInfo);

  return (
    <>
      <View style={styles.buttonZone}>
        <Pressable
          style={StyleSheet.compose(
            styles.loginButton,
            styles.loginButtonActive,
          )}
          onPress={onLogout}>
          <Text style={styles.loginButtonText}>로그아웃</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonZone: {
    alignItems: 'center',
    paddingTop: 20,
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
});

export default Setting;
