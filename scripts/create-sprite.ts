/*
スプライトを自動生成するスクリプト。

`pnpm sprite` のコマンドを実行することにより、SVG ファイルのスプライトを、
PNG へ変換するとともに情報の JSON ファイルを生成し、デプロイで使用するフォルダへとコピーする。
*/

import { svg2png, initialize } from "svg2png-wasm";
import { readFileSync, writeFileSync } from "node:fs";

const SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="hsl(200 20% 50%)" />
</svg>`;

// Wasm を読み込んで初期化
await initialize(readFileSync("./node_modules/svg2png-wasm/svg2png_wasm_bg.wasm"));

export async function create() {
  const png1 = await svg2png(SVG, {
    scale: 1,
  });

  writeFileSync("./public/sprite.png", png1);

  console.log("Sprite Create Completed");
}

await create();
