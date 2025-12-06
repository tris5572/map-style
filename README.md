# map-style

MapLibre GL JS で使用する地図スタイルを提供するリポジトリ。

## 使い方

MapLibre GL JS の `style` として、提供しているスタイルファイル(`JSON`)の URL を指定する。

React で表示する例は、本リポジトリの [`src/` 以下](https://github.com/tris5572/map-style/tree/main/src)を参照。

## 提供しているスタイル

表示サンプルは https://tris5572.github.io/map-style/ で確認可能。

### Dark

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/cebec66f-f2ea-4609-ad88-3dca46b1d10b" />

暗い色のスタイル。

`https://tris5572.github.io/map-style/dark/style.json`

### Light

<img width="400" alt="Image" src="https://github.com/user-attachments/assets/c9de2ad5-7ca2-40b2-9114-7976bd8d9022" />

明るい色のスタイル。

`https://tris5572.github.io/map-style/light/style.json`

## モチベーション

自分が使いたい地図スタイル（ダークモードなど）が見付からなかったため、自分で作成した。

POI のアイコンとなるスプライトについても、自分好みのものを作成している。

---

## 開発時の備考メモ

### 新スタイル追加時の作業

- `public/<スタイル名>/style.json` を作成
  - スタイルを編集
  - `"sprite": "http://localhost:5173/map-style/<スタイル名>/sprite",` へ変更
    - ただし既存のスプライトをそのまま利用する場合は、以降の手順とともに不要
- `sprite-svg/<スタイル名>.svg` を作成し、スプライトを編集
- `scripts/create-sprite.ts` の `TARGET_STYLE_NAMES` に `"<スタイル名>"` の文字列を追加

### スプライト

SVG で作成したスプライトを PNG へ変換するスクリプトを内包している。

1. `/sprite-svg/` ディレクトリへ、テーマ名と同じ名前の SVG ファイル（例えば `dark.svg` を作成する）
   - SVG ファイルには、POI のスプライト内での配置情報として、`view` 要素に `id` と `viewBox` を指定する。
2. `pnpm sprite` を実行すると、スプライトの画像ファイル（PNG）と配置情報（JSON）が作成される。
   - ビルド時にはこのコマンドが実行されてファイルが配置されるため、ローカルでの確認時以外には実行不要。

### 開発中の挙動確認

開発中にローカルで挙動を確認する場合、以下のように行う。

- `pnpm dev` でローカル起動する。
  - ローカルの URL（基本的に http://localhost:5173/map-style となる）にブラウザでアクセスする。
- 地図スタイル（`style.json`）の変更は、ホットリロードで自動的に更新される。
- スプライトの SVG ファイル（`***.svg`）の変更時は、`pnpm sprite` を実行して PNG ファイル等を生成後、ページの再読み込みやスタイルの切り替えを行うことで更新される。
  - このときに作成された `.png` と `.json` は、コミット・プッシュする必要はない。ビルド時に自動的に実行・生成されるため。
