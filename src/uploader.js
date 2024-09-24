import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.upload = this.upload.bind(this);
    }
    upload(a) {
        console.log("I am upload()");
        axios.post("/upload-profilepic", a).then(({ data }) => {
            console.log("data in upload-profilepic", data);
            this.props.setImage(data.img_url);
        });
    }
    render() {
        return (
            <div id="uploadform">
                <h2> u p d a t e Y o u r ProfilePic</h2>
                <input
                    name="file"
                    type="file"
                    value={this.formData}
                    onChange={e => {
                        const formData = new FormData();
                        formData.append("file", e.target.files[0]);
                        console.log("file: ", e.target.files[0]);
                        console.log("formData: ", formData);

                        this.upload(formData);
                    }}
                />
            </div>
        );
    }
}
