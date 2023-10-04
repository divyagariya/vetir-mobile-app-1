import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import {GiftedChat, InputToolbar, Send, Bubble} from 'react-native-gifted-chat';
import Toast from 'react-native-simple-toast';

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  setDoc,
} from '@firebase/firestore';
import {
  TouchableOpacity,
  ActionSheetIOS,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import {db, auth} from '../../firebase';
import {useDispatch, useSelector} from 'react-redux';
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
import {FONTS_SIZES} from '../../fonts';
import {Colors} from '../../colors';
import {addDataInCloset, getClosetData} from '../../redux/actions/closetAction';
import {addOutfit} from '../../redux/actions/outfitActions';
import {getProductDetailsApi} from '../../redux/actions/homeActions';

const ChatScreen = props => {
  const giftedChatRef = useRef(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // To keep track of the currently displayed image
  const [myRef, setMyRef] = useState(null);

  const {receiverDetails, selectedProductData, comingFromProduct, isOutfit} =
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
  const dispatch = useDispatch();
  const addClosetResponse = useSelector(
    state => state.ClosetReducer.addClosetResponse,
  );
  const addOutfitReponse = useSelector(
    state => state.OutfitReducer.addOutfitReponse,
  );
  const productDetailResponse = useSelector(
    state => state.HomeReducer.productDetailResponse,
  );

  useEffect(() => {
    if (Object.keys(addClosetResponse).length) {
      if (addClosetResponse.statusCode == 200) {
        dispatch({type: 'ADD_TO_CLOSET', value: {}});
        Toast.show('Added to closet');
        dispatch(getClosetData());
      }
    }
  }, [addClosetResponse, dispatch]);

  useEffect(() => {
    if (Object.keys(addOutfitReponse).length) {
      dispatch({type: 'ADD_OUTFIT', value: {}});
      if (addOutfitReponse.statusCode === 200) {
        Toast.show('Outfit successfully created');
        // dispatch(getOutfitsList());
        // props.navigation.navigate('Outfit');
      } else {
      }
    }
  }, [addOutfitReponse, dispatch]);

  useEffect(() => {
    if (Object.keys(productDetailResponse).length) {
      props.navigation.navigate('ViewProduct', {
        data: productDetailResponse.productDetails,
      });
      dispatch({type: 'GET_PRODUCT_DETAILS', value: {}});
    }
  }, [dispatch, productDetailResponse, props.navigation]);

  useEffect(() => {
    signInWithEmailAndPassword(auth, userEmail, userEmail)
      .then(resp => {})
      .catch(error => {
        console.log('Firebase error', error);
      });
  }, [userEmail]);

  const showActionSheet = useCallback(
    (buttonIndex, ref) => {
      if (buttonIndex === 0) {
        onSendImage(buttonIndex, ref);
        // Gallery action
      } else if (buttonIndex === 1) {
        onSendImage(buttonIndex, ref);
        // Camera action
      } else if (buttonIndex === 2) {
        onSendImage(buttonIndex, ref);
        // Video Recorder action
      }
    },
    [onSendImage],
  );

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
            imageCaptionTitle: doc.data().imageCaptionTitle,
            imageCaptionSubTitle: doc.data().imageCaptionSubTitle,
            imageCaptionPrice: doc.data().imageCaptionPrice,
            isClosetItem: doc.data().isClosetItem,
            categoryId: doc.data().categoryId,
            subCategoryId: doc.data().subCategoryId,
            brandId: doc.data().brandId,
            season: doc.data().season,
            colorCode: doc.data().colorCode,
            itemImageUrl: doc.data().itemImageUrl,
            productId: doc.data().productId,
            isOutfit: doc.data().isOutfit,
            closetItemIds: doc.data().closetItemIds,
            outfitImageType: doc.data().outfitImageType,
            name: doc.data().name,
            description: doc.data().description,
            imageData: doc.data().imageData,
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
      console.log('selectedProductData', selectedProductData);
      myRef.current.onSend(
        {
          image: selectedProductData?.imageUrls[0],
          imageCaptionTitle: selectedProductData?.brandName,
          imageCaptionSubTitle: selectedProductData?.productName,
          ...(selectedProductData?.productPrice
            ? {imageCaptionPrice: selectedProductData?.productPrice.toString()}
            : {}),
          // imageCaptionPrice: selectedProductData?.productPrice.toString(),
          isClosetItem: false,
          categoryId: selectedProductData?.categoryId,
          subCategoryId: selectedProductData?.subCategoryId,
          brandId: selectedProductData?.brandId,
          ...(selectedProductData?.seasons
            ? {season: selectedProductData?.seasons}
            : {}),
          colorCode: selectedProductData?.productColorCode,
          ...(!isOutfit
            ? {itemImageUrl: selectedProductData?.imageUrls[0]}
            : undefined),
          isImageBase64: false,
          ...(selectedProductData?.productId
            ? {productId: selectedProductData?.productId}
            : {}),
          ...(isOutfit ? {isOutfit: isOutfit} : {}),
          ...(isOutfit
            ? {closetItemIds: selectedProductData?.closetItemIds}
            : {}),
          ...(isOutfit
            ? {outfitImageType: selectedProductData?.outfitImageType}
            : {}),
          ...(isOutfit ? {name: selectedProductData?.name} : {}),
          ...(isOutfit ? {description: selectedProductData?.description} : {}),
          // ...(isOutfit ? {seasons: selectedProductData?.seasons} : {}),
          ...(isOutfit ? {imageData: selectedProductData?.imageData} : {}),
        },
        true,
      );
      setFirstTime(false);
    }
  }, [
    comingFromProduct,
    firstTime,
    isOutfit,
    myRef,
    selectedProductData,
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
      const {
        _id,
        createdAt,
        text,
        user,
        image,
        video,
        imageCaptionTitle,
        imageCaptionPrice,
        imageCaptionSubTitle,
        categoryId,
        brandId,
        subCategoryId,
        season,
        colorCode,
        itemImageUrl,
        productId,
        isOutfit,
        closetItemIds,
        outfitImageType,
        name,
        description,
        seasons,
        imageData,
      } = messages[0];
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
              _id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
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
              isClosetItem: false,
              received: '',
              ...(imageCaptionTitle
                ? {imageCaptionTitle: imageCaptionTitle}
                : undefined),
              ...(imageCaptionPrice
                ? {imageCaptionPrice: imageCaptionPrice}
                : undefined),
              ...(imageCaptionSubTitle
                ? {imageCaptionSubTitle: imageCaptionSubTitle}
                : undefined),

              ...(categoryId ? {categoryId: categoryId} : undefined),
              ...(brandId ? {brandId: brandId} : undefined),
              ...(subCategoryId ? {subCategoryId: subCategoryId} : undefined),
              ...(season ? {season: season} : undefined),

              ...(colorCode ? {colorCode: colorCode} : undefined),
              ...(itemImageUrl ? {itemImageUrl: itemImageUrl} : undefined),
              ...(productId ? {productId: productId} : undefined),
              ...(isOutfit ? {isOutfit: isOutfit} : undefined),

              ...(closetItemIds ? {closetItemIds: closetItemIds} : undefined),
              ...(outfitImageType
                ? {outfitImageType: outfitImageType}
                : undefined),
              ...(name ? {name: name} : undefined),
              ...(description ? {description: description} : undefined),
              ...(seasons ? {seasons: seasons} : undefined),
              ...(imageData ? {imageData: imageData} : undefined),
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
              borderRadius: 8,
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

  // const onSendImage = (index, ref) => {
  //   let imageURL = {};
  //   if (index === 0) {
  //     ImagePicker.openPicker({
  //       mediaType: 'any',
  //       width: 300,
  //       height: 400,
  //       compressVideoPreset: 'MediumQuality',
  //       includeBase64: true,
  //     }).then(async media => {
  //       let dataToSend = {};
  //       if (media.mime && (media.data || media.path)) {
  //         //Upload image
  //         if (media.mime.startsWith('image')) {
  //           const imagePath = `data:${media.mime};base64,${media.data}`;
  //           dataToSend = {
  //             base64MediaString: imagePath,
  //             ...(isStylistUser
  //               ? {personalStylistId: personalStylistId}
  //               : {userId: clientUserId}),
  //           };

  //           uploadMediaOnS3(dataToSend, imageURL, ref);
  //         } else if (media.mime.startsWith('video')) {
  //           let s3UploadUrl = await getPreSignedUrl({
  //             id: isStylistUser ? personalStylistId : clientUserId,
  //             type: isStylistUser ? 'personalStylistId' : 'userId',
  //           });
  //           console.log('s3UploadUrl', s3UploadUrl);
  //           RNFetchBlob.fetch(
  //             'PUT',
  //             s3UploadUrl,
  //             {
  //               'Content-Type': undefined,
  //             },
  //             RNFetchBlob.wrap(media.path),
  //           )
  //             .then(m => {
  //               console.log('upload finish');
  //               if (ref) {
  //                 ref.onSend({video: media.path}, true);
  //               }
  //             })
  //             .catch(error => {
  //               console.log('upload error', error);
  //             });
  //           // Handle video
  //           // const videoPath = `data:${media.mime};base64,${media.path}`;
  //           // dataToSend = {
  //           //   base64MediaString: videoPath,
  //           //   ...(isStylistUser
  //           //     ? {personalStylistId: personalStylistId}
  //           //     : {userId: clientUserId}),
  //           // };
  //           // Rest of your video handling code
  //           // ...
  //         }
  //       }
  //     });
  //   } else if (index === 1) {
  //     ImagePicker.openCamera({
  //       mediaType: 'any',
  //       width: 300,
  //       height: 400,
  //       includeBase64: true,
  //     })
  //       .then(media => {
  //         let dataToSend = {};
  //         if (media.mime && (media.data || media.path)) {
  //           //Upload image
  //           if (media.mime.startsWith('image')) {
  //             const imagePath = `data:${media.mime};base64,${media.data}`;
  //             dataToSend = {
  //               base64MediaString: imagePath,
  //               ...(isStylistUser
  //                 ? {personalStylistId: personalStylistId}
  //                 : {userId: clientUserId}),
  //             };
  //             uploadMediaOnS3(dataToSend, imageURL, ref);
  //           }
  //         }
  //       })
  //       .catch(error => {
  //         console.log('Error in openCamera:', error);
  //       });
  //   } else if (index === 2) {
  //     ImagePicker.openCamera({
  //       mediaType: 'video',
  //       videoQuality: 'medium',
  //       // compressVideoPreset: 'MediumQuality',
  //     })
  //       .then(async media => {
  //         let dataToSend = {};
  //         if (media.mime && (media.data || media.path)) {
  //           if (media.mime.startsWith('video')) {
  //             let s3UploadUrl = await getPreSignedUrl({
  //               id: isStylistUser ? personalStylistId : clientUserId,
  //               type: isStylistUser ? 'personalStylistId' : 'userId',
  //             });
  //             console.log('s3UploadUrl', s3UploadUrl);
  //             RNFetchBlob.fetch(
  //               'PUT',
  //               s3UploadUrl,
  //               {
  //                 'Content-Type': undefined,
  //               },
  //               RNFetchBlob.wrap(media.path),
  //             )
  //               .then(m => {
  //                 console.log('upload finish');
  //                 if (ref) {
  //                   ref.onSend({video: media.path}, true);
  //                 }
  //               })
  //               .catch(error => {
  //                 console.log('upload error', error);
  //               });
  //             // Handle video
  //             // const videoPath = `data:${media.mime};base64,${media.path}`;
  //             // dataToSend = {
  //             //   base64MediaString: videoPath,
  //             //   ...(isStylistUser
  //             //     ? {personalStylistId: personalStylistId}
  //             //     : {userId: clientUserId}),
  //             // };
  //             // Rest of your video handling code
  //             // ...
  //           }
  //         }
  //       })
  //       .catch(error => {
  //         console.log('Error in openCamera:', error);
  //       });
  //   }
  // };

  const onSendImage = useCallback(
    (index, ref) => {
      let imageURL = {};
      if (index === 0) {
        ImagePicker.openPicker({
          mediaType: 'any',
          width: 300,
          height: 400,
          compressVideoPreset: 'MediumQuality',
          includeBase64: true,
        }).then(async media => {
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
              let s3UploadUrl = await getPreSignedUrl({
                id: isStylistUser ? personalStylistId : clientUserId,
                type: isStylistUser ? 'personalStylistId' : 'userId',
              });
              RNFetchBlob.fetch(
                'PUT',
                s3UploadUrl,
                {
                  'Content-Type': undefined,
                },
                RNFetchBlob.wrap(media.path),
              )
                .then(m => {
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
    },
    [isStylistUser, personalStylistId, clientUserId],
  );

  const renderActions = useCallback(
    ref => {
      return (
        <TouchableOpacity
          style={Styles.sendIcon}
          activeOpacity={1}
          onPress={() => {
            // showActionSheet(ref);
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: ['Gallery', 'Camera', 'Video Recorder', 'Cancel'],
                destructiveButtonIndex: 3,
                cancelButtonIndex: 3,
                title: 'Pick the media',
              },
              buttonIndex => {
                showActionSheet(buttonIndex, ref);
              },
            );
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

  // const chatMessagesRef = collection(db, 'chats', chatId, 'messages');

  // // Create a query to retrieve all messages
  // const q = query(chatMessagesRef);

  // // Fetch all messages and their references
  // const fetchMessages = async () => {
  //   try {
  //     const querySnapshot = await getDocs(q);
  //     const messagesWithRefs = querySnapshot.docs.map(docSnapshot => ({
  //       message: docSnapshot.data(),
  //       messageRef: doc(chatMessagesRef, docSnapshot.id),
  //     }));
  //     return messagesWithRefs;
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //     return [];
  //   }
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const addToCloset = async currentMessage => {
    console.log('currentMessage', currentMessage);
    // const {_id} = currentMessage;

    // try {
    //   const chatId = generateChatId(
    //     isStylistUser ? personalStylistId : clientUserId,
    //     receiverDetails?.userId,
    //   );
    //   // const chatMessagesRef = collection(db, 'chats', chatId, 'messages');
    //   // const q = query(chatMessagesRef);
    //   // const querySnapshot = await getDocs(q);

    //   // Check if the document exists before updating
    //   const docRef = doc(db, 'chats', chatId, 'messages', _id);
    //   const docSnapshot = await getDoc(docRef);
    //   debugger;
    //   if (docSnapshot.exists()) {
    //     // Document exists, proceed with the update
    //     await updateDoc(docRef, {
    //       isClosetItem: true,
    //     });
    //     // dispatch(addDataInCloset(data));
    //   } else {
    //     console.error('Document does not exist:', _id);
    //     // Handle the case where the document does not exist
    //   }
    // } catch (error) {
    //   console.error('Error updating Firestore document:', error);
    // }

    // await addDoc(collection(db, 'chats', chatId, 'messages'), {
    //   _id: _id,
    //   createdAt: createdAt,
    //   text: text,
    //   receiverDetails: receiverDetails,
    //   user: user,
    //   sent: true,
    //   received: '',
    // });
    if (currentMessage?.isOutfit) {
      let data = {
        userId: isStylistUser ? personalStylistId : clientUserId,
        closetItemIds: currentMessage?.closetItemIds,
        outfitImageType: currentMessage?.outfitImageType,
        name: currentMessage?.name,
        description: currentMessage?.description,
        seasons: currentMessage?.season,
        imageData: currentMessage?.imageData,
      };
      dispatch(addOutfit(data));
    } else {
      let data = {
        userId: isStylistUser ? personalStylistId : clientUserId,
        categoryId: currentMessage?.categoryId,
        subCategoryId: currentMessage?.subCategoryId,
        brandId: currentMessage?.brandId,
        season: currentMessage?.seasons,
        colorCode: [currentMessage?.colorCode],
        itemImageUrl: currentMessage?.itemImageUrl,
        isImageBase64: false,
        productId: currentMessage?.productId,
      };
      dispatch(addDataInCloset(data));
    }
  };

  const renderMessageImage = useCallback(
    props => {
      let {currentMessage, position} = props;
      const imageUrl = currentMessage.image;
      const isOutfitItem = currentMessage?.isOutfit;
      const images = messages
        .filter(message => message.image) // Filter out messages without images
        .map(message => ({
          url: message.image,
        }));
      const imageIndex = images.findIndex(image => image.url === imageUrl);
      return (
        <View>
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
          {currentMessage.imageCaptionTitle && (
            <View style={{padding: 8}}>
              <TouchableOpacity onPress={() => addToCloset(currentMessage)}>
                {true ? (
                  <Image
                    source={require('../../assets/Closet.png')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../../assets/addedCloset.png')}
                    style={{
                      height: 24,
                      width: 24,
                    }}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (
                    currentMessage?.imageCaptionSubTitle &&
                    currentMessage?.imageCaptionPrice
                  ) {
                    dispatch(getProductDetailsApi(currentMessage?.productId));
                  }
                }}>
                <Text
                  style={{
                    textDecorationLine:
                      currentMessage?.imageCaptionSubTitle &&
                      currentMessage?.imageCaptionPrice
                        ? 'underline'
                        : 'none',
                    fontWeight: '700',
                    marginTop: 5,
                    fontSize: FONTS_SIZES.s4,
                    color: position == 'right' ? Colors.white : Colors.black,
                  }}>
                  {isOutfitItem
                    ? currentMessage?.name
                    : currentMessage?.imageCaptionTitle}
                </Text>
                {currentMessage?.imageCaptionSubTitle && (
                  <Text
                    numberOfLines={2}
                    style={[
                      Styles.captionPriceText,
                      {
                        color:
                          position == 'right' ? Colors.white : Colors.black,
                      },
                    ]}>
                    {currentMessage?.imageCaptionSubTitle}
                  </Text>
                )}
                {currentMessage?.imageCaptionPrice && (
                  <Text
                    style={[
                      Styles.captionPriceText,
                      {
                        marginBottom: 5,
                        color:
                          position == 'right' ? Colors.white : Colors.black,
                      },
                    ]}>
                    {`$${currentMessage?.imageCaptionPrice}`}
                  </Text>
                )}
              </TouchableOpacity>
              {/* <Text
                style={{
                  fontWeight: '700',
                  marginTop: 8,
                  fontSize: FONTS_SIZES.s4,
                  color: Colors.black,
                }}>
                {currentMessage?.imageCaptionTitle}
              </Text>
              {currentMessage?.imageCaptionSubTitle && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontWeight: '400',
                    width: '100%',
                    fontSize: FONTS_SIZES.s4,
                    color: Colors.black,
                    marginTop: 4,
                  }}>
                  {currentMessage?.imageCaptionSubTitle}
                </Text>
              )}
              {currentMessage?.imageCaptionPrice && (
                <Text
                  style={{
                    fontWeight: '400',
                    fontSize: FONTS_SIZES.s4,
                    color: Colors.black,
                    marginTop: 4,
                  }}>
                  {`$${currentMessage?.imageCaptionPrice}`}
                </Text>
              )} */}
            </View>
          )}
        </View>
      );
    },
    [
      addToCloset,
      clientUserId,
      dispatch,
      isStylistUser,
      messages,
      personalStylistId,
    ],
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
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {color: Colors.white},
          left: {color: Colors.black},
        }}
        wrapperStyle={{
          right: {
            maxWidth: '68%',
            padding: 4,
            backgroundColor: 'rgba(33, 122, 255, 1)',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 8,
          },
          left: {
            maxWidth: '68%',
            padding: 4,
            backgroundColor: Colors.grey1,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 0,
          },
        }}
      />
    );
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
        <View style={{flex: 0.94}}>
          <GiftedChat
            ref={giftedChatRef}
            messages={messages}
            renderBubble={renderBubble}
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
                    width: 32,
                    height: 32,
                    marginBottom: 6,
                  }}
                />
              </Send>
            )}
            renderBubble={props => (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: {
                    backgroundColor: 'rgb(53,117,194)',
                  },
                }}
                textStyle={{
                  right: {
                    color: 'white', // Change this to the desired text color for sent messages
                  },
                }}
              />
            )}
            textInputProps={{autoCorrect: false}} // Disable autocorrect
            user={{
              _id: isStylistUser ? personalStylistId : clientUserId,
              email: userEmail,
              name: userName,
              // avatar: profilePic || '',
            }}
          />
          <ImageModal />
        </View>
      )}
    </View>
  );
};

export default React.memo(ChatScreen);
