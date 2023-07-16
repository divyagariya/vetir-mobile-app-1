import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Header} from '../../components';
import Videos from './components/Videos';
import WebView from 'react-native-webview';
import {useDispatch, useSelector} from 'react-redux';
import {getVideoList, viewVideo} from '../../redux/actions/homeActions';

const VideoList = props => {
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [videoPlayer, setVideoPlayer] = useState(false);
  const totalVideos = useSelector(state => state.HomeReducer.totalVideos) || 0;
  const videoListRes = useSelector(state => state.HomeReducer.videoListRes);
  const userId = useSelector(state => state.AuthReducer.userId);
  const [videoLink, setVideoLink] = useState('');
  const [videoList, setVideoList] = useState([]);
  const [shouldPaginate, setPaginate] = useState(false);

  useEffect(() => {
    dispatch(getVideoList(1, 100));
  }, [dispatch]);

  useEffect(() => {
    if (videoListRes.length) {
      if (shouldPaginate) {
        setVideoList(prev => [...prev, ...videoListRes]);
        setPaginate(false);
      } else {
        setVideoList(videoListRes);
      }

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoListRes]);

  const runVideoVideos = item => {
    const data = {
      userId: userId,
      videoId: item._id,
    };
    dispatch(viewVideo(data));
    setVideoPlayer(true);
    setVideoLink(item.videoLink);
  };

  const loadMoreData = () => {
    if (totalVideos > videoList.length) {
      setPage(prev => prev + 1);
      setPaginate(true);
      setLoading(true);
      dispatch(getVideoList(page + 1, 100));
    }
  };

  const ListFooterComponent = () => {
    if (isLoading) {
      return <ActivityIndicator />;
    }
  };
  return (
    <View style={styles.container}>
      <Header {...props} showBack title="Fashion Videos" />
      <View
        style={{
          flex: 1,
          marginLeft: 8,
          marginLeft: 8,
          justifyContent: 'flex-start',
        }}>
        <FlatList
          contentContainerStyle={{alignSelf: 'flex-start'}}
          data={videoList}
          numColumns={4}
          keyExtractor={item => item._id}
          onEndReached={loadMoreData}
          onEndReachedThreshold={10}
          ListFooterComponent={ListFooterComponent}
          renderItem={({item}) => (
            <Videos item={item} runVideoVideos={() => runVideoVideos(item)} />
          )}
        />
      </View>
      {videoPlayer && (
        <View style={styles.playerContainer}>
          <TouchableOpacity
            style={styles.playerStyle}
            onPress={() => setVideoPlayer(false)}>
            <Image
              source={require('../../assets/cross.webp')}
              style={{width: 44, height: 44}}
            />
          </TouchableOpacity>
          <WebView
            source={{
              uri: videoLink,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default VideoList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 16,
  },
  playerStyle: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 999,
  },
  playerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
