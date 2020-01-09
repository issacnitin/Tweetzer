import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk, { ThunkMiddleware } from "redux-thunk";
import { authReducer } from "../../Pages/Components/Authentication/Redux/AuthenticationReducer";
import { systemReducer } from "./SystemReducer";
import { AppActions } from "./Actions";
import { tweetReducer } from "../../Pages/Components/Tweet/Redux/TweetReducer";

export const rootReducer = combineReducers({
    Authentication: authReducer,
    System: systemReducer,
    Tweet: tweetReducer
});

export type AppState = ReturnType<typeof rootReducer>

export const store = createStore(
    rootReducer, 
    applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>)
);