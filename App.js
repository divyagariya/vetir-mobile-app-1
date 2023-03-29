import React, {Component} from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigation from './app/navigation';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {store, persistor} from './app/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {Platform, StatusBar, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Colors} from './app/colors';

let isNoch = DeviceInfo.hasNotch();

class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
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
                <AppNavigation />
              </View>
            </PersistGate>
          </Provider>
        </SafeAreaView>
      </NavigationContainer>
    );
  }
}

export default App;
