import { SystemState, Page } from "./SystemState";
import { SystemActionTypes } from "./Actions";

const systemReducerDefaultState: SystemState = {
    page: 0
} as SystemState;

const systemReducer = (state = systemReducerDefaultState, action: SystemActionTypes) => {
    switch(action.type) {
        default:
            state.page = action.page;
            return state;
    }
}

export {systemReducer}

