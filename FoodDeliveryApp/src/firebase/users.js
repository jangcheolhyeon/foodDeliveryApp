import firestore from '@react-native-firebase/firestore';

export const userCollection = firestore().collection('users');

export function createUser({id, email, name}) {
  return userCollection.doc(id).set({
    id,
    email,
    name,
  });
}

export async function getUser(id) {
  const doc = await userCollection.doc(id).get();
  return doc.data();
}
