import { useCallback, useEffect, useState } from "react";
import Map, { FullscreenControl, GeolocateControl, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import type { MapView, InitialUrlState } from "./types";
import { DEFAULT_VIEW_STATE, DEFAULT_STYLE_INDEX, STYLES } from "./constants";

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
 * URL から初期表示に使う地図状態を読み取り、不正な指定の有無も返す。
 */
function parseInitialUrlState(): InitialUrlState {
  const params = new URLSearchParams(window.location.search);
  const latitude = parseNumericQueryParam(params, "lat");
  const longitude = parseNumericQueryParam(params, "lng");
  const zoom = parseNumericQueryParam(params, "zoom");
  const styleKey = params.get("style");
  const hasViewParams = params.has("lat") || params.has("lng") || params.has("zoom");
  const hasCompleteViewParams = params.has("lat") && params.has("lng") && params.has("zoom");

  let viewState = DEFAULT_VIEW_STATE;
  let styleIndex = DEFAULT_STYLE_INDEX;
  let shouldRewriteUrl = false;

  if (hasViewParams) {
    if (hasCompleteViewParams && latitude !== null && longitude !== null && zoom !== null) {
      viewState = {
        latitude,
        longitude,
        zoom,
      };
    } else {
      shouldRewriteUrl = true;
    }
  }

  if (styleKey !== null) {
    const parsedStyleIndex = STYLES.findIndex((style) => style.key === styleKey.toLowerCase());
    if (parsedStyleIndex === -1) {
      shouldRewriteUrl = true;
    } else {
      styleIndex = parsedStyleIndex;
    }
  }

  return {
    viewState,
    styleIndex,
    shouldRewriteUrl,
  };
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
  const [initialUrlState] = useState<InitialUrlState>(() => parseInitialUrlState());
  const [currentViewState, setCurrentViewState] = useState<MapView>(initialUrlState.viewState);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(initialUrlState.styleIndex);

  /** 不正な URL パラメータでアクセスされた場合に、表示中の状態へ URL を補正する */
  useEffect(() => {
    if (!initialUrlState.shouldRewriteUrl) {
      return;
    }
    updateUrlFromState(initialUrlState.viewState, initialUrlState.styleIndex);
  }, [initialUrlState]);

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
      <Map initialViewState={initialUrlState.viewState} mapStyle={STYLES[selectedStyleIndex].json} onMove={handleMove}>
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
