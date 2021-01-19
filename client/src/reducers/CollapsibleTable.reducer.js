import { SET_COLLAPSIBLE_TABLE_INSTANCE } from '../actions/CollapsibleTable.action';

const initialState = {
    //table instances added dynamically in order to remember open/close collapsed state
    
}

export const CollapsibleTableReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_COLLAPSIBLE_TABLE_INSTANCE:
            return {
                ...state,
                [action.instanceName]: action.collapsedState
            }
        default:
            return state
    }
}