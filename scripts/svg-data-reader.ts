/*
SVG ファイルを解析する処理
*/

/**
 * SVG ファイル内の view 要素から、id と viewBox の値のリストを取得する
 */
export function getViewDataList(svg: string): { id: string; viewBox: string }[] {
  const outputArray = [];

  // view 要素の一覧を取得する
  const viewRe = svg.match(/<view(.*?)>/g);

  // view 要素がなかったら空配列を返す
  if (!viewRe) {
    return [];
  }

  // view 要素の中に id と viewBox があるとき、出力に追加する
  for (const view of viewRe) {
    const idRe = /id="(.*?)"/.exec(view);
    const viewBoxRe = /viewBox="(.*?)"/.exec(view);
    if (idRe && viewBoxRe) {
      outputArray.push({ id: idRe[1], viewBox: viewBoxRe[1] });
    }
  }

  return outputArray;
}
