import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  initializeFirestore,
  getFirestore,
  doc,
  setDoc,
} from '@firebase/firestore';
import {getAuth} from '@firebase/auth';
import {initializeApp} from 'firebase/app';
import {FlatList, View} from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import {db, auth} from '../../firebase';
import {useSelector} from 'react-redux';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
const InboxScreen = props => {
  const userEmail = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.emailId,
  );
  const userName = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.name,
  );
  const [messages, setMessages] = useState([]);

  // Initialize Firestore
  const firestore = getFirestore();

  //   useEffect(() => {
  //     (async () => {
  //       const database = getFirestore();
  //       const collectionRef = collection(database, 'chats');

  //       try {
  //         await setDoc(collectionRef, {
  //           name: 'chats',
  //         });
  //       } catch (error) {
  //         console.log('Error creating collection:', error);
  //       }
  //     })();
  //   }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // User is signed in
        console.log('User is signed in:', user);
      } else {
        // User is not signed in
        console.log('User is not signed in');
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    signInWithEmailAndPassword(auth, userEmail, userEmail)
      .then(resp => {
        console.log('signInWithEmailAndPassword', resp);
      })
      .catch(error => {
        console.log('Firebase error', error);
      });
  }, [userEmail]);

  useLayoutEffect(() => {
    const collectionRef = collection(db, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => {
          return {
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          };
        }),
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const receiverUserId = 't08YcgmaxghavKpZCFX3lBqstjx1';
    const {_id, createdAt, text, user} = messages[0];
    try {
      await addDoc(collection(db, 'chats'), {
        _id: _id,
        createdAt: createdAt,
        text: text,
        user: user,
      });
      console.log('Document successfully written!');
    } catch (error) {
      console.error('Error writing document: ', error);
    }
  }, []);

  // const onSend = async useCallback((messages = []) => {
  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   );
  //   const receiverUserId = 't08YcgmaxghavKpZCFX3lBqstjx1';
  //   const {_id, createdAt, text, user} = messages[0];
  //   // addDoc(collection(db, 'chats'), {
  //   //   _id: _id,
  //   //   createdAt: createdAt,
  //   //   text: text,
  //   //   user: user,
  //   // });
  //   try {
  //     await addDoc(collection(db, 'chats'), {
  //       _id: _id,
  //       createdAt: createdAt,
  //       text: text,
  //       user: user,
  //     });
  //     console.log('Document successfully written!');
  //   } catch (error) {
  //     console.error('Error writing document: ', error);
  //   }

  // }, []);

  return (
    <View style={Styles.container}>
      <DashboardHeader navigation={props.navigation} headerText={'Dashboard'} />
      <FlatList />
    </View>
  );
};

export default InboxScreen;
