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
import {normalize} from '../../utils/normalise';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import {getPreSignedUrl, uploadMediaOnS3} from './common';
import RNFetchBlob from 'react-native-blob-util';

const ChatScreen = props => {
  const giftedChatRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // To keep track of the currently displayed image
  const [myRef, setMyRef] = useState(null);

  const {receiverDetails, selectedProductData, comingFromProduct} =
    props?.route?.params || {};
  const [firstTime, setFirstTime] = useState(true);
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

  const showActionSheet = ref => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Gallery', 'Camera', 'Video Recorder', 'Cancel'],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 3,
        title: 'Pick the media',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onSendImage(buttonIndex, ref);
          // delete action
        } else if (buttonIndex === 1) {
          onSendImage(buttonIndex, ref);
          // share action
        } else if (buttonIndex === 2) {
          onSendImage(buttonIndex, ref);
          // share action
        }
      },
    );
  };

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
            video: doc.data().video,
            received: doc.data().received,
          };
        }),
      );
      setLoadingMessages(false);
      setMyRef(giftedChatRef);
    });
    // sendItem();

    return () => unsubscribe();
  }, [
    clientUserId,
    comingFromProduct,
    firstTime,
    isStylistUser,
    myRef,
    personalStylistId,
    receiverDetails?.userId,
  ]);

  useEffect(() => {
    if (firstTime && myRef?.current && comingFromProduct) {
      myRef.current.onSend(
        {
          image: selectedProductData?.imageUrls[0],
        },
        true,
      );
      setFirstTime(false);
    }
  }, [
    comingFromProduct,
    firstTime,
    myRef,
    selectedProductData?.imageUrls,
    setMyRef,
  ]);

  // useEffect(() => {
  //   console.log('giftedChatRef', giftedChatRef);
  //   debugger;
  //   if (giftedChatRef.current && firstTime && comingFromProduct) {
  //     giftedChatRef.current.onSend(
  //       {
  //         image: selectedProductData?.imageUrls[0],
  //       },
  //       true,
  //     );
  //     setFirstTime(false);
  //   }
  // }, [
  //   comingFromProduct,
  //   firstTime,
  //   loadingMessages,
  //   selectedProductData?.imageUrls,
  // ]);

  // const sendItem = () => {
  //   if (giftedChatRef.current) {
  //     giftedChatRef.current.onSend(
  //       {
  //         image:
  //           'https://englishtribuneimages.blob.core.windows.net/gallary-content/2023/9/2023_9$largeimg_1308416977.jpg',
  //       },
  //       true,
  //     );
  //   }
  // };

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
      const {_id, createdAt, text, user, image, video} = messages[0];
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
          } else if (message.video) {
            // Handle image messages
            await addDoc(collection(db, 'chats', chatId, 'messages'), {
              _id: _id,
              createdAt: createdAt,
              video: video, // Store the image URL or data
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

  const renderMessageVideo = props => {
    if (props?.currentMessage.video) {
      return (
        <>
          <Video
            resizeMode="cover"
            playInBackground
            paused={true}
            source={{uri: props.currentMessage.video}}
            style={{
              width: normalize(200),
              height: normalize(200),
              borderRadius: 10,
            }}
            controls={true}
            onError={error => console.error('Video error:', error)}
          />
        </>
      );
    }
    return null;
  };

  const onSendImage = (index, ref) => {
    let imageURL = {};
    if (index === 0) {
      ImagePicker.openPicker({
        mediaType: 'any',
        width: 300,
        height: 400,
        compressVideoPreset: 'MediumQuality',
        includeBase64: true,
      }).then(media => {
        let dataToSend = {};
        if (media.mime && (media.data || media.path)) {
          //Upload image
          if (media.mime.startsWith('image')) {
            const imagePath = `data:${media.mime};base64,${media.data}`;
            dataToSend = {
              base64MediaString: imagePath,
              ...(isStylistUser
                ? {personalStylistId: personalStylistId}
                : {userId: clientUserId}),
            };

            uploadMediaOnS3(dataToSend, imageURL, ref);
          } else if (media.mime.startsWith('video')) {
            if (ref) {
              ref.onSend(
                {
                  video:
                    'https://assets.mixkit.co/videos/download/mixkit-countryside-meadow-4075.mp4',
                },
                true,
              );
            }
            // Handle video
            // const videoPath = `data:${media.mime};base64,${media.path}`;
            // dataToSend = {
            //   base64MediaString: videoPath,
            //   ...(isStylistUser
            //     ? {personalStylistId: personalStylistId}
            //     : {userId: clientUserId}),
            // };
            // Rest of your video handling code
            // ...
          }
        }
      });
    } else if (index === 1) {
      ImagePicker.openCamera({
        mediaType: 'any',
        width: 300,
        height: 400,
        includeBase64: true,
      })
        .then(media => {
          let dataToSend = {};
          if (media.mime && (media.data || media.path)) {
            //Upload image
            if (media.mime.startsWith('image')) {
              const imagePath = `data:${media.mime};base64,${media.data}`;
              dataToSend = {
                base64MediaString: imagePath,
                ...(isStylistUser
                  ? {personalStylistId: personalStylistId}
                  : {userId: clientUserId}),
              };
              uploadMediaOnS3(dataToSend, imageURL, ref);
            }
          }
        })
        .catch(error => {
          console.log('Error in openCamera:', error);
        });
    } else if (index === 2) {
      ImagePicker.openCamera({
        mediaType: 'video',
        videoQuality: 'medium',
        // compressVideoPreset: 'MediumQuality',
      })
        .then(media => {
          let dataToSend = {};
          if (media.mime && (media.data || media.path)) {
            if (media.mime.startsWith('video')) {
              let s3UploadUrl = getPreSignedUrl({
                id: isStylistUser ? personalStylistId : clientUserId,
                type: isStylistUser ? 'personalStylistId' : 'userId'
              })
              console.log('s3UploadUrl', s3UploadUrl)
              RNFetchBlob.fetch(
                'PUT',
                s3UploadUrl,
                {
                  'Content-Type': undefined,
                },
                RNFetchBlob.wrap(media.path),
              ).then(m => {
                console.log('upload finish')
                if(ref) {
                  ref.onSend({ video: media.path }, true)
                }
             }).catch(error => {
              console.log('upload error', error)
             })
              // Handle video
              // const videoPath = `data:${media.mime};base64,${media.path}`;
              // dataToSend = {
              //   base64MediaString: videoPath,
              //   ...(isStylistUser
              //     ? {personalStylistId: personalStylistId}
              //     : {userId: clientUserId}),
              // };
              // Rest of your video handling code
              // ...
            }
          }
        })
        .catch(error => {
          console.log('Error in openCamera:', error);
        });
    }
  };

  const renderActions = ref => {
    return (
      <TouchableOpacity
        style={Styles.sendIcon}
        activeOpacity={1}
        onPress={() => {
          showActionSheet(ref);
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
    let {currentMessage} = props;
    const imageUrl = currentMessage.image;

    const images = messages
      .filter(message => message.image) // Filter out messages without images
      .map(message => ({
        url: message.image,
      }));
    const imageIndex = images.findIndex(image => image.url === imageUrl);
    return (
      <TouchableOpacity
        onPress={() => {
          openImageModal(imageIndex);
        }}>
        <FastImage
          prefetch={{uri: currentMessage.image}}
          style={Styles.messageImage}
          source={{
            uri: currentMessage.image,
            priority: FastImage.priority.high,
          }}
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
          <ActivityIndicator size="small" color="grey" />
        </View>
      ) : (
        // Display a loader while messages are being fetched
        <View style={{flex: 0.97}}>
          <GiftedChat
            ref={giftedChatRef}
            messages={messages}
            alwaysShowSend
            // messageContainerRef={giftedChatRef}
            renderActions={ref => renderActions(ref)}
            // renderInputToolbar={props => <CustomInputToolbar {...props} />} // Use your custom input toolbar
            onSend={newMessages => onSend(newMessages)}
            textInputStyle={Styles.textInputStyle}
            minInputToolbarHeight={50}
            renderMessageImage={props => renderMessageImage(props)}
            renderMessageVideo={props => renderMessageVideo(props)}
            renderSend={props => (
              <Send {...props}>
                <Image
                  source={require('../../assets/chatSend.webp')}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </Send>
            )}
            user={{
              _id: isStylistUser ? personalStylistId : clientUserId,
              email: userEmail,
              name: userName,
              avatar: profilePic || '',
            }}
          />
          <ImageModal />
        </View>
      )}
    </View>
  );
};

export default ChatScreen;
