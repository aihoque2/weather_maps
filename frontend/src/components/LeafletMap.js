import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import statesData from "../extras/us-states-polygons.js";
import "leaflet/dist/leaflet.css";

const stateStyle = {
  color: "black",
  weight: 3,
  fillColor: "red",
  fillOpacity: 0.5,
};

function onEachState(feature, layer) {
  layer.bindTooltip(feature.properties.name);
}

export default function LeafLetMap() {
  return (
    <MapContainer
      center={[39.8, -98.6]}
      zoom={4}
      style={{
        height: "700px",
        width: "100%",
      }}
    >
      {/* actual geographic map */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* YOUR STATE POLYGONS */}
      <GeoJSON
        data={statesData}
        style={stateStyle}
        onEachFeature={onEachState}
      />
    </MapContainer>
  );
}

/* LeafLetMap.css */

// .map-wrapper {
//   width: 100%;
//   height: 700px;
// }

// .leaflet-map {
//   width: 100%;
//   height: 100%;
//   z-index: 0;
// }