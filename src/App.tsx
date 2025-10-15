import { useCallback, useState } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  type StyleSpecification,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import * as darkStyleJson from "../public/dark/style.json";
import * as lightStyleJson from "../public/light/style.json";

/** 地図スタイルのデータのリスト */
const STYLES = [
  { name: "Light", json: lightStyleJson as StyleSpecification },
  { name: "Dark", json: darkStyleJson as StyleSpecification },
];

export function App() {
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(0);

  const handleStyleChange = useCallback((index: number) => {
    setSelectedStyleIndex(index);
  }, []);

  return (
    <div id="map">
      <Map
        initialViewState={{
          latitude: 36,
          longitude: 138,
          zoom: 7,
        }}
        mapStyle={STYLES[selectedStyleIndex].json}
        attributionControl={false}
      >
        <ScaleControl />
        <NavigationControl />
        <FullscreenControl />
        <GeolocateControl />
      </Map>
      <StyleSwitcher styleIndex={selectedStyleIndex} handleStyleChange={handleStyleChange} />
    </div>
  );
}

/**
 * 地図スタイルの切替ボタンを表示するコンポーネント
 */
function StyleSwitcher(props: { styleIndex: number; handleStyleChange: (index: number) => void }) {
  const handleClick = useCallback((index: number) => {
    props.handleStyleChange(index);
  }, []);

  return (
    <div id="style-switcher">
      <div id="button-wrapper">
        {STYLES.map((st, i) => (
          <button
            key={st.name}
            type="submit"
            className={i === props.styleIndex ? "selected" : undefined}
            onClick={() => {
              handleClick(i);
            }}
          >
            {st.name}
          </button>
        ))}
      </div>
    </div>
  );
}
