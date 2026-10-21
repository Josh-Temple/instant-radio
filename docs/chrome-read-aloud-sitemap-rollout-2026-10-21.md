# Google Search Console サイトマップ提出 — 全100スロット展開

日付：2026-10-21 JST
Repository: `Josh-Temple/instant-radio`
対象プロパティ：`https://josh-temple.github.io/instant-radio/`

## 対象と変更範囲

Googleに大量URLを発見してもらうため、GitHub Pagesのプロジェクトルートに新規 `sitemap.xml` を配置する。

公開予定URL：`https://josh-temple.github.io/instant-radio/sitemap.xml`

- 102 URL: トップページ `/instant-radio/`、読み物一覧 `/instant-radio/articles/listen-slots/`、固定記事 `/instant-radio/articles/listen-slots/01.html`〜`100.html` の100件。
- URLは既存 `articles/listen-slots/registry.json` の`public_url`から取得。01・07・91〜100を含む。重複なし。
- Googleの正式XMLサイトマップ形式。各`loc`は同じプロパティ内のcanonical想定の絶対HTTPS URL。`/instant-radio/index.html`の重複表記は載せず、トップページは`/instant-radio/`を採用。
- `lastmod`は公開された記事の実際の最終重要更新日時がURLごとに確認できないため付けない。`priority` / `changefreq`も付けない。
- 実験用URL、非公開ワークスペース、アプリの内部ルート、対照実験用の別名URLは載せない。
- `robots.txt`は追加しない。プロジェクトページ内の`/instant-radio/robots.txt`はホスト直下の`/robots.txt`と異なり、標準robots発見経路にならないため。
- 記事HTML、canonical、スロット登録状況、PWA、Vercel、既存READMEは変更しない。

Google公式根拠：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## 掲載目的と実験への影響

2026-10-21のslot07単独介入では、07へのGSC `REQUEST INDEXING`受理後に、Google Index登録とユーザー実機Chrome標準音声再生の両方が確認された。slot01は当時GSC未登録・実機読み上げ不可の**無処置対照**だった。詳細は`docs/chrome-read-aloud-gsc-slot07-intervention-2026-10-21.md`。

**このサイトマップ公開・提出は01を含む全100スロットへの新たな一括発見促進介入である。** したがって、この時点から01を「一切Googleへの働きかけをしていない継続対照群」と呼ぶことはできない。ただし、01への*個別インデックス登録リクエスト*は引き続き未実施。

サイトマップ提出後、01もGoogleにインデックス登録され、Chrome標準読み上げが有効になるかを追跡する。07の再申請はしない。個別URL申請とサイトマップ提出の作用は異なり、同じ速さ／同じ結果になることは保証されない。登録済み／未登録と音声読み上げ可能／不可の状態を独立に測定し、因果と相関を混同しない。

## リリース受入チェック

1. GitHubで`main`の差分確認：`sitemap.xml`（新設）と本ドキュメント以外が変更されないこと。
2. 102件・重複0件・`01.html`から`100.html`の欠番なし・有効なXML・正しいベースURLを確認。
3. GitHub Pages本番反映後、`https://josh-temple.github.io/instant-radio/sitemap.xml` を匿名HTTP GET。HTTP 200、XML `urlset`、102件の`loc`が読めることを確認。未確認なら本番公開は未確認と報告。
4. **Work Cloud BrowserのGoogle Search Console**で対象プロパティを選択し、左メニューの「サイトマップ / Sitemaps」に移動。`sitemap.xml`（プロパティプレフィックスからの相対パス）を**1回**送信。
5. 送信結果・検出URL数・Googleが取得した日時・エラー・操作時刻（JST）・証拠画面を記録。すでに同じサイトマップが登録済みなら重複送信せず状態確認だけ行う。
6. 今後、Google Index上の01・07・他の代表スロット（例02、08、50、100）の状態と、ユーザーによるAndroid Chromeネイティブメニュー・本文音声再生の実測を、別々の観測として記録。

**重要：** GitHubにサイトマップが公開されても、Google Search Consoleに「送信済み」とは限らない。GSCに受理されたとしても、各URLのクロール・Google検索Index登録・Chrome標準読み上げの有効化は保証されない。

## 今回の作業ログ

- サイトマップのGitHub追加と検証：GitHub PR/mergeで実行・確認。
- GSCでのサイトマップの提出：この作業をWork Cloud Browserへ引き継ぐ。**GSC提出未実施を提出済みと記載しないこと。**
- 過去のslot07単独介入ログは書き換えず、観測時点の意味を保つ。
