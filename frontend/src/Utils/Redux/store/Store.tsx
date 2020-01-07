import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers/RootReducer";
import IStoreState from './IStoreState'

export default function configureStore() {
  return createStore<IStoreState, any, any, any>(
    rootReducer,
    applyMiddleware(thunkMiddleware)
  );
}