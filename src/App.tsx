import { useCallback, useEffect, useState } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
  useMap,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";
import type { InitialUrlState, MapView } from "./types";
import { STYLES } from "./constants";
import { parseInitialUrlState, updateUrlFromState } from "./urlState";

/** window.map をブラウザのコンソールから型安全に参照できるようにする */
declare global {
  interface Window {
    map?: ReturnType<typeof useMap>["current"];
  }
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
        <ExposeMap />
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
 * useMap で取得した地図参照をブラウザのコンソールから使えるようにする
 *
 * ブラウザのコンソールから `map` にアクセスすることで、データの調査が可能。
 * 例えば以下のようにして、地図データに含まれる地名をフィルタリングしつつ一覧表示するようなことが可能となる。
 *
 * ```
 * const features = map.querySourceFeatures("openmaptiles", {
 *   sourceLayer: "place"
 * });
 * console.table(
 *   features
 *     .filter(f =>
 *       /絞り込む地名/.test(
 *         `${f.properties.name ?? ""}${f.properties["name:ja"] ?? ""}`
 *       )
 *     )
 *     .map(f => ({
 *       name: f.properties.name,
 *       name_ja: f.properties["name:ja"],
 *       class: f.properties.class,
 *       rank: f.properties.rank,
 *       capital: f.properties.capital
 *     }))
 * );
 * ```
 */
function ExposeMap() {
  const map = useMap().current;

  useEffect(() => {
    if (!map) {
      return;
    }

    window.map = map;
    return () => {
      if (window.map === map) {
        delete window.map;
      }
    };
  }, [map]);

  return null;
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
