import React, { Component } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWtub3QiLCJhIjoiY2pnZDg3NmRlNDRnMTM0bGp0bHh3aHJ0ZSJ9.Ibybk6NhLb4xuGnyW2HiTQ"; //TODO - get dotenv for this

class Map extends Component {
  state = {
    lng: 5,
    lat: 100,
    zoom: 1.5
  };

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v10?optimize=true"
    });

    this.map.on("move", () => {
      const { lng, lat } = this.map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2)
      });
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div className="app" ref={el => (this.mapContainer = el)} />;
  }
}

export default Map;
