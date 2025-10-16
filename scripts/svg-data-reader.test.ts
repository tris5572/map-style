import { describe, expect, test } from "vitest";
import { getViewDataList } from "./svg-data-reader";

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
