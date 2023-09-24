import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
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
import {
  TouchableOpacity,
  ActionSheetIOS,
  View,
  Keyboard,
  ActivityIndicator,
  Text,
} from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import {db, auth} from '../../firebase';
import {useSelector} from 'react-redux';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {Image} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';

const ChatScreen = props => {
  const giftedChatRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // To keep track of the currently displayed image

  const {receiverDetails} = props?.route?.params || {};
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const userEmail = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.emailId,
  );
  const userName = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.name,
  );
  const profilePic = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.profilePicUrl,
  );
  const clientUserId = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.userId,
  );
  const personalStylistId = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.personalStylistId,
  );
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);

  useEffect(() => {
    signInWithEmailAndPassword(auth, userEmail, userEmail)
      .then(resp => {})
      .catch(error => {
        console.log('Firebase error', error);
      });
  }, [userEmail]);

  useLayoutEffect(() => {
    const chatId = generateChatId(
      isStylistUser ? personalStylistId : clientUserId,
      receiverDetails?.userId,
    );
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
            image: doc.data().image,
            sent: doc.data().sent,
            received: doc.data().received,
          };
        }),
      );
      // Set loadingMessages to false when messages are loaded
      setLoadingMessages(false);
    });
    return () => unsubscribe();
  }, [clientUserId, isStylistUser, personalStylistId, receiverDetails?.userId]);

  const generateChatId = (userId1, userId2) => {
    const sortedUserIds = [userId1, userId2];
    sortedUserIds.sort((a, b) => a.localeCompare(b)); // Sort user IDs lexicographically
    return `${sortedUserIds[0]}-${sortedUserIds[1]}`;
  };

  const onSend = useCallback(
    async (messages = []) => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      const {_id, createdAt, text, user, image} = messages[0];
      try {
        const chatId = generateChatId(
          isStylistUser ? personalStylistId : clientUserId,
          receiverDetails?.userId,
        );
        // Iterate through the messages to handle text and image messages separately
        for (const message of messages) {
          if (message.text) {
            // Handle text messages
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
              _id: _id,
              createdAt: createdAt,
              text: text,
              receiverDetails: receiverDetails,
              user: user,
              sent: true,
              received: '',
            });
          } else if (message.image) {
            // Handle image messages
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
              _id: _id,
              createdAt: createdAt,
              image: image, // Store the image URL or data
              receiverDetails: receiverDetails,
              user: user,
              sent: true,
              received: '',
            });
          }
        }
        // Create or update the chat in the inbox of both sender and receiver
        await setDoc(
          doc(
            db,
            'inbox',
            isStylistUser ? personalStylistId : clientUserId,
            'chats',
            chatId,
          ),
          {
            lastMessage: 'messageData',
            receiverId: receiverDetails?.userId,
          },
          {merge: true},
        );

        await setDoc(
          doc(db, 'inbox', receiverDetails?.userId, 'chats', chatId),
          {
            lastMessage: 'messageData',
            senderId: isStylistUser ? personalStylistId : clientUserId,
          },
          {merge: true},
        );
      } catch (error) {
        console.error('Error writing document: ', error);
      }
    },
    [clientUserId, isStylistUser, personalStylistId, receiverDetails],
  );

  const CustomInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 50,
          marginBottom: 10,
        }}
      />
    );
  };

  const renderActions = ref => {
    return (
      <TouchableOpacity
        style={Styles.sendIcon}
        activeOpacity={1}
        onPress={() => {
          ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
          }).then(img => {
            if (ref) {
              ref.onSend(
                {
                  image:
                    'https://englishtribuneimages.blob.core.windows.net/gallary-content/2023/9/2023_9$largeimg_1308416977.jpg',
                },
                true,
              );
            }
          });
        }}>
        <Image
          source={require('../../assets/gallery.webp')}
          resizeMethod="resize"
          resizeMode="contain"
          style={Styles.sendIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderMessageImage = props => {
    let {currentMessage, index} = props;
    return (
      <TouchableOpacity
        onPress={() => {
          // props.navigation.navigate('ImagePreview');
          openImageModal(index);
        }}>
        <Image
          style={Styles.messageImage}
          source={{uri: currentMessage.image}}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const ImageModal = () => {
    const images = messages
      .filter(message => message.image) // Filter out messages without images
      .map(message => ({
        url: message.image,
      }));
    console.warn('images', images);
    console.log('images', images);
    return (
      <Modal
        style={
          {
            // flex: 1,
            // backgroundColor: 'black',
            // flex: 1, // Semi-transparent background
            // justifyContent: 'center', // Center content vertically
            // alignItems: 'center', // Center content horizontally
          }
        }
        onBackdropPress={closeModal}
        visible={isModalVisible}
        // transparent={true}
      >
        <ImageViewer
          enableImageZoom
          useNativeDriver
          saveToLocalByLongPress
          // menuContext={{saveToLocal: '保存到本地相册', cancel: '取消'}}
          style={{flex: 1, width: '100%', borderRadius: 10}}
          imageUrls={images}
          index={selectedImageIndex}
          backgroundColor={'transparent'}
          enableSwipeDown={true}
          onSwipeDown={() => setModalVisible(false)}
          renderIndicator={() => null} // Hide the indicator (optional)
        />
      </Modal>
    );
  };

  const renderChatEmpty = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>No messages to display</Text>
    </View>
  );

  const openImageModal = index => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.headerContainer}>
        <DashboardHeader
          navigation={props.navigation}
          headerText={receiverDetails?.name}
        />
      </View>
      {loadingMessages ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      ) : (
        // Display a loader while messages are being fetched
        <>
          <GiftedChat
            {...props}
            textInputRef={giftedChatRef}
            // shouldUpdateMessage={() => {
            //   return true;
            // }}
            messages={messages}
            renderActions={ref => renderActions(ref)}
            alwaysShowSend
            // isTyping
            onSend={newMessages => onSend(newMessages)}
            // renderInputToolbar={props => <CustomInputToolbar {...props} />}
            // renderInputToolbar={props => <CustomInputToolbar {...props} />}
            textInputStyle={Styles.textInputStyle}
            minInputToolbarHeight={50}
            renderMessageImage={renderMessageImage}
            renderUsernameOnMessage
            // renderChatEmpty={renderChatEmpty}
            // renderActions={renderActions}
            // textInputProps={{
            //   height: 40,
            //   width: 208,
            // }}
            // renderSend={props => (
            //   <Send {...props}>
            //     <Image
            //       source={require('../../assets/chatSend.webp')}
            //       style={{
            //         width: 40,
            //         height: 40,
            //       }}
            //     />
            //   </Send>
            // )}
            user={{
              _id: isStylistUser ? personalStylistId : clientUserId,
              email: userEmail,
              name: userName,
              avatar: profilePic || '',
            }}
          />
          <ImageModal />
        </>
      )}
    </View>
  );
};

export default ChatScreen;
