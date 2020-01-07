import { combineReducers } from "redux";
import IStoreState from "../store/IStoreState";
import {isAuthenticated, pendingActions} from "./Reducers";

const rootReducer = combineReducers<IStoreState>({
  isAuthenticated,
  pendingActions
});

export default rootReducer;