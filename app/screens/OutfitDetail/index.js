import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from '../../colors';
import {BigImage, Buttons, Header, Input, OverlayModal} from '../../components';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOutfitDetail,
  getOutfitsList,
} from '../../redux/actions/outfitActions';
import {deleteOutfit} from '../../redux/actions/outfitActions';
import SimpleToast from 'react-native-simple-toast';
import {openClosetDetails} from '../../redux/actions/closetAction';

const OutfitDetail = props => {
  const getOutfitDetailData = useSelector(
    state => state.OutfitReducer.getOutfitDetailData,
  );
  const userId = useSelector(state => state.AuthReducer.userId);
  const dispatch = useDispatch();
  const [showModal, setModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const openMenu = () => {
    setModal(true);
  };
  const singleClosetReponse = useSelector(
    state => state.ClosetReducer.singleClosetReponse,
  );
  const deleteOutfitRepsponse = useSelector(
    state => state.OutfitReducer.deleteOutfitRepsponse,
  );

  useEffect(() => {
    return () => {
      dispatch({type: 'OUTFIT_DETAILS', value: {}});
    };
  }, []);

  useEffect(() => {
    if (Object.keys(deleteOutfitRepsponse).length) {
      dispatch({type: 'OUTFIT_DELETE', value: {}});
      if (deleteOutfitRepsponse.statusCode === 200) {
        SimpleToast.show('Cloth successfully removed from outfit');
        dispatch(getOutfitsList());
        props.navigation.navigate('Outfit');
      }
    }
  }, [deleteOutfitRepsponse, dispatch]);

  useEffect(() => {
    if (Object.keys(singleClosetReponse).length) {
      dispatch({type: 'SINGLE_CLOSET', value: {}});
      props.navigation.navigate('ClosetInfo', {
        apiData: singleClosetReponse,
      });
    }
  }, [dispatch, props.navigation, singleClosetReponse]);

  useEffect(() => {
    if (props?.route?.params?.outfitId) {
      dispatch(
        getOutfitDetail({
          userId: userId,
          outfitId: props?.route?.params?.outfitId,
        }),
      );
    }
  }, []);

  const renderItem = (item, index) => {
    return (
      <View
        style={{
          marginBottom: 16,
          alignSelf: 'center',
          flex: 0.5,
          marginHorizontal: 8,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openClosetInfo(item.closetItemId)}
          style={{
            backgroundColor: Colors.grey1,
            paddingVertical: 10,
            paddingHorizontal: 13,
            width: '100%',
            alignSelf: 'center',
            marginBottom: 8,
          }}>
          <Image
            source={{uri: item.itemImageUrl}}
            style={{
              height: 140,
              width: 100,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const deleteCloset = () => {
    setModal(false);
    setTimeout(() => {
      setDeleteModal(true);
    }, 400);
  };
  const renderMenu = () => {
    return (
      <View>
        <Buttons
          text="Edit"
          isInverse
          onPress={() => {
            setModal(false);
            props.navigation.navigate('SubmitOutfit', {
              editOutfitData: getOutfitDetailData,
              editoutfit: true,
            });
          }}
        />
        <Buttons
          text="remove"
          isInverse
          textColor="red"
          onPress={deleteCloset}
        />
        <Buttons
          text="Cancel"
          isInverse
          noBorder
          onPress={() => setModal(false)}
        />
      </View>
    );
  };
  const removeCloset = () => {
    setDeleteModal(false);
    dispatch(
      deleteOutfit({
        userId: userId,
        outfitId: getOutfitDetailData?.outfitId,
      }),
    );
  };

  const openClosetInfo = id => {
    let data = {
      userId: userId,
      closetItemId: id,
    };
    dispatch(openClosetDetails(data));
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header showBack showVerticalMenu {...props} openMenu={openMenu} />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        {Object.keys(getOutfitDetailData).length > 0 ? (
          <>
            <BigImage imgSource={getOutfitDetailData?.outfitImageType} />
            <View style={{padding: 16}}>
              <Text style={styles.titleStyle}>Name</Text>
              <Text style={styles.subitleStyle}>
                {getOutfitDetailData.name}
              </Text>
              <Text style={styles.titleStyle}>Description</Text>
              <Text style={styles.subitleStyle}>
                {getOutfitDetailData.description}
              </Text>

              <Text style={styles.titleStyle}>Season</Text>
              <View style={{flexDirection: 'row'}}>
                {getOutfitDetailData.seasons.map(item => {
                  return (
                    <Text
                      style={[
                        styles.subitleStyle,
                        {marginVertical: 8, marginRight: 8},
                      ]}>
                      {item}
                    </Text>
                  );
                })}
              </View>
              <Text style={styles.titleStyle}>Clothes in this outfit</Text>
              <FlatList
                data={getOutfitDetailData?.closetDetailsList}
                numColumns={2}
                keyExtractor={item => item.closetItemId}
                renderItem={({item, index}) => renderItem(item, index)}
                contentContainerStyle={{
                  paddingVertical: 16,
                  paddingHorizontal: 8,
                  paddingBottom: 100,
                }}
              />
            </View>
          </>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
        {showModal && (
          <OverlayModal showModal={showModal} component={renderMenu()} />
        )}
        {showDeleteModal && (
          <DeleteModal
            showDeleteModal={showDeleteModal}
            cancelModal={() => setDeleteModal(false)}
            deleteCloset={removeCloset}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default OutfitDetail;

const DeleteModal = ({
  showDeleteModal = false,
  cancelModal = false,
  deleteCloset = () => {},
}) => {
  return (
    <View>
      <Modal
        animationIn="fadeInUpBig"
        avoidKeyboard
        animationInTiming={400}
        animationOutTiming={900}
        isVisible={showDeleteModal}
        style={{
          margin: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            width: Dimensions.get('window').width - 100,
          }}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                paddingVertical: 24,
                paddingHorizontal: 16,
              }}>
              Are you sure you want to remove this from your outfits?
            </Text>
            <View
              style={{
                flexDirection: 'row',
                borderTopWidth: 0.5,
                borderTopColor: '#00000029',
              }}>
              <TouchableOpacity
                style={{width: '50%', paddingVertical: 16}}
                onPress={deleteCloset}>
                <Text style={{color: 'red', textAlign: 'center'}}>REMOVE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={cancelModal}
                style={{width: '50%', paddingVertical: 16}}>
                <Text style={{textAlign: 'center'}}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headingStyle: {
    marginTop: 16,
  },
  seasonContainer: {
    borderWidth: 1,
    marginRight: 8,
    padding: 8,
    borderColor: 'rgba(0,0,0,0.16)',
    marginTop: 8,
  },
  subitleStyle: {
    color: Colors.black60,
    marginTop: 8,
    marginBottom: 16,
  },
});
