import { combineReducers, configureStore } from '@reduxjs/toolkit'
import navReducer from './navSlice'
import userReducer from './userSlice'
import busSurveyReducer from './busSurveySlice'
import drivingAdminReducer from './drivingAdminSlice'
import cartReducer from './cart'
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({ 
  nav: navReducer,
  user: userReducer,
  busSurvey: busSurveyReducer,
  drivingAdmin: drivingAdminReducer,
  cart: cartReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})

export const persistor = persistStore(store)