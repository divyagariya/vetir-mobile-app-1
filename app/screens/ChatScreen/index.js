import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  initializeFirestore,
  getFirestore,
  doc,
  getDocs,
  setDoc,
} from '@firebase/firestore';
import {getAuth} from '@firebase/auth';
import {initializeApp} from 'firebase/app';
import {TouchableOpacity, View} from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import {db, auth} from '../../firebase';
import {useSelector} from 'react-redux';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {Image} from 'react-native';
const ChatScreen = props => {
  const {receiverDetails} = props?.route?.params || {};
  const [messages, setMessages] = useState([]);
  const userEmail = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.emailId,
  );
  const userName = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.name,
  );

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
    const chatId = generateChatId();
    const chatMessagesRef = query(collection(db, 'chats', chatId, 'messages'));
    const q = query(chatMessagesRef, orderBy('createdAt', 'desc'));
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

  const generateChatId = (userId1, userId2) => {
    // Sort the user IDs to ensure consistency
    const sortedUserIds = [userId1, userId2].sort();
    return `${sortedUserIds[0]}-${sortedUserIds[1]}`;
  };

  const onSend = useCallback(
    async (messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      const {_id, createdAt, text, user} = messages[0];
      // const chatID = generateChatId(
      //   `${user?.name}_id`,
      //   receiverDetails?.userId,
      // );
      try {
        const chatId = generateChatId();
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          _id: _id,
          createdAt: createdAt,
          text: text,
          receiverDetails: receiverDetails,
          user: user,
        });
        // Create or update the chat in the inbox of both sender and receiver
        await setDoc(
          doc(db, 'inbox', _id, 'chats', chatId),
          {
            lastMessage: 'messageData',
            receiverId: receiverDetails?.userId,
          },
          {merge: true},
        );

        await setDoc(
          doc(db, 'inbox', receiverDetails?.userId, 'chats', chatId),
          {lastMessage: 'messageData', senderId: _id},
          {merge: true},
        );
      } catch (error) {
        console.error('Error writing document: ', error);
      }
    },
    [receiverDetails],
  );

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
  // const renderSend = () => {
  //   return (
  //     <TouchableOpacity activeOpacity={1} onPress={() => console.warn('ff')}>
  //       <Image
  //         source={require('../../assets/chatSend.webp')}
  //         resizeMethod="resize"
  //         resizeMode="contain"
  //         style={Styles.sendIcon}
  //       />
  //     </TouchableOpacity>
  //   );
  // };

  /**
   * function to render input toolbar
   */
  const renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{borderTopWidth: 0}}
        // primaryStyle={styles.toolBarPrimaryStyle}
      />
    );
  };

  // function renderSend(props) {
  //   return (
  //     <Send {...props}>
  //       <TouchableOpacity
  //         activeOpacity={1}
  //         onPress={newMessages => onSend(newMessages)}>
  //         <Image
  //           source={require('../../assets/chatSend.webp')}
  //           resizeMethod="resize"
  //           resizeMode="contain"
  //           style={Styles.sendIcon}
  //         />
  //       </TouchableOpacity>
  //     </Send>
  //   );
  // }

  // Custom InputToolbar component with a media button
  const CustomInputToolbar = props => {
    return (
      <InputToolbar {...props}>
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={require('../../assets/chat.webp')}
            style={{
              width: 40,
              height: 40,
            }}
          />
        </TouchableOpacity>
      </InputToolbar>
    );
  };

  const renderActions = () => {
    return (
      <TouchableOpacity
        style={Styles.sendIcon}
        activeOpacity={1}
        onPress={() => console.warn('fff')}>
        <Image
          source={require('../../assets/emoji.webp')}
          resizeMethod="resize"
          resizeMode="contain"
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.container}>
      <DashboardHeader navigation={props.navigation} headerText={'Dashboard'} />
      <GiftedChat
        messages={messages}
        alwaysShowSend
        keyboardShouldPersistTaps={'handled'}
        onSend={newMessages => onSend(newMessages)}
        // renderInputToolbar={renderInputToolbar}
        // renderInputToolbar={props => <CustomInputToolbar {...props} />}
        // textInputStyle={Styles.textInputStyle}
        minInputToolbarHeight={50}
        // renderActions={renderActions}
        textInputProps={{
          height: 40,
          width: 208,
        }}
        renderSend={props => (
          <Send {...props}>
            <Image
              source={require('../../assets/chatSend.webp')}
              style={{
                width: 40,
                height: 40,
              }}
            />
          </Send>
        )}
        user={{
          _id: auth?.currentUser?.uid,
          email: userEmail,
          name: userName,
        }}
      />
    </View>
  );
};

export default ChatScreen;
