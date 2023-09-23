import React, {useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {FONTS_SIZES} from '../../fonts';
import VText from '../Text';
import VView from '../View';
import {Images} from '../../assets';
import {useDispatch} from 'react-redux';

const Header = ({
  showshare = false,
  title = '',
  navigation = () => {},
  showFilter = false,
  showBack = false,
  showMenu = false,
  showChat = false,
  showSwitch = false,
  switchValue = () => {},
  showVerticalMenu = false,
  openMenu = () => {},
  handleSorting = () => {},
  showSort = false,
  showFilterFunction = () => {},
  onBack = null,
  addToCloset = () => {},
  showAdd = false,
  onShare = () => {},
  imageSrc = null,
  showLike = false,
  likeImageSrc = null,
  likeProduct = () => {},
  showRecommend = false,
  recommendClients = () => {},
  showWhatsapp = false,
  onWhatsappClick = () => {},
  onPressChat,
}) => {
  const [switchIcon, setSwitch] = useState(false);
  const dispatch = useDispatch();
  const toggleSwitch = () => {
    switchValue(!switchIcon);
    setSwitch(!switchIcon);
  };

  const verticalMenuClicked = () => {
    openMenu(true);
  };

  const sortClicked = () => {
    handleSorting();
  };

  const back = () => {
    if (onBack) {
      onBack();
    } else {
      dispatch({type: 'GET_PRODUCT_DETAILS', value: {}});
      navigation.goBack();
    }
  };

  return (
    <VView
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        alignItems: 'center',
      }}>
      <VView style={{flexDirection: 'row', alignItems: 'center'}}>
        {showBack && (
          <TouchableOpacity onPress={back}>
            <Image
              resizeMode="contain"
              source={require('../../assets/iBack.webp')}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        )}
        {title && (
          <VText
            text={
              title.length < 15 ? `${title}` : `${title.substring(0, 15)}...`
            }
            style={{
              paddingLeft: !showBack || 16,
              fontSize: FONTS_SIZES.s3,
              fontWeight: '900',
              color: '#212427',
              textTransform: 'uppercase',
              // width: 200,
            }}
          />
        )}
      </VView>
      <VView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {showAdd && (
          <VView style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{marginRight: 16}} onPress={addToCloset}>
              <Image
                resizeMode="contain"
                source={imageSrc}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </VView>
        )}
        {showLike && likeImageSrc !== null && (
          <VView style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{marginRight: 16}} onPress={likeProduct}>
              <Image
                resizeMode="contain"
                source={likeImageSrc}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </VView>
        )}
        {showWhatsapp && (
          <TouchableOpacity style={{marginRight: 16}} onPress={onWhatsappClick}>
            <Image
              resizeMode="contain"
              source={require('../../assets/iWhatsapp.webp')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        )}
        {showRecommend && (
          <VView style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={recommendClients}>
              <Image
                resizeMode="contain"
                source={require('../../assets/iRecommend.webp')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </VView>
        )}
        {showshare && (
          <VView style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={onShare}>
              <Image
                resizeMode="contain"
                source={require('../../assets/iShare.webp')}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </VView>
        )}
        {showFilter && (
          <TouchableOpacity onPress={() => showFilterFunction(true)}>
            <Image
              resizeMode="stretch"
              source={require('../../assets/iFilter.webp')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        )}
        {showSort && (
          <TouchableOpacity onPress={sortClicked} style={{paddingLeft: 12}}>
            <Image
              resizeMode="contain"
              source={require('../../assets/sort.webp')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        )}
        {showSwitch && (
          <TouchableOpacity style={{paddingLeft: 12}} onPress={toggleSwitch}>
            <Image
              resizeMode="contain"
              source={switchIcon ? Images.onIcon : Images.offIcon}
              style={{width: 33, height: 24}}
            />
          </TouchableOpacity>
        )}
        {showChat && (
          <TouchableOpacity onPress={onPressChat} style={{paddingLeft: 10}}>
            <Image
              resizeMode="contain"
              source={Images.chaticon}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Menu')}
            style={{paddingLeft: 10}}>
            <Image
              resizeMode="contain"
              source={Images.menuBar}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        )}

        {showVerticalMenu && (
          <TouchableOpacity
            onPress={verticalMenuClicked}
            style={{paddingLeft: 10}}>
            <Image
              resizeMode="contain"
              source={require('../../assets/vertical.png')}
              style={{width: 32, height: 32}}
            />
          </TouchableOpacity>
        )}
      </VView>
    </VView>
  );
};

export default Header;
