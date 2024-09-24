import React from "react";
import ProfilePic from "./profilepic";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div id="profile-wrap">
                <div id="profilepic2">
                    <ProfilePic
                        image={this.props.image}
                        showUploader={this.props.showUploader}
                    />
                </div>
                <div id="bio">
                    <h1>
                        {this.props.first} {this.props.last}
                    </h1>
                </div>
            </div>
        );
    }
}
