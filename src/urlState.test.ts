import { afterEach, describe, expect, test, vi } from "vitest";
import { DEFAULT_STYLE_INDEX, DEFAULT_VIEW_STATE } from "./constants";
import { parseInitialUrlState, parseNumericQueryParam, updateUrlFromState } from "./urlState";

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

type MockWindow = {
  location: {
    search: string;
    href: string;
  };
  history: {
    replaceState: ReturnType<typeof vi.fn>;
  };
};

function setMockWindow(url: string): MockWindow {
  const parsedUrl = new URL(url);
  const mockWindow: MockWindow = {
    location: {
      search: parsedUrl.search,
      href: parsedUrl.href,
    },
    history: {
      replaceState: vi.fn(),
    },
  };

  Object.defineProperty(globalThis, "window", {
    value: mockWindow,
    configurable: true,
    writable: true,
  });

  return mockWindow;
}

afterEach(() => {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, "window");
});

describe("parseNumericQueryParam()", () => {
  test("キーが存在しないときは null を返す", () => {
    const params = new URLSearchParams("lat=35");

    expect(parseNumericQueryParam(params, "zoom")).toBeNull();
  });

  test("不正な数値が指定されたときは null を返す", () => {
    const params = new URLSearchParams("zoom=abc");

    expect(parseNumericQueryParam(params, "zoom")).toBeNull();
  });

  test("数値なら数値を返す", () => {
    const params = new URLSearchParams("zoom=12.5");

    expect(parseNumericQueryParam(params, "zoom")).toBe(12.5);
  });
});

describe("parseInitialUrlState()", () => {
  test("view と style が有効なとき、URLから状態を復元する", () => {
    setMockWindow("https://example.com/map-style?lat=35.6812&lng=139.7671&zoom=14.25&style=LIGHT");

    expect(parseInitialUrlState()).toEqual({
      viewState: {
        latitude: 35.6812,
        longitude: 139.7671,
        zoom: 14.25,
      },
      styleIndex: 1,
      shouldRewriteUrl: false,
    });
  });

  test("view パラメータが不完全なとき、デフォルト値を使い URL 書き換えフラグを立てる", () => {
    setMockWindow("https://example.com/map-style?lat=35.6812");

    expect(parseInitialUrlState()).toEqual({
      viewState: DEFAULT_VIEW_STATE,
      styleIndex: DEFAULT_STYLE_INDEX,
      shouldRewriteUrl: true,
    });
  });

  test("style が不正なとき、style はデフォルトにして URL 書き換えフラグを立てる", () => {
    setMockWindow("https://example.com/map-style?style=unknown");

    expect(parseInitialUrlState()).toEqual({
      viewState: DEFAULT_VIEW_STATE,
      styleIndex: DEFAULT_STYLE_INDEX,
      shouldRewriteUrl: true,
    });
  });
});

describe("updateUrlFromState()", () => {
  test("地図状態とスタイルをクエリに反映する", () => {
    const mockWindow = setMockWindow("https://example.com/map-style");

    updateUrlFromState({ latitude: 35.6812367, longitude: 139.7671248, zoom: 14.235 }, 1);

    expect(mockWindow.history.replaceState).toHaveBeenCalledTimes(1);
    const replaceStateArgs = mockWindow.history.replaceState.mock.calls[0];
    const replacedUrl = replaceStateArgs[2] as URL;

    expect(replaceStateArgs[0]).toBeNull();
    expect(replaceStateArgs[1]).toBe("");
    expect(replacedUrl.searchParams.get("lat")).toBe("35.681237");
    expect(replacedUrl.searchParams.get("lng")).toBe("139.767125");
    expect(replacedUrl.searchParams.get("zoom")).toBe("14.23");
    expect(replacedUrl.searchParams.get("style")).toBe("light");
  });
});
