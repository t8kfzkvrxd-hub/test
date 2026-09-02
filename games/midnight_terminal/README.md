# 午前0時の終着駅

スマホ横画面で遊ぶ、長編化を前提に整理したビジュアルノベルです。

## 開き方

ESモジュールを使うため、ローカルでもWebサーバー経由で開きます。公開するときも、この `midnight_terminal` フォルダごとWebサーバーへ置きます。

```bash
python3 -m http.server 8001 --directory games/midnight_terminal
```

起動後は `http://localhost:8001` を開きます。

## 構成

- `src/main.js`: 起動とボタン操作
- `src/data/chapters/`: 章ごとのシナリオデータ
- `src/data/assets.js`: 背景・イベントCGなどの素材パス
- `src/engine/`: 状態、保存、描画、演出、シーン進行
- `src/ui/`: メニュー、ログ、セーブUIの補助

次の章を追加するときは `src/data/chapters/chapter01.js` を作り、
`prologue.js` と同じように章ID・開始シーンID・シーンIDを定義します。

## 素材を追加するとき

- 背景: `assets/backgrounds/`
- イベントCG: `assets/events/`
- 立ち絵: `assets/characters/`
- BGM・SE: `assets/audio/`

現在は立ち絵が未完成なので、該当シーンでは仮のシルエットを表示します。
