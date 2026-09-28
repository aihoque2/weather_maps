import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import statesData from "../extras/us-states-polygons.js";
import "leaflet/dist/leaflet.css";

function onEachState(feature, layer) {
  layer.bindTooltip(feature.properties.name);
}

function onClick(feature){
  console.log("you just clicked" + feature.properties.name);
}

export default function LeafletMap() {
  return (
    <div style={styles.wrapper}>
      <MapContainer
        center={[39.8, -98.6]}
        zoom={4}
        style={styles.map}
      >
        {/* actual geographic map */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* YOUR STATE POLYGONS */}
        <GeoJSON
          data={statesData}
          style={styles.state}
          onEachFeature={onEachState}
        />
      </MapContainer>
    </div>
  );
}

/* LeafletMap.css */
  const styles={
    map:{
      width: "100%",
      height: "100%",
    },

    wrapper: {
      width: "100%",
      height: "700px",
      position: "relative",
      border: "4px solid black",
      borderRadius: "12px",
      overflow: "hidden",
      boxSizing: "border-box",
    },

    state: {
      color: "black",
      weight: 3,
      fillColor: "red",
      fillOpacity: 0.5,
    },

}