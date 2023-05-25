export const initialState = {
  rooms: [],
};

export const actionTypes = {
  SET_CHAT_LIST: 'SET_CHAT_LIST',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CHAT_LIST:
      return {
        ...state,
        rooms: action.rooms,
      };

    default:
      return state;
  }
};

export default reducer;
