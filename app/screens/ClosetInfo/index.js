import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {
  BigImage,
  Buttons,
  Header,
  OverlayModal,
  VText,
  VView,
} from '../../components';
import {FONTS_SIZES} from '../../fonts';
import {
  deleteClosetData,
  getClosetData,
} from '../../redux/actions/closetAction';
import {findOutfitList} from '../../redux/actions/outfitActions';

const ClosetInfo = props => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.AuthReducer.userId);
  const deleteClosetResponse = useSelector(
    state => state.ClosetReducer.deleteClosetResponse,
  );
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);
  const findOutFitList =
    useSelector(state => state.OutfitReducer.findOutfitListRepsponse) || [];
  const [activeOutfit, setActiveOutfit] = useState(true);
  const [showModal, setModal] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [findOutFitListData, setFindOutFitList] = useState([]);

  const openMenu = () => {
    setModal(true);
  };

  useEffect(() => {
    dispatch(
      findOutfitList({
        userId: isStylistUser ? props?.route?.params?.apiData?.userId : userId,
        closetItemId: props.route?.params?.apiData?.closetItemId,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(deleteClosetResponse).length) {
      if (deleteClosetResponse.statusCode === 200) {
        dispatch({type: 'DELETE_CLOSET', value: {}});
        Toast.show('Item successfully removed from closet');
        props.navigation.navigate('ClosetScreen');
        dispatch(getClosetData());
      }
    }
  }, [deleteClosetResponse, dispatch]);

  const renderMenu = () => {
    return (
      <View>
        <Buttons
          text="Edit"
          isInverse
          onPress={() => {
            setModal(false);
            props.navigation.navigate('ClosetDetailsFrom', {
              editClosetData: props.route?.params?.apiData,
              editCloset: true,
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
      deleteClosetData({
        userId: userId,
        closetItemId: props.route?.params?.apiData?.closetItemId,
      }),
    );
  };

  const deleteCloset = () => {
    setModal(false);
    setTimeout(() => {
      setDeleteModal(true);
    }, 400);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header showBack {...props} showVerticalMenu openMenu={openMenu} />
      <ScrollView>
        <View>
          <View style={{alignItems: 'center'}}>
            <BigImage imgSource={props.route?.params?.apiData?.itemImageUrl} />
          </View>
          <View style={{paddingHorizontal: 16}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setActiveOutfit(true)}
                style={[
                  styles.tabStyle,
                  {
                    borderBottomColor: activeOutfit
                      ? Colors.black60
                      : 'transparent',
                  },
                ]}>
                <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
                  Outfits
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveOutfit(false)}
                style={[
                  styles.tabStyle,
                  {
                    borderBottomColor: !activeOutfit
                      ? Colors.black60
                      : 'transparent',
                  },
                ]}>
                <Text style={{fontSize: FONTS_SIZES.s3, fontWeight: 'bold'}}>
                  Information
                </Text>
              </TouchableOpacity>
            </View>
            {activeOutfit ? (
              <View style={[styles.dataContainer, {alignItems: 'center'}]}>
                {findOutFitList.length === 0 ? (
                  <>
                    <Image
                      source={require('../../assets/iOutfit.webp')}
                      style={{width: 87, height: 87}}
                    />
                    <Text style={{textAlign: 'center', paddingTop: 16}}>
                      No outfit created with this item
                    </Text>
                  </>
                ) : (
                  <VView
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      flexWrap: 'wrap',
                    }}>
                    {findOutFitList.length > 0 &&
                      findOutFitList.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              props.navigation.navigate('OutfitDetail', {
                                outfitId: item.outfitId,
                                id: props?.route?.params?.id,
                              })
                            }
                            style={{
                              height: 109,
                              width: 109,
                              backgroundColor: Colors.grey1,
                              marginRight: 8,
                              marginBottom: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              source={{uri: item.outfitImageType}}
                              style={{
                                height: '100%',
                                width: '100%',
                              }}
                            />
                          </TouchableOpacity>
                        );
                      })}
                  </VView>
                )}
              </View>
            ) : (
              <View style={styles.dataContainer}>
                <Text style={styles.titleStyle}>Category</Text>
                <Text style={styles.subitleStyle}>
                  {props.route?.params?.apiData?.categoryName}
                </Text>
                <Text style={styles.titleStyle}>Sub Category</Text>
                <Text style={styles.subitleStyle}>
                  {props.route?.params?.apiData?.subCategoryName}
                </Text>
                <Text style={styles.titleStyle}>Brand</Text>
                <Text style={styles.subitleStyle}>
                  {props.route?.params?.apiData?.brandName}
                </Text>
                {props.route?.params?.apiData?.price && (
                  <>
                    <Text style={styles.titleStyle}>Price</Text>
                    <Text style={styles.subitleStyle}>
                      {`$ ${props.route?.params?.apiData?.price}`}
                    </Text>
                  </>
                )}
                {props.route?.params?.apiData?.notes && (
                  <>
                    <Text style={styles.titleStyle}>Notes</Text>
                    <Text style={styles.subitleStyle}>
                      {props.route?.params?.apiData?.notes}
                    </Text>
                  </>
                )}

                {props.route?.params?.apiData?.season?.length > 0 && (
                  <>
                    <Text style={styles.titleStyle}>Season</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {props.route?.params?.apiData?.season.map(item => {
                        return (
                          <Text
                            style={[
                              styles.subitleStyle,
                              {marginRight: 4, textTransform: 'capitalize'},
                            ]}>
                            {item}
                          </Text>
                        );
                      })}
                    </View>
                  </>
                )}

                <Text style={styles.titleStyle}>Color</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {props.route?.params?.apiData?.colorCode?.map(item => {
                    return (
                      <View
                        style={{
                          backgroundColor: item,
                          width: 24,
                          height: 24,
                          marginTop: 8,
                          marginRight: 8,
                        }}
                      />
                    );
                  })}
                </View>
              </View>
            )}

            <Buttons
              text="Create Outfit"
              onPress={() => props.navigation.navigate('AddOutfit')}
            />
          </View>
        </View>
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
      </ScrollView>
    </View>
  );
};

export default ClosetInfo;

const styles = StyleSheet.create({
  tabStyle: {
    width: '50%',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  dataContainer: {
    marginVertical: 20,
  },
  titleStyle: {},
  subitleStyle: {
    color: Colors.black60,
    marginTop: 8,
    marginBottom: 16,
  },
});

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
              Are you sure you want to remove this from your closet?
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
