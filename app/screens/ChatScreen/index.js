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
import {View} from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import {db, auth} from '../../firebase';
import {useSelector} from 'react-redux';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
const ChatScreen = props => {
  const userEmail = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.emailId,
  );
  const [messages, setMessages] = useState([]);

  // Initialize Firestore
  const firestore = getFirestore();

  // Create the "chats" collection if it doesn't exist
  //   useEffect(() => {
  //     const createChatsCollection = async () => {
  //       const chatsCollectionRef = collection(firestore, 'chats');
  //       const chatsCollectionDoc = doc(
  //         firestore,
  //         'chats',
  //         'collectionPlaceholder',
  //       );

  //       try {
  //         // Attempt to create the collection (it won't create if it already exists)
  //         await setDoc(chatsCollectionDoc, {});
  //       } catch (error) {
  //         console.log('Error creating "chats" collection:', error);
  //       }
  //     };

  //     createChatsCollection();
  //   }, [firestore]);

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
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        })),
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(
    (messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      const receiverUserId = 't08YcgmaxghavKpZCFX3lBqstjx1';
      const {_id, createdAt, text, user} = messages[0];
      addDoc(collection(db, 'chats'), {
        _id,
        createdAt,
        text,
        user,
      });
      firestore()
        .collection('THREADS')
        .doc(receiverUserId)
        .collection('MESSAGES');
    },
    [firestore],
  );

  return (
    <View style={Styles.container}>
      <DashboardHeader navigation={props.navigation} headerText={'Dashboard'} />
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: auth?.currentUser?.uid,
          email: auth?.currentUser?.email,
          name: 'yopmail',
        }}
      />
    </View>
  );
};

export default ChatScreen;
