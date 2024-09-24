import React, { Component } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import { connect } from "react-redux";

export class MapContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showingInfoWindow: false, //Hides or the shows the infoWindow
            activeMarker: {}, //Shows the active marker upon click
            selectedPlace: {} //Shows the infoWindow to the selected place upon a marker
        };
    }

    render() {
        const mapreport = this.props.mapreports;

        console.log("mapreports: ", mapreport);

        //
        if (!mapreport) {
            return null;
        }

        var lat = mapreport.map(report => {
            return report.latitude;
        });

        console.log("lat mapreport: ", lat);
        var lng = mapreport.map(report => {
            return report.longitude;
        });

        console.log("lng mapreport: ", lng);

        // let title = "schlossPark";
        return (
            <div id="mapcontainer">
                <Map
                    id="map"
                    google={this.props.google}
                    zoom={12}
                    initialCenter={{
                        lat: 52.521918,
                        lng: 13.413215
                    }}
                >
                    {mapreport.map(report => {
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
                        console.log("datetime: ", dateTime);
                        console.log("newTimeStamp", newTimeStamp);
                        let pos = {
                            lat: report.station.latitude,
                            lng: report.station.longitude
                        };
                        if (newTimeStamp === dateTime) {
                            return (
                                <Marker
                                    title={report.station.name}
                                    position={pos}
                                />
                            );
                        }
                    })}

                    {mapreport.map(report => {
                        let pos = {
                            lat: report.station.latitude,
                            lng: report.station.longitude
                        };
                        return (
                            <InfoWindow
                                title={report.station.name}
                                position={pos}
                            />
                        );
                    })}
                </Map>
            </div>
        );
    }
}
const mapStateToProps = state => {
    const stations = state.allStationsVbb;
    const reports = state.controlReports;
    console.log("stations in mapcontainer: ", stations);
    console.log("reports in mapcontainer: ", reports);

    if (!stations || !reports) {
        return null;
    } else {
        // function get_location(array) {
        //     for (var i = 0; i < array.length; i++) {
        //         return array[i].location_id;
        //     }
        // }
        // var onlylocations = get_location(reports);
        // console.log("onlylocations: ", onlylocations);

        let onlyLoc = reports.map(report => {
            return {
                location_id: report.location_id,
                created_at: report.created_at
            };
        });
        console.log("onlyloc: ", onlyLoc);
        console.log("stations: ", stations);

        function getReport(arr1, arr2) {
            let mapReport = [];
            for (var i = 0; i < arr1.length; i++) {
                for (var j = 0; j < arr2.length; j++) {
                    if (arr1[i].name == arr2[j].location_id) {
                        mapReport.push({
                            station: arr1[i],
                            created_at: arr2[j].created_at
                        });
                    }
                }
            }
            return mapReport;
        }
        var mapreports = getReport(stations, onlyLoc);

        // const singlereport = stations.filter(
        //     station =>
        //         station.name ==
        //         reports.map(report => {
        //             return report.location_id;
        //         })
        // );
        // console.log("singlereport: ", singlereport);

        // const user ={ ...mapReport, }

        // var result = stations.map((station)=>{
        //     {
        //
        //         ...station, reports.find(report=> report.location_id == station.name)
        //
        //     }
        //
        // }

        // Object.assign(
        //     {},
        //     message,
        //     LinkCount.find(link => link.day === message.day) || {}
        // );

        // const mapReports = {};
        //
        //
        //
        // var reportedStations = stations.filter(
        //     station => station.name == onlylocations
        // );
        // console.log("reportedStations: ", reportedStations);

        // function get_station(array) {
        //     for (var i = 0; i < array.length; i++) {
        //         return array[i].lat;
        //     }
        // }
        // var singleStation = get_station(stations);
        // console.log("singleStation: ", singleStation);
    }
    // function mapReport(reports, stations) {
    //     const stationsLen = stations.length;
    //     const reportsLen = reports.length;
    //     for (var i = 0; i < reportsLen; i++) {
    //         for (var j = 0; j < stationsLen; j++) {
    //             if (reports[i].name == stations[j].name) {
    //                 return stations[j];
    //             }
    //         }
    //     }
    // }
    //
    // mapReport();

    return {
        mapreports: mapreports
    };
};

export default connect(mapStateToProps)(
    GoogleApiWrapper({
        apiKey: "AIzaSyBLaT70MnI1tvmvd-NwXEZq-h3JtPXZo7k"
    })(MapContainer)
);
