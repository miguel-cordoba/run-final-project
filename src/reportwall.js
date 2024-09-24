import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import MoveStuffAround from "./ticker.js";

export class ReportWall extends React.Component {
    componentDidUpdate() {
        if (this.elem) {
            this.elem.scrollTop = this.elem.scrollHeight;
        }
    }
    render() {
        if (!this.props.controlReports) {
            return null;
        }
        const controlReports = this.props.controlReports;
        console.log("controlReports: ", controlReports);

        const reportList = (
            <div
                id="report-list"
                ref={elem => {
                    this.elem = elem;
                }}
            >
                <MoveStuffAround />
                {controlReports.map(report => {
                    let today = new Date();
                    var date =
                        today.getFullYear() +
                        "-" +
                        "0" +
                        (today.getMonth() + 1) +
                        "-" +
                        today.getDate();
                    var newTimeStamp = report.created_at.split("T").shift();
                    var dateTime = date;
                    console.log("datetimeReportWall: ", dateTime);
                    console.log("newTimeStampReportWall", newTimeStamp);

                    if (newTimeStamp === dateTime) {
                        return (
                            <div key={report.id} id="report">
                                <div>
                                    <p> CONTROL </p>
                                    <h1> {report.line_vbb} </h1>
                                </div>
                                <div>
                                    <p> DIRECTION </p>
                                    <h3>{report.direction_id}</h3>
                                </div>
                                <div>
                                    <p>in {report.location_id}</p>
                                    <p>
                                        {" "}
                                        at{" "}
                                        {report.created_at
                                            .split("T")[1]
                                            .slice(0, -5)}
                                        / /
                                        {report.created_at.split("T").shift()}
                                    </p>
                                </div>
                                <div>
                                    <p> comments: </p>
                                    <p> {report.comment} </p>
                                    <div />
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        );

        return (
            <div>
                <div id="chat-container" className="chat-msg-container">
                    {reportList}
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    console.log("global state in ReportWall: ", state);

    return state;
};

export default connect(mapStateToProps)(ReportWall);
