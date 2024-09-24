import React from "react";
import axios from "./axios";
import Uploader from "./uploader";
import Profile from "./profile";
import ReportForm from "./reportform";
import { BrowserRouter, Route, Link } from "react-router-dom";
import MapContainer from "./mapcontainer";
import ReportWall from "./reportwall";
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formVisible: false
        };
        this.showForm = this.showForm.bind(this);
    }
    showForm() {
        console.log("I am showForm");
        const { formVisible } = this.state;
        //and toggle its value
        this.setState({ formVisible: !formVisible });
    }
    showUploader() {
        //check if it's opened
        const { uploaderIsVisible } = this.state;
        //and toggle its value
        this.setState({ uploaderIsVisible: !uploaderIsVisible });
        console.log("I am showUploader");
    }
    showFriends() {
        const { friendsIsVisible } = this.state;
        this.setState({ friendsIsVisible: !friendsIsVisible });
    }

    setImage(image) {
        console.log("image, ", image);
        this.setState({ img_url: image, uploaderIsVisible: false });
    }
    setBio(biotext) {
        console.log("i am setBio", biotext.bio);
        this.setState({ bio: biotext.bio });
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log("data in get/user: ", data);
            this.setState({ myId: data[0] });
            this.setState(data[1]); // we res.json from the server and pass it to state, in order to this.state.whatever later and use it in our component
        });
        axios.get("/getbio").then(({ data }) => {
            console.log("data in getbio: ", data);
            this.setState({ bio: data.bio });
        });
    }
    render() {
        console.log("showForm: ", this.showForm);
        //if the ajax request didn't meet success, show nothing
        if (!this.state.id) {
            return null;
        }
        return (
            <div id="app">
                <BrowserRouter>
                    <div className="app1">
                        <div id="appbar">
                            <ReportWall />
                        </div>
                        <div id="greeting">
                            <h2>
                                {" "}
                                Run, {this.state.first} {this.state.last}...{" "}
                            </h2>
                            <img id="logoapp" src="ubahnlogo.png" />
                            <div id="rightbar">
                                <h2 onClick={this.showForm} id="reportbutton">
                                    report a control
                                </h2>
                                <h2 id="yourrights">your rights</h2>
                                <a href="/logout">
                                    <img
                                        id="logoutbutton"
                                        src="/run-logout.png"
                                    />
                                </a>
                            </div>
                        </div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <div id="landing">
                                    <MapContainer />
                                    {this.state.uploaderIsVisible && (
                                        <Uploader setImage={this.setImage} />
                                    )}
                                </div>
                            )}
                        />
                        <ReportForm formVisible={this.state.formVisible} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
