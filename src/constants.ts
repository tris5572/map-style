import type { StyleSpecification } from "maplibre-gl";
import * as darkStyleJson from "../public/dark/style.json";
import * as lightStyleJson from "../public/light/style.json";
import type { MapView } from "./types";

/**
 * 利用可能な地図スタイルの一覧。
 *
 * 各要素は以下のプロパティを持つ:
 * - `key`: スタイルを一意に識別するキー
 * - `name`: UIで表示するスタイル名
 * - `json`: maplibre の `StyleSpecification` として扱うスタイル定義
 */
export const STYLES = [
  { key: "dark", name: "Dark", json: darkStyleJson as unknown as StyleSpecification },
  { key: "light", name: "Light", json: lightStyleJson as unknown as StyleSpecification },
];

/** デフォルトの地図表示状態（アプリ起動時の中心座標とズーム） */
export const DEFAULT_VIEW_STATE: MapView = {
  latitude: 36,
  longitude: 138,
  zoom: 7,
};

/** デフォルトで選択されるスタイルのインデックス（`STYLES` 配列のインデックス） */
export const DEFAULT_STYLE_INDEX = 0;
