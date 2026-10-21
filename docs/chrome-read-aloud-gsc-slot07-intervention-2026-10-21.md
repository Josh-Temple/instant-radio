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

## 2026-10-21 実施記録（介入直前・単発申請、Work Cloud Browser）

検査担当: ChatGPT Work Cloud Browser。対象プロパティ: `https://josh-temple.github.io/instant-radio/`。下記のUTC/JSTは操作側の時計による記録。GSC画面にタイムゾーンの表示がない時刻には、タイムゾーンを補っていない。証拠画像は各リンク先に保存した。

| 段階 | URL | 観測時刻（操作側） | GSC表示・実測 | 画面証拠 |
|---|---|---|---|---|
| 介入直前 Google Index | [slot01](https://josh-temple.github.io/instant-radio/articles/listen-slots/01.html) | 2026-10-21 03:35:45 UTC / 12:35:45 JST | `URL is not on Google`; `Page is not indexed: URL is unknown to Google`。最終クロール・Googlebot・取得・インデックス許可・user-declared / Google-selected canonical はいずれも `N/A`。参照元サイトマップ・ページ検出なし。 | [01 Index](https://chatgpt.com/api/library/files/libfile_c2ca560e435881918de7d47fd09ee588/download) |
| 介入直前 Google Index | [slot07](https://josh-temple.github.io/instant-radio/articles/listen-slots/07.html) | 2026-10-21 03:36:38 UTC / 12:36:38 JST | `URL is not on Google`; `Page is not indexed: URL is unknown to Google`。最終クロール・Googlebot・取得・インデックス許可・user-declared / Google-selected canonical はいずれも `N/A`。参照元サイトマップ・ページ検出なし。 | [07 Index](https://chatgpt.com/api/library/files/libfile_44bc82024df48191a55168c0d468ca62/download) |
| 介入直前 LIVE TEST（Google Indexとは別） | slot07 | 2026-10-21 03:37:46 UTC / 12:37:46 JST | `URL is available to Google`; `Page can be indexed`。画面の `Tested on: Oct 21, 2026, 12:37 PM`、`Crawl Time: Oct 21, 2026, 12:37:29 PM`（画面にタイムゾーン表示なし）。`Google Inspection Tool smartphone`、Crawl allowed `Yes`、Page fetch `Successful`、Indexing allowed `Yes`。user-declared canonical は07の自己URL。Google-selected canonical は `Only determined after indexing`。 | [07 live](https://chatgpt.com/api/library/files/libfile_4aee8ad517f48191b9f937e2f57e26ea/download)、[canonical・取得詳細](https://chatgpt.com/api/library/files/libfile_46cc6d16da98819180084b6eef51571a/download) |
| 唯一の介入 | slot07 | ボタン押下 2026-10-21 03:39:15 UTC / 12:39:15 JST、受理表示確認 03:39:26 UTC / 12:39:26 JST | 07のGoogle Index画面で `REQUEST INDEXING` を**1回**押下。完了ダイアログは `Indexing requested`、`URL was added to a priority crawl queue. Submitting a page multiple times will not change its queue position or priority.`。ダイアログ内に日時表示なし。 | [07申請受理画面](https://chatgpt.com/api/library/files/libfile_cb973fbeff4881919c90be08c05eed96/download) |

01には申請していない。この記録はGoogleが申請を受理したことだけを示し、クロール、検索Index登録、Android Chrome標準「このページを読み上げ」の可否は未確認。Android実機の同期観測はこのWork実行には含まれない。サイトHTML、canonical、sitemap、100スロット、Vercelには変更を加えていない。介入後の独立した再検査は未実施であり、フェーズ2の追跡観測として別途記録する。

## 2026-10-21 介入後Android実機観測：07で読み上げ可能の報告

**証拠の種類:** ユーザー本人のAndroid Chrome実機観測報告。Work Cloud BrowserによるChromeネイティブメニューの自動検証ではない。報告された正確な端末操作時刻は未取得（2026-10-21 JSTの申請受理後にチャットで共有）。本文の録音・スクリーンショット・Chromeバージョン・アドレスバー最終URLも未取得。

申請受理確認は2026-10-21 **12:39:26 JST**（上記実施記録）。その後、ユーザーは前節の「01・07をAndroid Chromeから再確認する」という依頼への回答として、以下を報告した。

> 01は不可でしたが、07が可能でした

### 過去の実機結果と介入後の変化

| URL | 介入前のAndroid実機報告 | 介入後のAndroid実機報告 | 受けた介入 |
|---|---|---|---|
| slot01 | Chromeネイティブ `このページを読み上げ` メニューなし | **読み上げ不可のまま** | GSC申請なし |
| slot07 | Chromeネイティブ `このページを読み上げ` メニューなし | **読み上げ可能になった** | GSCでインデックス登録リクエストを07へ1回送信・受理 |

**重要な未確定項目:** ユーザーの「07が可能でした」が**メニュー表示だけ**を指すのか、実際にボタンを押して**音声が開始・表示中の07本文と一致**したのかはまだ確認されていない。後者が確認されるまで厳密な意味での「記事音声再生成功」と登録ステータス `confirmed` への変更は行わない。また、**07の申請後のGoogle Search Index状態**はこの時点で未検査。「申請受理」「Googleクロール」「Google検索インデックスへの掲載」「Chrome Read Aloudの有効化」は別事象である。

### 解釈と次の必須測定

- 事前指定した介入群slot07に**介入後の肯定的な端末状態変化**が現れ、未申請のslot01は陰性のまま。この時系列・対照群の対比は、索引リクエストや同時期に生じたGoogle/Chrome側のURL評価変更との関連を検証する根拠になる。
- **因果効果は未確定。** 07が偶然この時点でChromeに評価された、GoogleのSearch Indexとは異なるreadability判定が更新された、クライアント側キャッシュが期限切れになったなどの代替説明が残る。
- **最優先:** 同じGoogle Search Consoleプロパティの**Index（非ライブ）URL検査**でslot07・slot01を直ちに再確認し、Google Indexの状態、Google選択canonical、最終クロール、取得時刻、取得結果および画面証拠を記録。**登録リクエストは再送しない。**
- **Android追試:** ユーザーに、slot07でChromeネイティブメニューから実際に音声が開始し、本文が現在表示中の記事と一致するかを確認してもらう。Web Speech APIではなくChrome本体の `このページを読み上げ` を使用。Chromeバージョン・正確な最終URL・JST日時も可能なら記録。
- **登録に関する反証解釈には注意:** Search ConsoleのIndex表示が申請後も「unknown」の場合、Chromeが読めてもSearch Indexの状態が遅延更新されている可能性があるため、その時点の**表示上は未登録で読み上げ可**と記録し、Google内部で未登録のまま十分に読み上げ可能と断定しない。

**変更なしを維持:** `index.html`（既知陽性）、01・07のHTML、canonical、サイトマップ、slot registry、PWA、Vercel、Chromeキャッシュ。対照群01の申請は引き続き禁止。

## 2026-10-21 追加確証：07のChromeネイティブ音声が記事本文を実際に読み上げた

**実機報告の追加確証（2026-10-21 JST）:** ユーザーは前節の「07が可能」との観測について、「メニューが表示されただけか、実際に音声が流れ記事本文を読み上げたか」という明示的な質問に、次のように回答した。

> 実際に音声が流れて本文が読み上げられました

これにより、**slot07についてはChrome標準「このページを読み上げ」からの実際の音声再生および記事本文読み上げの成功をユーザー実機で確認済み**とする。以前の「メニュー表示のみで音声再生未確認」という留保はこの追加報告により解消した。slot01は直前のユーザー報告どおり不可。

### 成果と留保

- **検証済み:** 介入群07はGSCの単発申請受理（12:39:26 JST）後、Android Chrome標準機能で本文の実音声再生に成功。未申請対照群01は不可のまま。実験開始時には両URLともGoogle Indexで `URL is unknown to Google` だった。
- **依然未測定:** 申請後のslot07・slot01のGoogle **Index** 状態、最終クロール、Google-selected canonical、Chromeのバージョン、ユーザーの正確な実機確認時刻および読み上げ全文の照合。音声の開始と記事本文の読み上げについてはユーザーの明示的な証言を記録し、Workが音声を独立収集したとは扱わない。
- **因果は未判定:** 申請受理と読み上げ成功の時間的順序、および未申請群との対比は明瞭だが、Chrome独自のreadability再判定、通常の時間経過、キャッシュやGoogle Search Index状態との関係は識別できていない。**GSC未登録のまま成功したか否かが次の最重要検証点**。
- **登録操作は追加しない:** slot07へのインデックス登録リクエストは繰り返さず、slot01は変更しない。次は両URLの**Google Index（非ライブ）URL検査**をWork Cloud Browserで実施する。ライブテストがインデックス登録完了を意味しないことに注意。
- **registryを今回変更しない理由:** `read_aloud_status` を `confirmed` にすると固定URL自動再利用の対象になり得るため、アクティブな介入群の本文が入れ替わるリスクがある。**実機再生の成功自体は文書にconfirmedとして記録する一方、実験が完了し明示的に凍結解除するまではslot07のレジストリを`not_checked`で維持**する（`confirmed`登録は実験終了後の別判断）。トップ、01、07、残る98スロット、canonical、sitemap、PWA、Vercelには変更なし。


## 2026-10-21 介入後Google Index再検査（Android実音声成功報告後）

検査担当: ChatGPT Work Cloud Browser。対象プロパティ: `https://josh-temple.github.io/instant-radio/`。

**検査範囲:** GSCのURL検査で表示されたGoogle Indexの状態を確認した。これはインデックス済みデータの検査であり、`TEST LIVE URL` は実行していない。画面にあった「REQUEST INDEXING」は押していない。サイト・記事HTML・canonical・サイトマップ・registry・Vercelへの変更も行っていない。

**操作側検査時刻（JST）:** slot07検査開始 2026-10-21 19:07:53.998、画面証拠取得 19:09:22.902。slot01検査開始 19:09:30.502、画面証拠取得 19:09:40.587。これらは操作側のUTC時計をJSTへ換算した時刻であり、GSC画面自体には検査時刻の表示がない。

| URL | Google Indexの表示 | 最終クロール | Googlebot / 取得・許可 | User-declared canonical | Google-selected canonical | 画面証拠 |
|---|---|---|---|---|---|---|
| [slot07](https://josh-temple.github.io/instant-radio/articles/listen-slots/07.html) | `URL is on Google`; `Page is indexed` | `Oct 21, 2026, 12:43:51 PM`（GSC表示。タイムゾーンは画面に表示なし） | `Googlebot smartphone`; Crawl allowed `Yes`; Page fetch `Successful`; Indexing allowed `Yes` | slot07自身のURL | `Inspected URL`（画面表示。検査対象のslot07 URLと同一） | Work画面を19:09:22.902 JSTに取得。この会話の実行記録に画面画像を表示。 |
| [slot01](https://josh-temple.github.io/instant-radio/articles/listen-slots/01.html) | `URL is not on Google`; `Page is not indexed: URL is unknown to Google` | `N/A` | Crawled as / Crawl allowed / Page fetch / Indexing allowed はすべて `N/A` | `N/A` | `N/A` | Work画面を19:09:40.587 JSTに取得。この会話の実行記録に画面画像を表示。 |

両URLとも画面上で参照元サイトマップ・参照ページは検出されていない。slot07は以前のベースライン `URL is unknown to Google` から、今回の検査では `URL is on Google` へ変わっていた。slot01は引き続き未登録だった。

ユーザーは今回の依頼で、Android Chrome標準「このページを読み上げ」からslot07の記事本文が実際に音声再生されたこと、slot01は引き続き読み上げ不可であることを実機観測として報告した。この端末結果はユーザー報告として記録し、WorkがAndroid音声を独立検証したとは扱わない。

**解釈:** GSC上のIndex状態の変化と、ユーザー報告のslot07音声再生成功は同じ観測時点で確認された。ただし、登録リクエスト受理・Googleクロール・検索Index登録・Chrome Read Aloudの利用可否の時間的関係は分離されており、この対応だけでIndex登録がRead Aloudを有効化したという因果は確定できない。GSCのライブURLテストは今回行っていないため、その結果については何も主張しない。

**画面証拠の保存範囲:** スクリーンショットはWork実行会話に取得・表示し、上記の可視内容をGitHub記録へ転記した。画像ファイル自体はこのGitHubリポジトリには添付していない。


## 2026-10-21 追加介入：登録済みslot07の静的本文差し替えテスト

**新しい問い：** 同じURLで、Google Search Index登録とAndroid Chrome標準「このページを読み上げ」の本文音声再生が一度成功した後、**記事本文・題名だけを別の内容へ入れ替えても、新しい本文を読み上げるか**。このテストは先の「07へのGSC登録リクエストが効いたか」を調べる実験とは**別介入**である。今後の同じURLの結果を「初回申請のみの影響」として分析しない。

- ユーザーの明示依頼：slot07の竹取物語記事を、当日話題となっているPHPのセキュリティ警告とハッキングの解説（約6,000文字）に変更する。
- 変更前main: `0b387718dd333cdbcb6ae609b08951370a5133d2`
- 変更前slot07 HTML blob: `17e29ede796ebbf2bcc8b952b41dd0a2513633cc`。元の本文は上記commitから復元可能。
- 変更前slot01 HTML blob: `ef3544e449917eece71cd5961587dfcd6a7b4fcb`、既知陽性のroot blob: `0eaecbaf49160e0947c3cb34640f5d3b6efd8ef9`。
- 変更対象：`articles/listen-slots/07.html`のタイトル・説明・本文・構造化データ・公開メタデータ、一覧`articles/listen-slots/index.html`の07行、`articles/listen-slots/registry.json`の07タイトル/タグ/更新時刻のみ。
- **URLは厳密に不変：** `https://josh-temple.github.io/instant-radio/articles/listen-slots/07.html`。 `rel=canonical` も変更しない。ページの外観、article・articleBody、静的な段落本文、viewportは維持する。
- 新しい本文：**6,740文字、29段落**（段落間改行を除く）。表示本文とJSON-LDの`articleBody`は一致することをブランチで検証。記事は2026年10月21日夜、PHPセキュリティ更新公開予定時刻前の一次資料で書かれているため、情報時点の注意書きを含む。公開後の技術的な詳細は追加の正式発表で更新確認が必要。
- 参考一次資料：PHP開発チーム https://www.php.net/archive/2026.php#2026-10-20-1 、IPA https://www.ipa.go.jp/security/security-alert/2026/pre-alert20261021.html 、CERT-EU https://cert.europa.eu/publications/security-advisories/2026-018/ 、PHPサポート期間 https://www.php.net/supported-versions.php 、OWASP 2025 https://top10.owasp.org/2025/ja/。
- `registry.json` の07は **`read_aloud_status: not_checked`のまま維持**。確認済みへ更新すると自動ローテーション対象になるため、実験中に再度上書きされる危険を防ぐ。スロット01やその他99件の本文・index状態・URL・サイトマップは変更しない。新たなGSC登録リクエストは送らない。
- 公開後の受入試験：匿名HTTPで07が200、キャッシュ後の新タイトル・新本文が見えることを確認。Android Chromeの新しい通常タブで、①メニュー有無、②実際の音声再生開始、③**旧「竹取物語」でなく新「PHP」の本文が話されるか**、④終盤までの読み上げや音声の途中停止を記録する。ユーザーの実機からの報告があるまでは**本文差し替え後のChrome音声再生を未検証**とする。
- Google Search ConsoleのURL検査でindex状態が残っているかも必要に応じて別途検証する。ただし公開成功とIndex反映やChrome読み上げ可否は別の事象。
