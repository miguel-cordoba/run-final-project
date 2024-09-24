//all axios req will go otherUserId// all action creator
//EVERY FN MUST RETURN AN OBJECT
import axios from "./axios";

export async function getFriendsAndWannabes() {
    const friendsAndWannabes = await axios.get("/friends-wannabes");
    console.log("friendsAndWannabes: ", friendsAndWannabes.data);
    return {
        type: "GET_FRIENDS_WANNABES",
        friendsWannabes: friendsAndWannabes.data
    };
    //axios GET req to get friends and receiveFriendsWannabes.
    // RES = return object with type key and all the list
    //you need friends to see that
}

export async function unfriend(otherId) {
    const unfriended = await axios.post("/new-friendship-status", {
        action: "cancel",
        otherId: otherId
    });
    console.log("unfriended: ", unfriended);
    return {
        type: "UNFRIEND",
        otherId: otherId
    };
}

export async function accept(otherId) {
    const accepted = await axios.post("/new-friendship-status", {
        action: "accept",
        otherId: otherId
    });
    console.log("accepted: ", accepted);

    return {
        type: "ACCEPT",
        otherId: otherId
    };
}

export async function onlineUsers(data) {
    console.log("data in onlineUsers", data);
    return {
        type: "ONLINE_USERS",
        user: data
    };
}

export async function userJoined(data) {
    console.log("data in userJoined: ", data);
    return {
        type: "USER_JOINED",
        user: data
    };
}
export async function userLeft(data) {
    console.log("data in userLeft: ", data);
    return {
        type: "USER_LEFT",
        id: data
    };
}

export async function getAllLines() {
    const allLines = await axios.get("/vbb-lines");
    return {
        type: "ALL_LINES_VBB",
        lines: allLines.data
    };
}

export async function getAllStations() {
    const allStations = await axios.get("/get-stations");
    console.log("allStations: ", allStations);
    return {
        type: "ALL_STATIONS_VBB",
        stations: allStations.data
    };
}
export function getReports(data) {
    return {
        type: "GET_REPORTS",
        reports: data
    };
}
export function newReport(data) {
    console.log("data in newReport: ", data);
    return {
        type: "NEW_REPORT",
        report: data
    };
}
