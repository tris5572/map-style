import { describe, expect, test } from "vitest";
import { getViewDataList, parseViewBox } from "./sprite-utils";

describe("getViewDataList()", () => {
  test("空の文字列が入力されたときは、空配列を返すこと", () => {
    expect(getViewDataList("")).toEqual([]);
  });

  test("view 要素がないときは、空配列を返すこと", () => {
    const input = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="blue" />
    </svg>`;
    expect(getViewDataList(input)).toEqual([]);
  });

  test("view 要素があるときは、データを返すこと", () => {
    const input = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <view id="view_id" viewBox="0 1 2 3" />
    </svg>`;
    expect(getViewDataList(input)).toEqual([{ id: "view_id", viewBox: "0 1 2 3" }]);
  });

  test("view 要素に閉じタグがあっても、データを返すこと", () => {
    const input = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <view id="view_id" viewBox="0 1 2 3"></view>
    </svg>`;
    expect(getViewDataList(input)).toEqual([{ id: "view_id", viewBox: "0 1 2 3" }]);
  });

  test("id と viewBox が逆でも、データを返すこと", () => {
    const input = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <view viewBox="0 1 2 3" id="view_id" />
    </svg>`;
    expect(getViewDataList(input)).toEqual([{ id: "view_id", viewBox: "0 1 2 3" }]);
  });

  test("id がないとき、データに含まれないこと", () => {
    const input = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <view viewBox="0 1 2 3" />
    </svg>`;
    expect(getViewDataList(input)).toEqual([]);
  });

  test("viewBox がないとき、データに含まれないこと", () => {
    const input = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <view id="view_id" />
    </svg>`;
    expect(getViewDataList(input)).toEqual([]);
  });

  test("複数の view 要素があるとき、データを返すこと", () => {
    const input = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <view id="view_id" viewBox="0 1 2 3" />
      <view id="view_id2" viewBox="6 7 8 9" />
    </svg>`;
    expect(getViewDataList(input)).toEqual([
      { id: "view_id", viewBox: "0 1 2 3" },
      { id: "view_id2", viewBox: "6 7 8 9" },
    ]);
  });
});

describe("parseViewBox()", () => {
  test("通常指定のとき、データを得られること", () => {
    expect(parseViewBox("0 1 2 3")).toEqual({ x: 0, y: 1, width: 2, height: 3 });
  });

  test("複数桁のとき、データを得られること", () => {
    expect(parseViewBox("1 10 100 1000")).toEqual({ x: 1, y: 10, width: 100, height: 1000 });
  });

  test("区切り文字が多いときでも、データを得られること", () => {
    expect(parseViewBox("0  1 \t2 \n3")).toEqual({ x: 0, y: 1, width: 2, height: 3 });
  });

  test("指定が多いときでも、データを得られること", () => {
    expect(parseViewBox("0 1 2 3 4")).toEqual({ x: 0, y: 1, width: 2, height: 3 });
  });

  test("空文字列のとき、undefined を返すこと", () => {
    expect(parseViewBox("")).toBeUndefined();
  });

  test("指定が足りないとき、undefined を返すこと", () => {
    expect(parseViewBox("0 1 2")).toBeUndefined();
  });
});
