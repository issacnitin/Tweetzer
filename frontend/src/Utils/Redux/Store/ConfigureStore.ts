import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { authReducer } from "../Reducers/AuthenticationReducer";
import { AppActions } from "../Types/Actions";

export const rootReducer = combineReducers({
    Authentication: authReducer
});

export type AppState = ReturnType<typeof rootReducer>

export const store = createStore(
    rootReducer, 
    applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>)
);