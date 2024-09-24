const spicedPg = require("spiced-pg");

const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/wintergreen-socialnetwork`;

const db = spicedPg(dbUrl);

exports.submitUserInfo = function submitUserInfo(first, last, email, password) {
    let q =
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *";
    let params = [first, last, email, password];

    return db.query(q, params);
};

exports.logIn = function logIn(email) {
    let q = "SELECT id, email, password FROM users WHERE email= $1";
    let params = [email];

    return db.query(q, params);
};

exports.getUserById = function getUserById(id) {
    let q =
        "SELECT id, first, last, img_url, email, bio, city, country FROM users WHERE id= $1";
    let params = [id];

    return db.query(q, params);
};

exports.uploadImg = function uploadImg(imgUrl, id) {
    let q = "UPDATE users SET img_url= $1 WHERE id=$2 RETURNING img_url";
    let params = [imgUrl, id];

    return db.query(q, params);
};

exports.setBio = function setBio(bioText, userId) {
    let q = "UPDATE users SET bio= $1 WHERE id= $2 RETURNING bio";
    let params = [bioText, userId];

    return db.query(q, params);
};

exports.getBioById = function getBioById(userId) {
    let q = "SELECT bio FROM users WHERE id=$1";
    let params = [userId];

    return db.query(q, params);
};

exports.getInitialStatus = function getInitialStatus(myId, otherId) {
    let q = `SELECT * FROM friendships
     WHERE (receiver=$1 AND sender=$2)
     OR (receiver=$2 AND sender=$1)`;
    let params = [myId, otherId];

    return db.query(q, params);
};

exports.sendFriendReq = function sendFriendReq(otherId, myId) {
    let q = `INSERT INTO friendships (receiver, sender) VALUES($1, $2) RETURNING *`;
    let params = [otherId, myId];

    return db.query(q, params);
};

exports.cancelReq = function cancelReq(myId, otherId) {
    let q = `DELETE FROM friendships WHERE (receiver=$2 AND sender=$1) OR (receiver=$1 AND sender=$2)`;
    let params = [myId, otherId];

    return db.query(q, params);
};

exports.acceptReq = function acceptReq(myId, otherId) {
    let q = `UPDATE friendships SET accepted= true WHERE (receiver=$2 AND sender=$1) OR (receiver=$1 AND sender=$2)`;
    let params = [myId, otherId];

    return db.query(q, params);
};

exports.getFriendsAndWannabes = function getFriendsAndWannabes(myId) {
    let q = `
    SELECT users.id, users.first, users.last, users.img_url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver= $1 AND sender= users.id)
    OR (accepted = true AND receiver= $1 AND sender= users.id)
    OR (accepted = true AND sender= $1 AND receiver= users.id)
`;
    let params = [myId];

    return db.query(q, params);
};

exports.getUsersByIds = function getUsersByIds(arrayOfIds) {
    let q = `SELECT
            id, first, last, img_url
            FROM
            users
            WHERE
            id= ANY($1)`;
    let params = [arrayOfIds];

    return db.query(q, params);
};

exports.getChatroomMessages = function getChatroomMessages() {
    let q = `SELECT users.first, users.last, users.img_url, chatroom.id, chatroom.comment, chatroom.user_id, chatroom.created_at
    FROM chatroom
    JOIN users
    ON chatroom.user_id = users.id
    ORDER BY ID DESC LIMIT 10
    `;

    return db.query(q);
};

exports.newChatroomMessage = function newChatroomMessage(comment, userId) {
    let q = `INSERT INTO
            chatroom (comment, user_id)
            VALUES ($1, $2)
            RETURNING * `;
    let params = [comment, userId];

    return db.query(q, params);
};

exports.updatePfWithNoPass = function updatePfWithNoPass(
    first,
    last,
    email,
    city,
    country,
    userId
) {
    let q = `
    UPDATE users
    SET first= $1, last= $2, email=$3, city=$4, country=$5
    WHERE id = $6
    RETURNING *
    `;
    let params = [first, last, email, city, country, userId];

    return db.query(q, params);
};

exports.updatePfWithPass = function updatePfWithPass(
    first,
    last,
    email,
    password,
    city,
    country,
    userId
) {
    let q = `
    UPDATE users
    SET first= $1, last= $2, email=$3, password=$4, city=$5, country=$6
    WHERE id=$7

    `;
    let params = [first, last, email, password, city, country, userId];

    return db.query(q, params);
};

exports.getReports = function getReports() {
    let q = `SELECT users.first, users.last, reports.line_vbb, reports.direction_id, reports.location_id, reports.comment, reports.created_at
    FROM reports
    JOIN users
    ON reports.user_id = users.id
    ORDER BY reports.id DESC LIMIT 10
    `;

    return db.query(q);
};

exports.newReport = function newReport(
    userId,
    line,
    direction,
    location,
    comment
) {
    let q = `INSERT INTO
            reports (user_id, line_vbb, direction_id, location_id, comment)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING * `;
    let params = [userId, line, direction, location, comment];

    return db.query(q, params);
};
