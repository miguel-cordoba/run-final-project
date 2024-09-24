export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS_WANNABES") {
        state = { ...state, friendsWannabes: action.friendsWannabes };
        return state;
    }
    if (action.type == "UNFRIEND") {
        const friendsWannabes = state.friendsWannabes.filter(
            friend => friend.id !== action.otherId
        );
        state = { ...state, friendsWannabes };
        return state;
    }
    if (action.type == "ACCEPT") {
        const friendsWannabes = state.friendsWannabes.map(friend => {
            console.log("friend in friendsWannabes acc: ", friend);
            if (friend.id == action.otherId) {
                friend.accepted = true;
            }
            return friend;
        });
        console.log("friendsWannabes in accepted red: ", friendsWannabes);
        state = { ...state, friendsWannabes };
        return state;
    }
    if (action.type == "ONLINE_USERS") {
        state = { ...state, onlineUsers: action.user };
        return state;
    }
    if (action.type == "USER_JOINED") {
        console.log("action in user_joined", action);
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.user]
        };
        return state;
    }
    if (action.type == "USER_LEFT") {
        console.log("action in user_left: ", action);
        const onlineUsers = state.onlineUsers.filter(
            user => user.id !== action.id
        );
        console.log("onlineUsers in reducer: ", onlineUsers);
        state = { ...state, onlineUsers };
        return state;
    }
    if (action.type == "ALL_LINES_VBB") {
        state = { ...state, allLinesVbb: action.lines };
        return state;
    }
    if (action.type == "ALL_STATIONS_VBB") {
        state = { ...state, allStationsVbb: action.stations };
        return state;
    }
    if (action.type == "GET_REPORTS") {
        state = { ...state, controlReports: action.reports };
        return state;
    }
    if (action.type == "NEW_REPORT") {
        const controlReports = [...state.controlReports, action.report];
        state = { ...state, controlReports };
        console.log("state in new_chatroom_mesaage after assignment: ", state);
        return state;
    }

    return state;
}
