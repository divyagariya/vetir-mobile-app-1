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
  update,
  setDoc,
} from '@firebase/firestore';
import {
  getDatabase,
  ref,
  orderByChild,
  onValue,
  child,
  get,
} from 'firebase/database';
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
import Toast from 'react-native-simple-toast';
import {normalize} from '../../utils/normalise';

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

  // useLayoutEffect(() => {
  //   const chatId = generateChatId(
  //     isStylistUser ? personalStylistId : clientUserId,
  //     receiverDetails?.userId,
  //   );

  //   const firebaseConfig = {
  //     apiKey: 'AIzaSyA0mcU5B7BIJ4_XNfv5Gc7Q8ra7TULZmoU',
  //     authDomain: 'vetir-112233.firebaseapp.com',
  //     projectId: 'vetir-112233',
  //     storageBucket: 'vetir-112233.appspot.com',
  //     messagingSenderId: '185367964920',
  //     appId: '1:185367964920:ios:d4bf19861684b03d795f0d',
  //     measurementId: 'G-NZ8K8PP3KD"', // optional
  //   };

  //   const app = initializeApp(firebaseConfig);
  //   const dbase = getDatabase(app);
  //   const chatMessagesRef = ref(dbase, `chats/${chatId}/messages`);

  //   const loadData = async () => {
  //     try {
  //       const snapshot = await get(
  //         query(chatMessagesRef, orderByChild('createdAt')),
  //       );
  //       if (snapshot.exists()) {
  //         const updatedMessages = [];
  //         snapshot.forEach(childSnapshot => {
  //           const messageData = {
  //             _id: childSnapshot.key, // Assuming the message ID is the key
  //             createdAt: new Date(childSnapshot.child('createdAt').val()), // Convert createdAt to Date
  //             text: childSnapshot.child('text').val(),
  //             user: childSnapshot.child('user').val(),
  //             image: childSnapshot.child('image').val(),
  //             sent: childSnapshot.child('sent').val(),
  //             received: childSnapshot.child('received').val(),
  //           };

  //           // Update the 'received' status if it's the recipient's message
  //           if (
  //             messageData.user._id !== clientUserId &&
  //             !messageData.received
  //           ) {
  //             update(ref(chatMessagesRef, `${messageData._id}/received`), true);
  //             messageData.received = true; // Update the local message data
  //           }

  //           updatedMessages.push(messageData);
  //         });

  //         // Set the updated messages
  //         setMessages(updatedMessages);
  //         // Set loadingMessages to false when messages are loaded
  //         setLoadingMessages(false);
  //       }
  //     } catch (error) {
  //       console.error('Error loading data:', error);
  //     }
  //   };

  //   loadData();

  //   return () => {
  //     // Clean up resources if needed
  //   };
  // }, [clientUserId, isStylistUser, personalStylistId, receiverDetails?.userId]);

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

  const onSendImage = ref => {
    let imageURL = {};
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      console.log('prag', image);
      const imagePath = `data:image/jpeg;base64,${image.data}`;
      const dataToSend = {
        base64MediaString: imagePath,
        ...(isStylistUser
          ? {personalStylistId: personalStylistId}
          : {userId: clientUserId}),
      };
      fetch(
        'https://se53mwfvog.execute-api.ap-south-1.amazonaws.com/dev/api/uploadChatMedia',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        },
      )
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(responseData => {
          imageURL = responseData?.data?.imageUrl;
          if (ref) {
            ref.onSend(
              {
                image: imageURL,
              },
              true,
            );
          }
        })
        .catch(error => {
          Toast.show('There is some error in image upload');
          console.error('API error:', error);
        });
    });
  };

  const renderActions = ref => {
    return (
      <TouchableOpacity
        style={Styles.sendIcon}
        activeOpacity={1}
        onPress={() => onSendImage(ref)}>
        <Image
          source={require('../../assets/gallery.webp')}
          resizeMethod="resize"
          resizeMode="contain"
          style={Styles.sendIcon}
        />
      </TouchableOpacity>
    );
  };

  const renderMessageImage = (props, index) => {
    let {currentMessage} = props;
    console.log('index', index);
    return (
      <TouchableOpacity
        onPress={() => {
          openImageModal(index - 1);
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

  const onImageIndexChange = index => {
    setSelectedImageIndex(index);
  };

  const ImageModal = () => {
    const images = messages
      .filter(message => message.image) // Filter out messages without images
      .map(message => ({
        url: message.image,
      }));
    return (
      <Modal
        avoidKeyboard
        animationInTiming={500}
        animationOutTiming={600}
        style={Styles.modalView}
        onBackdropPress={closeModal}
        visible={isModalVisible}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={Styles.crossBtn}
            onPress={() => setModalVisible(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={Styles.crossIcon}
            />
          </TouchableOpacity>
          <Text style={Styles.previewCountText}>{`${selectedImageIndex + 1}/${
            images.length
          }`}</Text>
          <ImageViewer
            enableImageZoom
            useNativeDriver
            saveToLocalByLongPress
            // menuContext={{saveToLocal: '保存到本地相册', cancel: '取消'}}
            imageUrls={images}
            index={selectedImageIndex}
            backgroundColor={'transparent'}
            enableSwipeDown={true}
            onSwipeDown={() => setModalVisible(false)}
            onChange={onImageIndexChange}
            renderIndicator={() => null} // Hide the indicator (optional)
          />
        </View>
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
    console.warn('index', index);
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const renderCustomView = () => {};

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
            renderMessageImage={props =>
              renderMessageImage(props, messages.indexOf(props.currentMessage))
            }
            renderUsernameOnMessage
            renderChatEmpty={renderChatEmpty}
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
            //         marginBottom: 5,
            //         width: 30,
            //         height: 30,
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
