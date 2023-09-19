import {Dimensions, Platform, PixelRatio} from 'react-native';

export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('window');

// based on iPhone X scale
const wscale = SCREEN_WIDTH / 375;
const hscale = SCREEN_HEIGHT / 667;

//for width  pixel
const wp = size => {
  return normalize(size);
};
//for height  pixel
const hp = size => {
  return normalize(size, 'height');
};

//for font  pixel
const fp = size => {
  return wp(size);
};

//for margin and Padding verticle  pixel
const spV = size => {
  return hp(size);
};
//alert(PixelRatio.get()+'=>>>'+SCREEN_HEIGHT+' width=>>>'+SCREEN_WIDTH +'====>'+RFValue(13)+','+ wp(13))
//for margin and Padding horizontal  pixel
const spH = size => {
  return wp(size);
};

//for margin and Padding horizontal  pixel
const mpAll = size => {
  return {
    marginLeft: spH(size),
    marginRight: spH(size),
    marginTop: spV(size),
    marginBottom: spV(size),
  };
};

const pp = (ptValue = 0) => {
  return `${ptValue}px`;
};

function normalize(size, based = 'width') {
  const newSize = based === 'height' ? size * hscale : size * wscale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export {normalize, wp, hp, fp, spH, spV, mpAll, pp};
