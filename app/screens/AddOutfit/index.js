import React, {Component, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet from 'react-native-simple-bottom-sheet';
import {useSelector} from 'react-redux';
import {Colors} from '../../colors';
import {Buttons, Header} from '../../components';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';
import PhotoView from 'react-native-photo-view-ex';
import ViewShot, {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';

const screen = Dimensions.get('window');

const AddCloset = props => {
  const captureViewRef = useRef();
  const [showBgImage, setBgImg] = useState(true);
  const categoryData = useSelector(state => state.ClosetReducer.categoryData);
  const panelRef = useRef(null);
  const [activeTab, setActiveTab] = useState('All');
  const [outfitImages, setOutfitImages] = useState([]);
  const getcloset = useSelector(state => state.ClosetReducer.getcloset);
  const [filterClosetData, setFilterClosetData] = useState(getcloset);
  const [closetIds, setClosetIds] = useState([]);

  const [closetData, setClosetData] = useState([]);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    if (props?.route?.params?.editOutfitData) {
      let closetIds = [];
      props?.route?.params?.editOutfitData?.closetDetailsList?.map(item => {
        closetIds.push(item.closetItemId);
      });
      let imageData1 = props?.route?.params?.editOutfitData?.imageData;
      imageData1 = imageData1.map(item => {
        return {...item, pan: new Animated.ValueXY(0, 0)};
      });
      setOutfitImages(imageData1);
      setClosetIds(closetIds);
    }
  }, []);

  const addClosetInOutfit = (index, item) => {
    // const filteredPeople = people.filter((item) => item.id !== idToRemove);
    let closetIds1 = closetIds;
    if (closetIds1.includes(item.closetItemId)) {
      closetIds1 = closetIds1.filter(i => i !== item.closetItemId);
    } else {
      closetIds1.push(item.closetItemId);
    }
    setClosetIds(closetIds1);

    let outfitImages1 = [...outfitImages];

    if (!outfitImages1.some(i => i.closetItemId === item.closetItemId)) {
      outfitImages1.push({
        pan: new Animated.ValueXY(0, 0),
        imageSrc: item.itemImageUrl,
        closetItemId: item.closetItemId,
      });
    } else {
      //remove image logic
      outfitImages1 = outfitImages1.filter(
        i => i.closetItemId !== item.closetItemId,
      );
    }
    setOutfitImages(outfitImages1);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => setActiveTab(item.categoryName)}
        style={{
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor:
            activeTab === item.categoryName ? Colors.black60 : 'transparent',
        }}>
        <Text>{item.categoryName}</Text>
      </TouchableOpacity>
    );
  };

  const imageLocations = value => {
    setImageData(value);
  };

  const switchValue = value => {
    if (value) {
      setBgImg(false);
    } else {
      setBgImg(true);
    }
  };

  useEffect(() => {
    if (activeTab) {
      if (activeTab !== 'All') {
        let filterData = getcloset;
        filterData = getcloset.filter(item => {
          if (item.categoryName === activeTab) {
            return {...item};
          }
        });
        setFilterClosetData(filterData);
      } else {
        setFilterClosetData(getcloset);
      }
    }
  }, [activeTab, getcloset]);

  const onCapture = () => {
    // setBgImg(false);
    setTimeout(() => {
      captureRef(captureViewRef, {
        format: 'jpeg',
        quality: 0.9,
      }).then(
        uri => {
          RNFS.readFile(uri, 'base64').then(res => {
            props.navigation.navigate('SubmitOutfit', {
              outfitData: {
                imgSource: {data: `data:image/jpeg;base64,${res}`},
                closetIds: closetIds,
                imageData: imageData,
                closetDetailsList: closetIds || [],
              },
              editOutfitData: {
                outfitImageType: `data:image/jpeg;base64,${res}`,
                closetIds: closetIds,
                imageData: imageData,
                closetDetailsList:
                  props?.route?.params?.editOutfitData?.closetDetailsList || [],
                outfitId:
                  props?.route?.params?.editOutfitData?.outfitId || null,
              },
              editoutfitImage: props?.route?.params?.editoutfit || false,
            });
            // console.warn('urlString', uri);
          });

          // console.warn(uri);
        },
        error => alert('Oops, snapshot failed', error),
      );
    }, 900);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Header showBack {...props} showSwitch switchValue={switchValue} />
      {showBgImage ? (
        <ImageBackground
          source={require('../../assets/bg.png')}
          resizeMode="contain"
          style={{height: Dimensions.get('window').height * 0.5}}>
          <View ref={captureViewRef} style={{overflow: 'hidden'}}>
            <App outfitImages={outfitImages} imageLocations={imageLocations} />
          </View>
        </ImageBackground>
      ) : (
        <View
          style={{backgroundColor: Colors.grey1, overflow: 'hidden'}}
          ref={captureViewRef}>
          <App outfitImages={outfitImages} imageLocations={imageLocations} />
        </View>
      )}
      <BottomSheet
        ref={ref => (panelRef.current = ref)}
        sliderMinHeight={Dimensions.get('window').height * 0.3}
        wrapperStyle={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}
        innerContentStyle={{paddingBottom: 100}}
        sliderMaxHeight={Dimensions.get('window').height * 0.7}>
        {onScrollEndDrag => (
          <ScrollView onScrollEndDrag={onScrollEndDrag}>
            <FlatList
              data={[{categoryName: 'All'}, ...categoryData]}
              horizontal
              renderItem={renderItem}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.categoryName}
            />
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                // justifyContent: 'space-between',
              }}>
              {filterClosetData.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => addClosetInOutfit(index, item)}
                    style={{
                      alignItems: 'center',
                      backgroundColor: Colors.grey1,
                      paddingHorizontal: 3,
                      paddingVertical: 5,
                      margin: 8,
                      height: 80,
                      width: 80,
                    }}>
                    <Image
                      source={{uri: item.itemImageUrl}}
                      style={{width: 80, height: 80}}
                      resizeMode="contain"
                    />
                    <View style={{position: 'absolute', right: 5, top: 5}}>
                      <Image
                        style={{width: 16, height: 16}}
                        source={
                          closetIds.includes(item.closetItemId)
                            ? require('../../assets/check.png')
                            : require('../../assets/uncheck.png')
                        }
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
      </BottomSheet>
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          paddingHorizontal: 16,
        }}>
        {closetIds.length >= 1 && <Buttons text="next" onPress={onCapture} />}
      </View>
    </View>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closedata: this.props.outfitImages,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.outfitImages !== this.props.outfitImages) {
      this.setState({closedata: this.props.outfitImages});
    }
    if (prevState.closedata !== this.state.closedata) {
      this.props.imageLocations(this.state.closedata);
    }
  }

  panResponder = (item, index) => {
    let {closedata} = this.state;
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        item.pan.setOffset({
          x: item.pan.x._value,
          y: item.pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([
        null,
        {dx: item.pan.x, dy: item.pan.y},
      ]),
      onPanResponderRelease: event => {
        closedata[index] = closedata[index];
        this.setState({closedata}, () => {
          this.props.imageLocations(this.state.closedata);
        });
        item.pan.flattenOffset();
      },
    });
  };

  onPinchStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this.scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  onPinchEvent = i =>
    Animated.event(
      [
        {
          nativeEvent: {scale: i.scale},
        },
      ],
      {
        useNativeDriver: true,
      },
    );

  render() {
    return (
      <View style={styles.container}>
        {this.props.outfitImages.map((i, index) => {
          return (
            <View style={{width: 100, height: 100}} key={i.closetItemId}>
              <PinchGestureHandler
                onGestureEvent={this.onPinchEvent(i)}
                onHandlerStateChange={this.onPinchStateChange}>
                <Animated.View
                  {...this.panResponder(i, index).panHandlers}
                  style={{
                    width: 200,
                    height: 200,
                    transform: [{translateX: i.pan.x}, {translateY: i.pan.y}],
                  }}>
                  <PhotoView
                    source={{uri: i.imageSrc}}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    resizeMode="contain"
                    minimumZoomScale={1}
                    maximumZoomScale={2}
                    style={{width: '100%', height: '100%'}}
                  />
                </Animated.View>
              </PinchGestureHandler>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 0.5,
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 75,
    width: 75,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default AddCloset;
