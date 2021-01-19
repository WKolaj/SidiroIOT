import { SET_UNIVERSAL_TABS_NAME_INDEX } from '../actions/UniversalTabs.action';

const initialState = {
    //tabs instances added dynamically
}

export const UniversalTabsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_UNIVERSAL_TABS_NAME_INDEX:
            return {
                ...state,
                [action.name]: action.index
            }
        default:
            return state
    }
}