import type { InitialUrlState, MapView } from "./types";
import { DEFAULT_STYLE_INDEX, DEFAULT_VIEW_STATE, STYLES } from "./constants";

/**
 * URL クエリから数値パラメータを読み取り、不正値は null として扱う。
 */
export function parseNumericQueryParam(params: URLSearchParams, key: string) {
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
export function parseInitialUrlState(): InitialUrlState {
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
export function updateUrlFromState(viewState: MapView, styleIndex: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("lat", viewState.latitude.toFixed(6));
  url.searchParams.set("lng", viewState.longitude.toFixed(6));
  url.searchParams.set("zoom", viewState.zoom.toFixed(2));
  url.searchParams.set("style", STYLES[styleIndex].key);
  window.history.replaceState(null, "", url);
}
