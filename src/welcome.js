import React from "react";
import Registration from "./registration";
import Login from "./login";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginVisible: false,
            registrationVisible: false
        };
        this.showLogin = this.showLogin.bind(this);
        this.showRegistration = this.showRegistration.bind(this);
    }
    showLogin() {
        const { loginVisible } = this.state;
        this.setState({ loginVisible: !loginVisible });
    }
    showRegistration() {
        const { registrationVisible } = this.state;
        this.setState({ registrationVisible: !registrationVisible });
    }
    render() {
        return (
            <div id="welcome">
                <video autoPlay muted loop id="myVideo">
                    <source src="/ubahn.mp4" type="video/mp4" />
                </video>
                {this.state.loginVisible && <Login />}
                {this.state.registrationVisible && <Registration />}

                <div id="welcome-bar">
                    <div id="welcome-options">
                        <h1 onClick={this.showLogin}> LOG IN </h1>
                        <h1 onClick={this.showRegistration}> SIGN UP </h1>
                    </div>
                </div>
                <div id="welcome-content">
                    <div id="intro">
                        <h2>
                            Run! web <br />
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no
                            sea takimata sanctus est Lorem ipsum dolor sit amet.
                            Lorem ipsum dolor sit amet, consetetur sadipscing
                            elitr, sed diam nonumy eirmod tempor invidunt ut
                            labore et dolore magna aliquyam erat, sed diam
                            voluptua. At vero eos et accusam et justo duo
                            dolores et ea rebum. Stet clita kasd gubergren, no
                            sea takimata sanctus est Lorem ipsum dolor sit amet.
                        </h2>
                    </div>
                    <img src="/ubahnlogo.png" />
                </div>
            </div>
        );
    }
}
