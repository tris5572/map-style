import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  type StyleSpecification,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import * as mapStyleJson from "../public/styles/light.json";

export function App() {
  return (
    <div id="map">
      <Map
        initialViewState={{
          latitude: 36,
          longitude: 138,
          zoom: 7,
        }}
        mapStyle={mapStyleJson as StyleSpecification}
        attributionControl={false}
      >
        <ScaleControl />
        <NavigationControl />
        <FullscreenControl />
        <GeolocateControl />
      </Map>
    </div>
  );
}
