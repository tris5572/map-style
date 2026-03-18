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
  { key: "dark", name: "Dark", json: darkStyleJson as unknown as StyleSpecification },
  { key: "light", name: "Light", json: lightStyleJson as unknown as StyleSpecification },
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

const DEFAULT_STYLE_INDEX = 0;

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
 * URL に含まれるスタイル名を読み取り、不正値は既定値へ戻す。
 */
function parseStyleIndexFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const styleKey = params.get("style");

  if (styleKey === null) {
    return DEFAULT_STYLE_INDEX;
  }

  const styleIndex = STYLES.findIndex((style) => style.key === styleKey.toLowerCase());

  if (styleIndex === -1) {
    return DEFAULT_STYLE_INDEX;
  }

  return styleIndex;
}

/**
 * 現在の地図表示位置とスタイルを URL クエリへ反映する。
 */
function updateUrlFromState(viewState: MapView, styleIndex: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("lat", viewState.latitude.toFixed(6));
  url.searchParams.set("lng", viewState.longitude.toFixed(6));
  url.searchParams.set("zoom", viewState.zoom.toFixed(2));
  url.searchParams.set("style", STYLES[styleIndex].key);
  window.history.replaceState(null, "", url);
}

/**
 * 地図本体とスタイル切替 UI を表示する。
 */
export function App() {
  const [initialViewState] = useState<MapView>(() => parseViewStateFromUrl());
  const [currentViewState, setCurrentViewState] = useState<MapView>(() => parseViewStateFromUrl());
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(() => parseStyleIndexFromUrl());

  /** 選択中の地図スタイルを更新する */
  const handleStyleChange = useCallback(
    (index: number) => {
      setSelectedStyleIndex(index);
      updateUrlFromState(currentViewState, index);
    },
    [currentViewState],
  );

  /** 地図の移動やズームに応じて URL を更新する */
  const handleMove = useCallback(
    (event: { viewState: MapView }) => {
      setCurrentViewState(event.viewState);
      updateUrlFromState(event.viewState, selectedStyleIndex);
    },
    [selectedStyleIndex],
  );

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
  /** クリックされたスタイル番号を親コンポーネントへ通知する */
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
