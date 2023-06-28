import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigation from './app/navigation';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {store, persistor} from './app/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Colors} from './app/colors';
import Lottie from 'lottie-react-native';
import * as Animatable from 'react-native-animatable'; // Import Animatable from react-native-animatable

let isNoch = DeviceInfo.hasNotch();

const App = () => {
  const [showLottie, setLottie] = useState(true);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const onAnimationFinish = () => {
    // Callback function when animation finishes
    setLottie(false);
  };

  return (
    <NavigationContainer>
      <SafeAreaView
        style={{
          flex: 1,
          marginTop: isNoch ? 32 : 10,
          backgroundColor: Colors.grey1,
        }}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <View style={{flex: 1}}>
              {showLottie && (
                <Lottie
                  source={require('./app/assets/splash_animation.json')}
                  autoPlay
                  onAnimationFinish={onAnimationFinish} // Call the callback function when animation finishes
                  loop={false}
                />
              )}
              {!showLottie && (
                <Animatable.View
                  animation="fadeIn"
                  duration={600} // Adjust duration as needed
                  useNativeDriver
                  style={{flex: 1}}>
                  <AppNavigation />
                </Animatable.View>
              )}
            </View>
          </PersistGate>
        </Provider>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
