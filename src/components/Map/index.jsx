import React, { Component, Fragment } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import List from "../List";
import ListItem from "../ListItem";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWtub3QiLCJhIjoiY2pnZDg3NmRlNDRnMTM0bGp0bHh3aHJ0ZSJ9.Ibybk6NhLb4xuGnyW2HiTQ"; //TODO - get dotenv for this

class Map extends Component {
  state = {
    lng: 5,
    lat: 34,
    zoom: 1.5,
    travelDestinations: [],
    currentCoordinates: {}
  };

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    // const geoCoder = this.initializeGeoCoder();

    this.map = this.initializeMap();
    // this.map.addControl(geoCoder);
    this.updateMapOnMove();
    // geoCoder.on("result", ev => {});

    this.map.on("load", () => {
      const popup = new mapboxgl.Popup({ offset: 40, closeOnClick: false });
      const marker = new mapboxgl.Marker();
      const travelDestinations = [];

      this.map.addSource("single-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });

      this.map.addLayer({
        id: "point",
        source: "single-point",
        type: "circle",
        paint: {
          "circle-radius": 8,
          "circle-color": "#007cbf"
        }
      });

      this.map.on("click", e => {
        const lngLat = e.lngLat;
        this.setState({ currentCoordinates: lngLat });

        popup
          .setLngLat(lngLat)
          .setHTML(
            `<h4>Name you destination</h4> <input id="user-input" type="text"/> <br></br> <button id="submit-btn">save place</button>`
          )
          .addTo(this.map);

        //  marker.setLngLat(lngLat).addTo(this.map);

        this.map.getSource("single-point").setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [e.lngLat.lng, e.lngLat.lat]
              }
            }
          ]
        });
      });

      this.map.on("sourcedataloading", (e, error) => {
        if (e.isSourceLoaded) {
          const userInput = document.getElementById("user-input");
          const submitBtn = document.getElementById("submit-btn");

          submitBtn.addEventListener("click", () => {
            const input = userInput.value && userInput.value;
            if (input !== "") {
              travelDestinations.push({
                destination: input,
                coordinates: this.state.currentCoordinates
              });
              this.setState({ travelDestinations });
              const markerPopup = new mapboxgl.Popup({ offset: 40 }).setHTML(
                `<h3> ${input} </h3>`
              );
              new mapboxgl.Marker()
                .setLngLat(this.state.currentCoordinates)
                .setPopup(markerPopup)
                .addTo(this.map);

              popup.remove();
            } else return;
          });
        }
      });
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  updateMapOnMove = () => {
    this.map.on("move", () => {
      const { lng, lat } = this.map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2)
      });
    });
  };

  initializeMap = () => {
    return new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v10?optimize=true",
      zoom: 2
    });
  };

  /* initializeGeoCoder = () => {
    return new MapboxGeocoder({
      accessToken:
        "pk.eyJ1IjoiYWtub3QiLCJhIjoiY2pnZDg3NmRlNDRnMTM0bGp0bHh3aHJ0ZSJ9.Ibybk6NhLb4xuGnyW2HiTQ" //TODO - get dotenv for this
    });
  };*/

  flyTo = () => {
    this.map.flyTo();
  };

  render() {
    return (
      <Fragment>
        <div className="app" ref={el => (this.mapContainer = el)}>
          <div className="list-head">
            <p>List</p>
          </div>
          <List>
            <ListItem
              onClick={this.flyTo}
              travelDestinations={this.state.travelDestinations}
            />
          </List>
        </div>
      </Fragment>
    );
  }
}

export default Map;
