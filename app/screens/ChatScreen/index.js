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

    // const limitedQuery = limit(chatMessagesRef, 20);

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

  const renderMessageVideo = useCallback(props => {
    if (props?.currentMessage.video) {
      return (
        <>
          <Video
            resizeMode="contain"
            playInBackground
            paused={true}
            source={{uri: props.currentMessage.video}}
            style={{
              width: normalize(225),
              height: normalize(300),
              borderRadius: 10,
            }}
            controls={true}
            onError={error => console.error('Video error:', error)}
            fullscreen
            fullscreenOrientation="portrait"
          />
        </>
      );
    }
    return null;
  }, []);

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
        .then(async media => {
          let dataToSend = {};
          if (media.mime && (media.data || media.path)) {
            if (media.mime.startsWith('video')) {
              let s3UploadUrl = await getPreSignedUrl({
                id: isStylistUser ? personalStylistId : clientUserId,
                type: isStylistUser ? 'personalStylistId' : 'userId',
              });
              console.log('s3UploadUrl', s3UploadUrl);
              RNFetchBlob.fetch(
                'PUT',
                s3UploadUrl,
                {
                  'Content-Type': undefined,
                },
                RNFetchBlob.wrap(media.path),
              )
                .then(m => {
                  console.log('upload finish');
                  if (ref) {
                    ref.onSend({video: media.path}, true);
                  }
                })
                .catch(error => {
                  console.log('upload error', error);
                });
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

  const renderActions = useCallback(
    ref => {
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
    },
    [showActionSheet],
  );

  const renderMessageImage = useCallback(
    props => {
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
    },
    [messages],
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  const onImageIndexChange = index => {
    setSelectedImageIndex(index);
  };

  const ImageModal = useCallback(() => {
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
  }, [isModalVisible, selectedImageIndex, messages]);

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
            textInputProps={{autoCorrect: false}} // Disable autocorrect
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

export default React.memo(ChatScreen);
