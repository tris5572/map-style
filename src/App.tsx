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
  { name: "Dark", json: darkStyleJson as unknown as StyleSpecification },
  { name: "Light", json: lightStyleJson as unknown as StyleSpecification },
];

type MapView = {
  latitude: number;
  longitude: number;
  zoom: number;
};

const DEFAULT_VIEW_STATE: MapView = {
  latitude: 36,
  longitude: 138,
  zoom: 7,
};

/**
 * URL クエリから数値パラメータを読み取り、不正値は null として扱う。
 */
function parseNumericQueryParam(params: URLSearchParams, key: string) {
  const rawValue = params.get(key);

  if (rawValue === null) {
    return null;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
}

/**
 * URL に含まれる座標とズーム値から地図の初期表示位置を組み立てる。
 */
function parseViewStateFromUrl(): MapView {
  const params = new URLSearchParams(window.location.search);
  const latitude = parseNumericQueryParam(params, "lat");
  const longitude = parseNumericQueryParam(params, "lng");
  const zoom = parseNumericQueryParam(params, "zoom");

  if (latitude === null || longitude === null || zoom === null) {
    return DEFAULT_VIEW_STATE;
  }

  return {
    latitude,
    longitude,
    zoom,
  };
}

/**
 * 現在の地図表示位置を URL クエリへ反映する。
 */
function updateUrlFromViewState(viewState: MapView) {
  const url = new URL(window.location.href);
  url.searchParams.set("lat", viewState.latitude.toFixed(6));
  url.searchParams.set("lng", viewState.longitude.toFixed(6));
  url.searchParams.set("zoom", viewState.zoom.toFixed(2));
  window.history.replaceState(null, "", url);
}

export function App() {
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(0);
  const [initialViewState] = useState<MapView>(() => parseViewStateFromUrl());

  const handleStyleChange = useCallback((index: number) => {
    setSelectedStyleIndex(index);
  }, []);

  /** 地図の移動やズームに応じて URL を更新する */
  const handleMove = useCallback((event: { viewState: MapView }) => {
    updateUrlFromViewState(event.viewState);
  }, []);

  return (
    <div id="map">
      <Map initialViewState={initialViewState} mapStyle={STYLES[selectedStyleIndex].json} onMove={handleMove}>
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
  const handleClick = useCallback(
    (index: number) => {
      props.handleStyleChange(index);
    },
    [props],
  );

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
