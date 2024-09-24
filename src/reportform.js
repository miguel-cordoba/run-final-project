import React from "react";
import { getAllLines, getAllStations } from "./actions";
import { connect } from "react-redux";
import { getSocket } from "./socket.js";

var audio = new Audio("/sbahn_ton.mp3");

export class ReportForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(getAllLines());
        this.props.dispatch(getAllStations());
        // axios.get("/vbb-lines").then(data => {
        //     data.filter(line => line.mode == "bus");
        //     console.log("vbb-lines: ", data);
        // });
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    handleKeyDown(e) {
        if (e.which === 13) {
            console.log("enter pressed");
            getSocket().emit("newReport", e.target.value);
            e.target.value = "";
        }
    }
    report(line, direction, location, comment) {
        console.log("i am report()", line, direction, location, comment);
        getSocket().emit("newReport", {
            line: line,
            direction: direction,
            location: location,
            comment: comment
        });
        audio.play();
    }
    render() {
        console.log("formVisible", this.props.formVisible);
        console.log("stations: ", this.props.stations);

        if (
            !this.props.bus &&
            !this.props.ubahn &&
            !this.props.sbahn &&
            !this.props.tram
        ) {
            return null;
        }

        const ubahn = this.props.ubahn;
        const sbahn = this.props.sbahn;
        const tram = this.props.tram;
        const bus = this.props.bus;
        const stations = this.props.stations;

        return (
            <div className={this.props.formVisible ? "on" : "report-form-wrap"}>
                <div id="report-form">
                    <img className="dropbtn" src="./ubahnbutton.png" />
                    <img className="dropbtn" src="./sbahnbutton.png" />
                    <img className="dropbtn" src="./trambutton.png" />
                    <img className="dropbtn" src="./busbutton.png" />

                    <h2> Line </h2>
                    <datalist id="lines">
                        {ubahn.map(line => {
                            return (
                                <option
                                    key={line.id}
                                    className="dropdown-result"
                                    value={line.name}
                                />
                            );
                        })}
                        {sbahn.map(line => {
                            return (
                                <option
                                    key={line.id}
                                    className="dropdown-result"
                                    value={line.name}
                                />
                            );
                        })}
                        {tram.map(line => {
                            return (
                                <option
                                    key={line.id}
                                    className="dropdown-result"
                                    value={line.name}
                                />
                            );
                        })}
                        {bus.map(line => {
                            return (
                                <option
                                    key={line.id}
                                    className="dropdown-result"
                                    value={line.name}
                                />
                            );
                        })}
                    </datalist>
                    <input
                        name="line"
                        type="text"
                        list="lines"
                        onChange={this.handleChange}
                    />

                    <h2> Direction </h2>
                    <datalist id="stations">
                        {stations.map(station => {
                            return (
                                <option
                                    key={station.id}
                                    defaultValue={station.id}
                                >
                                    {station.name}
                                </option>
                            );
                        })}
                    </datalist>
                    <input
                        name="direction"
                        type="text"
                        list="stations"
                        onChange={this.handleChange}
                    />
                    <h2> Your location </h2>
                    <datalist id="location">
                        {stations.map(station => {
                            return (
                                <option
                                    key={station.id}
                                    defaultValue={station.id}
                                >
                                    {station.name}
                                </option>
                            );
                        })}
                        <option className="dropdown-result" value={stations} />
                    </datalist>
                    <input
                        name="location"
                        type="text"
                        list="location"
                        onChange={this.handleChange}
                    />
                    <h2> Comments </h2>
                    <textarea name="comment" onChange={this.handleChange} />
                    <br />
                    <button
                        onClick={() => {
                            this.report(
                                this.line,
                                this.direction,
                                this.location,
                                this.comment
                            );
                        }}
                    >
                        {" "}
                        REPORT{" "}
                    </button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    console.log("global state in ReportForm: ", state);

    return {
        bus:
            state.allLinesVbb &&
            state.allLinesVbb.filter(
                line => line.product == "bus" && line.operator == "796"
            ),
        ubahn:
            state.allLinesVbb &&
            state.allLinesVbb.filter(line => line.product == "subway"),
        sbahn:
            state.allLinesVbb &&
            state.allLinesVbb.filter(line => line.product == "suburban"),
        tram:
            state.allLinesVbb &&
            state.allLinesVbb.filter(
                line => line.product == "tram" && line.operator == "796"
            ),
        stations: state.allStationsVbb && state.allStationsVbb
        // wannabes: , //accepted:false; filter method might be helpful
        // friends:// accepted:true
    };
};

export default connect(mapStateToProps)(ReportForm);
