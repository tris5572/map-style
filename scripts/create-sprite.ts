/*
スプライトを自動生成するスクリプト。

`pnpm sprite` のコマンドを実行することにより、SVG ファイルのスプライトを、
PNG へ変換するとともに情報の JSON ファイルを生成し、デプロイで使用するフォルダへとコピーする。
*/

import { svg2png, initialize } from "svg2png-wasm";
import { readFileSync, writeFileSync } from "node:fs";
import { createSpriteJson, doubledSpriteJson } from "./sprite-utils.ts";

/** 処理対象のスタイル名。フォルダ名やスプライトのファイル名を同名にする必要がある。 */
const TARGET_STYLE_NAMES = ["dark", "light"];

const OUTPUT_DIR = "./public/";

// Wasm を読み込んで初期化
await initialize(readFileSync("./node_modules/svg2png-wasm/svg2png_wasm_bg.wasm"));

/**
 * SVG ファイルから、スプライトの画像と JSON を生成して保存する。
 */
export async function create() {
  for (const name of TARGET_STYLE_NAMES) {
    const svg = readFileSync(`./sprite-svg/${name}.svg`).toString();

    const png1 = await svg2png(svg, {
      scale: 1,
    });
    const spriteData1 = createSpriteJson(svg);
    writeFileSync(`${OUTPUT_DIR}${name}/sprite.png`, png1);
    writeFileSync(`${OUTPUT_DIR}${name}/sprite.json`, JSON.stringify(spriteData1));

    // 高解像度用のデータを生成
    const png2 = await svg2png(svg, {
      scale: 2,
    });
    const spriteData2 = doubledSpriteJson(spriteData1);
    writeFileSync(`${OUTPUT_DIR}${name}/sprite@2x.png`, png2);
    writeFileSync(`${OUTPUT_DIR}${name}/sprite@2x.json`, JSON.stringify(spriteData2));
  }
}

await create();
