const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./db");
const s3 = require("./s3");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");
const request = require("request");
const router = express.Router();
/// cookie set up for socket.io
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    //name: session
    secret: `I'm always horny.`,
    maxAge: 1000 * 60 * 60 * 24 * 14 //cookies last two weeks
});

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

// F I N A L * P R O J E C T //
const lines = require("vbb-lines");
const stations = require("vbb-stations");
/////////////////////////////////////////////

/// upload///////////////////////////
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
///////////////////////////
//use cookie setup for socket.io
app.use(cookieParser());
app.use(cookieSessionMiddleware);
app.use(csurf());

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
//////
app.use(bodyParser.json({}));

app.use(express.static("./wintergreen-socialnetwork"));

app.use(express.static("public"));

app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// app.get('/', (req, res) => {
//     res.redirect('/welcome');
// });

app.post("/registration", (req, res) => {
    console.log("body: ", req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let password = req.body.password;
    //null constraint is not enough, it accepts an empty string
    if (first == "" || last == "" || password == "" || email == "") {
        throw new Error("all fields required");
    } else {
        bcrypt.hashPassword(password).then(hashedPass => {
            db.submitUserInfo(first, last, email, hashedPass)
                .then(results => {
                    console.log("results in submitUserInfo: ", results);
                    // set cookies so that res.redirect in GET welcome works. user is logged in
                    req.session.userId = results.rows[0].id;
                    res.json({ success: true });
                })
                .catch(err => {
                    console.log("err in submitUserInfo: ", err);
                    res.json({ error: true });
                });
        });
    }
});

app.post("/login", (req, res) => {
    console.log("body in post/login: ", req.body);
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    db.logIn(userEmail)
        .then(results => {
            console.log("results in login: ", results);
            let psswdOnDb = results.rows[0].password;
            let userId = results.rows[0].id;

            bcrypt
                .checkPassword(userPassword, psswdOnDb)
                .then(itsAMatch => {
                    if (itsAMatch) {
                        req.session.userId = userId;

                        res.json({ success: true });
                    } else {
                        res.json({ error: true });
                    }
                })
                .catch(err => {
                    console.log("err in checkPassword: ", err);
                    res.json({ error: true });
                });
        })
        .catch(err => {
            console.log("err in login: ", err);
            res.json({ error: true });
        });
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

function requireLoggedInUser(req, res, next) {
    if (!req.session.userId) {
        res.sendStatus(403);
    } else {
        next();
    }
}
app.get("/user", requireLoggedInUser, (req, res) => {
    db.getUserById(req.session.userId).then(({ rows }) => {
        console.log("rows in getUserById: ", rows);
        // const user = rows.pop();
        // if (!user.image_url) {
        //     user.image_url = "default.jpg";
        // }
        res.json([req.session.userId, rows[0]]);
    });
});
/// ROUTE TO GET ALL THE VBB LINES...reportform.componentDidMount
app.get("/vbb-lines", async (req, res) => {
    const allLines = await lines(true, "all");
    res.json(allLines);
});

app.get("/get-stations", async (req, res) => {
    const stationsArr = await stations();
    const stationNames = stationsArr.map(station => {
        return {
            id: station.id,
            name: station.name,
            latitude: station.location.latitude,
            longitude: station.location.longitude
        };
    });
    console.log("stationNames", stationNames);
    res.json(stationNames);
});

app.post(
    "/upload-profilepic",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        console.log("req.file in upload: ", req.file);
        let file = req.file;
        if (file) {
            let imgUrl = `https://s3.amazonaws.com/spicedling/${file.filename}`;
            db.uploadImg(imgUrl, req.session.userId).then(results => {
                console.log("results in uploadImg: ", results);
                res.json(results.rows[0]);
            });
        } else {
            res.json({
                success: false
            });
        }
    }
);

app.get("/getbio", (req, res) => {
    db.getBioById(req.session.userId).then(results => {
        console.log("results in getBioById: ", results.rows[0]);
        res.json(results.rows[0]);
    });
});

app.post("/setbio", (req, res) => {
    console.log("body in setbio: ", req.body.biotext);
    db.setBio(req.body.biotext, req.session.userId).then(results => {
        console.log("results in setBio: ", results.rows[0]);
        res.json(results.rows[0]);
    });
});

app.get("/api-user/:id", async (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({ match: true });
    } else {
        const userStuff = await db.getUserById(req.params.id);
        console.log("userStuff: ", userStuff.rows[0]);
        res.json(userStuff.rows[0]);
    }
});

app.get("/get-initial-status/:id", async (req, res) => {
    let myId = req.session.userId;
    let otherId = req.params.id;
    console.log("get-inital-status running");
    const initialStatus = await db.getInitialStatus(myId, otherId);
    console.log("initialStatus: ", initialStatus);
    res.json(initialStatus.rows[0]);

    //db query to gwt initial status of friendship, res.json the status to the friendbutton component
});

app.post("/new-friendship-status", async (req, res) => {
    let otherId = req.body.otherId;
    let myId = req.session.userId;

    if (req.body.action == "add") {
        const sendReq = await db.sendFriendReq(otherId, myId);
        console.log("sendReq: ", sendReq);
        res.json(sendReq.rows[0]);
    } else if (req.body.action == "cancel") {
        const cancelReq = await db.cancelReq(myId, otherId);
        console.log("cancelReq: ", cancelReq);
        res.json({ success: true });
    } else if (req.body.action == "accept") {
        const acceptReq = await db.acceptReq(myId, otherId);
        res.json({ success: true });
    }
});

app.get("/friends-wannabes", async (req, res) => {
    let myId = req.session.userId;
    const friendsAndWannabes = await db.getFriendsAndWannabes(myId);
    console.log("friendsAndWannabes: ", friendsAndWannabes.rows);
    res.json(friendsAndWannabes.rows);
});

app.post("/profile/edit", async (req, res) => {
    console.log("body in edit profile: ", req.body);
    let userName = req.body.first;
    let userLast = req.body.last;
    let userEmail = req.body.email;
    let userPsswd = req.body.password;
    let myId = req.session.userId;
    let userCity = req.body.city;
    let userCountry = req.body.country;

    if (!userPsswd) {
        const updateNoPass = await db.updatePfWithNoPass(
            userName,
            userLast,
            userEmail,
            userCity,
            userCountry,
            myId
        );
        console.log("updateNoPass: ", updateNoPass);
        res.json({ succes: true });
    } else {
        const hashedPass = await bcrypt.hashPassword(userPsswd);
        const updateWithPass = await db.updatePfWithPass(
            userName,
            userLast,
            userEmail,
            hashedPass,
            userCity,
            userCountry,
            myId
        );
        res.json({ success: true });
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//instead of app = server.listen = SOCKET.IO
server.listen(8080, function() {
    console.log("I'm listening.");
});

//this will be the lsit of online users with socketid key and userid value
const onlineUsers = {};

io.on("connection", async socket => {
    //disconnect them if 'socket.request.session' does not have their id
    const { userId } = socket.request.session;
    if (!userId) {
        return socket.disconnect();
    }

    //here I create the key and assign the value
    onlineUsers[socket.id] = userId; //the name of the property will be changing depending on the socketId of the user;

    let onlineUsersIds = Object.values(onlineUsers);

    //send the socket the list of online users (emit the `"onlineUsers"` event)
    const onlineUsersStuff = await db.getUsersByIds(onlineUsersIds);
    console.log("onlineUsersStuff: ", onlineUsersStuff.rows);
    socket.emit("onlineUsers", onlineUsersStuff.rows);

    //It is possible for a single user to appear the list more than once. If a user has two tabs open, it will ahve 2 sockets. We need to remove the item from the list that has the matching socket id when 'disconnect' event occurs. If a user who has the site open in two tabs closes one of them, it should remain in the list of online users.
    const alreadyHere =
        Object.values(onlineUsers).filter(id => id != userId).length > 1;
    console.log("onlineUsers before check: ", onlineUsers);
    if (!alreadyHere) {
        const newOnlineUser = await db.getUserById(userId);
        console.log("newOnline", newOnlineUser.rows);
        socket.broadcast.emit("userJoined", newOnlineUser.rows[0]);
    }
    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        const reallyGone = !Object.values(onlineUsers).includes(userId);
        if (reallyGone) {
            console.log("this user left: ", userId);
            socket.broadcast.emit("userLeft", userId);
        }
    });

    //send the socket the array of chat messages and emits event to the front
    const arrayOfReports = await db.getReports();
    console.log("arrayOfReports: ", arrayOfReports.rows);
    io.sockets.emit("getReports", arrayOfReports.rows.reverse());

    socket.on("newReport", async data => {
        console.log("data in newReport: ", data);
        const newReport = await db.newReport(
            userId,
            data.line,
            data.direction,
            data.location,
            data.comment
        );
        console.log("newMessage_: ", newReport.rows);
        const userStuff = await db.getUserById(userId);
        const newReportEntry = {
            id: newReport.rows[0].id,
            user_id: newReport.rows[0].user_id,
            line_vbb: newReport.rows[0].line_vbb,
            direction_id: newReport.rows[0].direction_id,
            location_id: newReport.rows[0].location_id,
            comment: newReport.rows[0].comment,
            created_at: newReport.rows[0].created_at,
            first: userStuff.rows[0].first,
            last: userStuff.rows[0].last
        };

        io.sockets.emit("newReport", newReportEntry);
    });
});

// db.getUserById({
//     Object.values(onlineUsers)
// }).then(
//         ({rows})=> {
//             socket.emit('onlineUsers')
//         }
//     )

// io.sockets.sockets[myId].emit("");
