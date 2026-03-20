import { useCallback, useEffect, useState } from "react";
import Map, { FullscreenControl, GeolocateControl, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import type { InitialUrlState, MapView } from "./types";
import { STYLES } from "./constants";
import { parseInitialUrlState, updateUrlFromState } from "./urlState";

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
