import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthReducer from '../reducers/authReducer';
import OtpReducer from '../reducers/sendOtpReducer';
import ProfileReducer from '../reducers/profileReducer';
import ClosetReducer from '../reducers/closetReducer';
import OutfitReducer from '../reducers/outfitReducer';
import CommonLoaderReducer from '../reducers/loaderReducer';
import HomeReducer from '../reducers/homeReducers';
import StylistReducer from '../reducers/stylistReducer';
import CartReducer from '../reducers/cartReducer';

const persistConfig = {
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
  whitelist: ['AuthReducer', 'ProfileReducer', 'ClosetReducer', 'HomeReducer', 'CartReducer'],
};

const rootReducer = combineReducers({
  AuthReducer,
  OtpReducer,
  ProfileReducer,
  ClosetReducer,
  OutfitReducer,
  CommonLoaderReducer,
  HomeReducer,
  StylistReducer,
  CartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer, applyMiddleware(thunk));

let persistor = persistStore(store);

export {store, persistor};
