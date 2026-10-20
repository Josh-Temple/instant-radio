# Chrome Android Read Aloud × Google Search Index：slot07単一URL介入プロトコル

作成日: 2026-10-21（JST）
対象: Josh-Temple/instant-radio
種別: 事前登録した実験手順・ベースライン。**Googleへの申請完了を示す記録ではない**。

## 目的と識別する仮説

主な問いは「Google検索Indexへの登録は、Android Chrome標準『このページを読み上げ』の必要条件または十分条件か」。

- H2-necessary: 未登録のままChrome標準読み上げ可が1件でも同期確認されれば、必要条件仮説を反証できる。
- H2-sufficient: Search Indexに登録されたにもかかわらず、同条件でChrome標準読み上げ不可のURLがあれば、少なくとも登録**だけ**で直ちに有効になるという十分条件仮説を反証できる。ただしChrome固有の更新遅延・クライアントキャッシュを考慮し、継続観測する。
- 同じURLが未登録→登録済みになった時期にRead Aloudも変化しても、時間経過・新たなクロール・別のURL判定・キャッシュ更新などと交絡するため、索引登録が**原因**だとは直ちに言えない。

## 処置群と対照群

| 役割 | 固定URL | 2026-10-21 00時台にWorkから報告されたGoogle Index | 過去のAndroid Chrome実機観測 | 介入 |
|---|---|---|---|---|
| 処置群 | https://josh-temple.github.io/instant-radio/articles/listen-slots/07.html | URL is unknown to Google | 新しい通常Chromeタブでメニューなし | **GSC URL検査から「インデックス登録をリクエスト」1回のみ** |
| 対照群 | https://josh-temple.github.io/instant-radio/articles/listen-slots/01.html | URL is unknown to Google | 新しい通常Chromeタブでメニューなし | **何もしない** |
| 既知の陽性対照 | https://josh-temple.github.io/instant-radio/ | URL is on Google | 新しいChromeタブでメニューあり・再生成功・現行本文と一致 | 変更しない |
| 既知の陰性対照 | https://josh-temple.github.io/instant-radio/index.html | URL is unknown to Google | 新しいChromeタブでメニューなし | 変更しない |

過去のAndroid結果とGSC結果は厳密に同時刻ではない。新規データと混同しない。

現行mainの比較ベース: `1b28ebf4b7cbae6679a964dbfc5d818c4309ee22`
- `index.html`: blob `0eaecbaf49160e0947c3cb34640f5d3b6efd8ef9`（動作確認済み、絶対に実験で書き換えない）
- slot07: blob `17e29ede796ebbf2bcc8b952b41dd0a2513633cc`
- slot01: blob `ef3544e449917eece71cd5961587dfcd6a7b4fcb`
- `articles/listen-slots/registry.json`: blob `8b3cea1bbe4aee075b9305dd4802f2264d533573`、100件ともread_aloud_status = not_checked

## フェーズ0：介入直前の再測定（必須）

Work Cloud BrowserでGoogle Search Consoleの該当URLプレフィックスプロパティを開き、**01と07の2件とも**現在のGoogle Indexの状態をURL検査する。ブラウザ画面の実測と時刻を保存し、ライブテスト結果とは区別する。

以下の場合は申請を保留し、次の対応を決める：
- 07が既に登録済み（介入対象としての前提を失う）。
- 01が先に登録済み（対照群の出発点が変化）。
- 対象URLのcanonical、インデックス許可、クロール取得の状態が前回結果から実質的に変化した。
- GSCにログインできない／対象プロパティが確認できない。

07・01が引き続き未登録かつ07のライブテストが「インデックス可能」であればフェーズ1へ。GSCの画面の**日時・タイムゾーン**は表示に忠実に記録し、未表示なら勝手に補わない。

Android実機側では同じChromeアプリ・プロファイルで新しい通常タブから01/07を開き、Chromeバージョン、読み上げメニュー有無、音声再生有無、最終URL、JST時刻をユーザーが別途記録する。WorkのCloud BrowserはAndroidネイティブメニューを検証できないため、Workが独自に確認したと表現しない。時間差がある場合はその限界を明記する。

## フェーズ1：唯一の介入（GSCで07だけ）

1. 07のGoogle Search Console URL検査結果画面から**「インデックス登録をリクエスト」**を**1回**押す。
2. Google側が受け付けた場合のみ、完了画面の正確な表示（たとえば `Indexing requested` とその日時）を記録・証拠保存する。
3. 成功・失敗・クォータ・制限・認証切れのいずれも実際の表示を記録。受理が確認できない場合は「申請完了」としない。
4. **01には申請しない**。併せてsitemap提出、サイトマップ新設、robots.txt変更、内部リンク追加、canonical変更、本文更新、キャッシュ削除、Google Indexing API呼び出しをしない。

公式根拠：
- Google Search Central: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- GSC URL Inspection: https://support.google.com/webmasters/answer/9012289?hl=ja
- Indexing APIは一般の記事ページを対象としない: https://developers.google.com/search/apis/indexing-api/v3/quickstart

「リクエストが受理された」ことは「クロールされた」「Indexに載った」「Chromeの読み上げが有効になった」と同義ではない。Googleは登録を保証せず、数日から数週間かかる場合がある。

## フェーズ2：介入後の縦断観測

観測点は**介入直後、概ね1日後、3日後、7日後、14日後**。厳密な時間帯指定ではなく、実測された日時を保存する。実行不能な回は未実施として扱う。

各観測点で07・01の双方について以下の2種類を分離記録する。

**A. GSC（Workで実行可能）**
- 検査URL、Index登録済み/未登録とその理由
- 最終クロール、Googlebot、ページ取得、Google-selected canonical、user-declared canonical
- ライブURLテストは必要な場合のみ、Index状態と明確に区別
- スクリーンショット／日時／検査担当

**B. Android実機（ユーザーが確認）**
- Chromeアプリの通常の新規タブ、最終URL、Chromeバージョンとプロファイル
- Chromeネイティブ「このページを読み上げ」メニュー有無
- メニューありなら再生開始成否と実際の最初の読み上げ文字列（表示本文との一致）
- Web Speech APIのアプリ内再生とは区別

観測結果は日付付きの追補に追記する。欠測は補間しない。公式Chrome実装のURL単位キャッシュ（参考ソース: https://chromium.googlesource.com/chromium/src/%2B/06d300357b510d33bf53b8e8b5cdbd736dae676c/chrome/browser/readaloud/android/java/src/org/chromium/chrome/browser/readaloud/ReadAloudController.java）を考慮し、変化直後の端末結果の解釈は慎重に行う。

## 事前に定義する解釈

1. **07は登録済み、Chromeは不可のまま：** 検索登録**だけ**では即時十分でないことを支持。遅延評価を区別するため継続観測。
2. **07が登録済みになりChromeも可、01は未登録で不可：** 登録とChrome適格性の関連を支持するが、交絡を除けず因果の証明ではない。
3. **07は未登録のままChrome可：** 同時刻のGSC確認があれば「検索インデックス登録は必要条件」を直接反証。
4. **01が申請なしで登録済みになった：** 対照群で自発的変化。効果の帰属が困難になり介入効果は未判定に戻す。
5. **07が14日後も未登録：** 本介入ではIndex登録という中間状態が成立しなかった。Chrome仮説に判定を下さず、介入の不奏効として記録。
6. **読めても旧本文を話す：** メニュー可否と本文抽出は別指標として扱い、成功扱いにしない。

## リリース・安全性ルール

- この事前登録文書以外はGitHubで変更しない。root、slot、registry、PWA、Vercel、robots、サイトマップを触らない。
- 検証データは事実・担当・時刻・証拠URLに分離する。
- 介入前にユーザーが「進めてください」と承認した実験範囲は、**07への単発GSC申請**のみ。01への申請や複数手段での索引促進は新たな承認なしに行わない。
- GSCブラウザ操作への権限がないチャットで実行済みと偽らない。
