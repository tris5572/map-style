/**
 * 地図ビューを表す型
 *
 * 中心座標（緯度・経度）とズームレベルをまとめて保持する
 */
export type MapView = {
  /** 中心点の緯度（小数、度単位） */
  latitude: number;
  /** 中心点の経度（小数、度単位） */
  longitude: number;
  /** ズームレベル（数値） */
  zoom: number;
};

/**
 * 初期URLに含めるアプリケーション状態を表す型
 *
 * ページ読み込み時にURLへシリアライズして復元可能な情報をまとめる
 */
export type InitialUrlState = {
  /** 表示する地図の状態（MapView） */
  viewState: MapView;
  /** 選択中のマップスタイルのインデックス */
  styleIndex: number;
  /** アプリ起動時にURLを書き換えるかどうかのフラグ */
  shouldRewriteUrl: boolean;
};
