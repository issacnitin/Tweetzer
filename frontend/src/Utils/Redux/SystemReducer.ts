import { SystemState, Page } from "./SystemState";
import { SystemActionTypes } from "./Actions";

const systemReducerDefaultState: SystemState = {
    page: 0
} as SystemState;

const systemReducer = (state = systemReducerDefaultState, action: SystemActionTypes) => {
    switch(action.type) {
        case "CHANGE_PAGE":
            state.page = action.page;
            return state;
        default:
            return state;
    }
}

export {systemReducer}

