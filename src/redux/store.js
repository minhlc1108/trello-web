import { combineReducers, configureStore } from '@reduxjs/toolkit'
import boardReducer from './slices/boardSlice'
import userReducer from './slices/userSlice'
import activeCardReducer from './slices/activeCardSlice'
import storage from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/es/persistReducer'
import notificationReducer from './slices/notificationSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
}

const rootReducer = combineReducers({
  board: boardReducer,
  user: userReducer,
  activeCard: activeCardReducer,
  notifications: notificationReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export default store