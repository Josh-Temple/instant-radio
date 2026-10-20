# Android Chrome「このページを読み上げ」とGoogle検索インデックスの独立検証

> **更新注記（2026-10-21）:** 本報告の§2と初期要約にある「GSC未取得」は**2026-10-20時点の状態**です。その後Workで認証に成功し、4件すべてのURL検査・ライブテストが報告されました。**本ファイル末尾の2026-10-21追補が最新結果**です。実機読み上げ結果とは測定日時を区別してください。

**検証日:** 2026-10-20 JST  
**Repository HEAD:** 9068588ba70e20dcf5676ca5d12f3159c556383f  
**範囲:** 指定4 URLの現行HTML・HTTP応答、既存の実機報告、Chrome／ChromiumとGoogle Searchの一次資料

## 要約

- ユーザー報告のAndroid Chromeでは、トップの「/」は再生できる一方、「/index.html」とslot 01・07ではメニュー項目が表示されない。これは実機のユーザー観測であり、本検証で再実施した結果ではない。
- WorkからのGETでは4 URLすべてHTTP 200。トップの「/」と「/index.html」はリダイレクトせず、本文30,195 bytes、SHA-256 d19e28cb9b2a67c680a87d445451f4311af44b170899018fe11252ea63fa04c0が一致した。
- 現行Search ConsoleのURL検査は認証を完了できず未実施。4 URLのインデックス状態、クロール日時、Googlebot、Google選択canonical、サイトマップ／参照元、ライブテストは未取得である。登録リクエストは送信していない。
- Chrome公式ヘルプは「一部のウェブサイトでは利用できない」と説明するが、Google検索への登録や公開後の待機期間を要件として示していない。Chromium Androidの公開コードにはURL単位のreadability確認とローカルキャッシュがある。
- 現段階では「Googleに認識・登録され、一定期間経過したURLだけが対象」という仮説は未証明。URL単位のChrome Read Aloud状態やキャッシュの方が、観測との整合性が高い。ただし、どちらも原因と確定できない。

## 1. Android実機の観測（ユーザー報告）

本表の読み上げ結果は、依頼文に記載された実機観測である。Workの独立実機検証ではない。

| URL | Chrome標準読み上げ（ユーザー報告） |
|---|---|
| https://josh-temple.github.io/instant-radio/ | 利用可能。現在表示中の内容を正常再生 |
| https://josh-temple.github.io/instant-radio/index.html | 利用不可 |
| https://josh-temple.github.io/instant-radio/articles/listen-slots/01.html | 利用不可 |
| https://josh-temple.github.io/instant-radio/articles/listen-slots/07.html | 利用不可 |

Chromeのバージョン、端末の設定状態、URL検査と実機確認の正確な同時刻は依頼文では記録されていない。

## 2. Search Consoleの現行比較

Google Search Consoleを開いたところ、WorkのCloud BrowserはGoogleアカウント選択画面に進んだ。安全な認証フローを試したが、ツールがタイムアウトし、アカウントを選択できなかった。URL検査は実行しておらず、結果画面のスクリーンショットも取得していない。アカウント識別情報はこの公開報告に記録しない。

| 検査URL | インデックス状態／未登録理由 | Google選択canonical | Search Consoleのユーザー指定canonical | 最終クロール／Googlebot | Google取得・クロール許可・索引許可 | サイトマップ／参照元ページ | ライブURLテスト | 実施日時（JST） |
|---|---|---|---|---|---|---|---|---|
| /instant-radio/ | 未取得 | 未取得 | HTML上の指定なし。GSC表示は未取得 | 未取得 | 未取得 | 未取得 | 未実施 | URL検査未実施 |
| /instant-radio/index.html | 未取得 | 未取得 | HTML上の指定なし。GSC表示は未取得 | 未取得 | 未取得 | 未取得 | 未実施 | URL検査未実施 |
| /articles/listen-slots/01.html | 未取得 | 未取得 | HTML上は自己参照canonical。GSC表示は未取得 | 未取得 | 未取得 | 未取得 | 未実施 | URL検査未実施 |
| /articles/listen-slots/07.html | 未取得 | 未取得 | HTML上は自己参照canonical。GSC表示は未取得 | 未取得 | 未取得 | 未取得 | 未実施 | URL検査未実施 |

ここでの「未取得」は未登録を意味しない。Workからの通常HTTP GETで200だったことも、Google-InspectionToolの取得結果とは区別する。

### 既存記録から確認できる過去のSearch Console結果

既存文書 docs/chrome-read-aloud-findings-2026-10-07.md は、2026-10-07 22:20–22:23 JSTのトップについて、Googleインデックス表示を「URL is not on Google」「URL is unknown to Google」と記録している。同じ記録では最終クロール、Googlebot、Search Console上のユーザー指定・Google選択canonicalはN/A、参照元サイトマップ／参照元ページなしとされ、別のライブテストはページ取得成功、クロール許可、索引許可ありだった。過去の記録には同日、トップを含むURLへの登録リクエストを送信した記述がある。

この過去記録は2026-10-20の現在状態ではなく、今回の4 URLを同じ日に検査した結果でもない。過去のRead Aloud実機観測もSearch Console検査と厳密に同期していない。今回、新たな登録リクエストは送信していない。

## 3. HTTP・HTML比較

Workから通常のGETを行った。HTTP応答のDateヘッダーは2026-10-20 06:00:36–06:04:17 UTC（15:00:36–15:04:17 JST）を示した。以下の本文SHA-256は取得したレスポンス本文の値である。

| URL | HTTP／リダイレクト | 本文サイズ・SHA-256 | HTML上のcanonical | robots／viewport | 初期HTMLの主構造 |
|---|---|---|---|---|---|
| /instant-radio/ | 200、リダイレクトなし、最終URLは要求URL | 30,195 bytes、d19e28cb9b2a67c680a87d445451f4311af44b170899018fe11252ea63fa04c0 | 指定なし | robots／googlebot metaなし、viewportあり、X-Robots-Tag応答ヘッダーなし | main、header、3 section、h1、入力textarea、プレイヤー・キュー操作。script/styleを除いたHTMLテキスト約1,396文字。初期HTMLにarticle要素・JSON-LDなし |
| /instant-radio/index.html | 200、リダイレクトなし、最終URLは要求URL | 30,195 bytes、d19e28cb9b2a67c680a87d445451f4311af44b170899018fe11252ea63fa04c0 | 指定なし | robots／googlebot metaなし、viewportあり、X-Robots-Tag応答ヘッダーなし | 「/」とレスポンス本文のbytes数・SHA-256・ETagが一致 |
| /articles/listen-slots/01.html | 200、リダイレクトなし、最終URLは要求URL | 7,700 bytes、511ce629994fba6659a6d0b1e85711df450fcc493eccfaedcb7451617420098d | 自己参照URL | robots／googlebot metaなし、viewportなし | main/article、Article構造化データ、articleBody、見出しと本文段落。script/styleを除いたHTMLテキスト約1,298文字 |
| /articles/listen-slots/07.html | 200、リダイレクトなし、最終URLは要求URL | 6,021 bytes、efaa615a551e2792d8891144bf0a691e5d72b64d52386a144702575bb010c80d | 自己参照URL | robots／googlebot metaなし、viewportあり | main/article、Article構造化データ、articleBody、見出しと本文段落。幅を画面に合わせるCSS。script/styleを除いたHTMLテキスト約757文字 |

共通の応答情報は Content-Type: text/html; charset=utf-8、Cache-Control: max-age=600、Vary: Accept-Encoding。全4 URLで Last-Modified は 2026-10-20 02:35:21 GMT、各ページのETagは本文ごとに異なった。初回取得はMISS、再取得は一部HITで、Ageは約201–202秒だった。Last-Modifiedは全ページで同じ時刻のため、個々のURLの公開開始時刻やGoogleの初回クロール日時として扱わない。Age／X-CacheはHTTP配信キャッシュの情報であり、Chromeのreadability cacheとは別である。

リポジトリ履歴上、トップindex.htmlの初回追加commitは2026-10-03 04:29:41Z、slot 01は2026-10-08 09:26:18Z、slot 07は2026-10-08 13:06:39Zである。これらはGitのcommit時刻であり、初回公開時刻やGoogleが認識した時刻を直接示さない。10月20日の同一Last-Modifiedを公開後経過時間の測定に使うこともできない。

### HTML差から読み取れる範囲

- 「/」と「/index.html」は取得時点で同一バイト列であり、HTTPリダイレクトもなかった。それでもユーザーの実機結果は異なる。本文・メタタグ・HTTPリダイレクトだけではこの差を説明できない。
- トップは初期HTMLに静的article要素や記事構造化データがない一方、実機報告では読み上げ可能。従って、静的article要素やJSON-LDが必要条件だとは言えない。
- slot 01と07はどちらも記事要素、Article構造化データ、本文を初期HTMLに持つ。07はviewportとレスポンシブCSSも持つが、ユーザー報告ではどちらも利用不可。記事セマンティクスやviewport単独では十分条件になっていない。
- HTMLやHTTPの差がRead Aloudの適格性に影響しないとは言えない。Google側の評価条件を比較する実験ではないためである。

## 4. 公式資料と処理段階の区別

1. **Chrome Read Aloudの利用可否:** Chromeヘルプは機能が一部サイトで利用できず、メニューに項目がなければ使用できないと説明する。全ウェブサイト共通の適格性条件は公開されていない。
2. **readability判定:** Chromium Androidの公開コードは、タブURLのユーザー情報を除去した文字列でreadability確認を行い、ReadAloudReadabilityHooks.isPageReadableへURLを渡す。
3. **本文抽出・音声合成:** Chrome EnterpriseのRead Aloudポリシー説明は、適格ページの読み上げがサーバー側のcontent distillationとtext-to-speech synthesisを使うと説明する。抽出と音声合成は、Search Consoleのページ取得結果そのものではない。
4. **端末側キャッシュ:** Chromiumの参照ソースは、URL文字列をhash化したreadability結果を最大300件のLRU cacheに保存し、応答後1時間以内の結果を再利用する。これは当該ソーススナップショットのクライアント側実装であり、Android端末に入っているChromeバージョンやRead Aloudサーバーのキャッシュ有効期間を確定しない。同ソースには同じタブの再生状態を復元する処理もあるが、今回の結果の原因と確認されたわけではない。
5. **Google検索のクロール・インデックス:** Search ConsoleヘルプはURL検査のインデックス表示とライブテストを別に説明する。ライブテストはGoogle-InspectionToolが現在アクセスできるかを確認するもので、インデックス登録を保証しない。ライブテストではサイトマップ／参照元を確認せず、canonical選択も予測しない。
6. **Googleが選ぶcanonical:** Google Search Centralは重複ページの正規URLを検索インデックス内で選択すると説明する。Search ConsoleのGoogle選択canonicalをChrome Read Aloudが使うという説明は、確認した一次資料にはない。したがって、Search canonicalとChrome Read Aloudを同一判定として扱わない。

## 5. 仮説の統合判定

| 仮説 | 判定 | 根拠と反証／限界 |
|---|---|---|
| H1: URL単位の読み上げ適格性判定が存在する | **支持** | Chromium AndroidのコードはURLをReadabilityHooksへ渡す。/ と /index.html は同一HTTP本文なのに、ユーザー報告の実機結果が異なる。コード上の仕組みと観測は整合するが、個々の読み上げ結果をWorkが端末で測定したわけではない。 |
| H2: Google検索へのインデックス登録が必要条件 | **未判定** | 現行4 URLのSearch Console検査は未実施。10月7日のトップは未登録と記録されている一方、同時期のRead Aloud結果と正確には同期していないため必要条件を反証できない。Search Consoleの別機能であることだけから不要とも断定できない。 |
| H3: 公開後の経過時間が関係する | **未判定** | slot 01／07は10月8日追加の後、10月20日の実機報告でも不可。トップは10月3日初回commit後に利用可能と報告された。しかしGit commit日は初回公開時刻ではなく、URL年齢だけを変える比較も閾値測定もない。「N日待てば有効」という根拠はない。 |
| H4: HTML構造・本文抽出の適合性が関係する | **未判定** | Enterprise資料はcontent distillationを確認しているため抽出品質は妥当な候補要因。ただしChromeの適格性条件におけるHTML要件は公開されていない。viewport付きかつarticle構造を持つslot 07も不可で、これらの要素だけでは十分でない。 |
| H5: canonicalやリダイレクトが読み上げ判定と関連する | **未判定** | 「/」と「/index.html」は同一本文でHTTPリダイレクトなしだが、実機報告は異なる。Search Console上のcanonicalは未取得。HTML上の自己canonicalがslot 01／07を読み上げ可能にしない。canonicalがRead Aloud判定に使われる証拠はない。 |
| H6: Chromeのキャッシュや過去の判定状態が関係する | **支持（仕組みの存在）** | ChromiumのURL別readability LRU cacheと再生状態復元処理が公開されている。これはキャッシュ／復元が起こりうる仕組みを支持するが、今回のURL差を引き起こした証拠ではない。読み上げサービス側のキャッシュ期間は確認できない。 |

## 6. 最も可能性が高い説明と不確実性

現在の証拠で最も整合するのは、Chrome Read AloudのURL別readability判定に、端末内のURL別キャッシュや再生状態が重なっている説明である。トップとindex aliasは同じバイト列でもURL文字列が違い、ChromiumコードはURLをreadability結果cacheのキーに使うためである。記事の本文抽出適合性も候補だが、現在の4ページの結果から基準を特定できない。

これはSearch Consoleのインデックス状態や公開年齢が関係しないことの証明ではない。現行Search Consoleデータがなく、Google側のRead Aloud基準も公開されず、Chromeバージョンも記録されていない。現時点で「Googleに認識・登録され、一定期間経過したURLだけが対象」と結論づけることはできない。

## 7. 次に行う最小の検証

Search Consoleの対象プロパティへアクセス可能な状態で、同じ日に4 URLをそれぞれURL検査し、Googleインデックス表示とライブURLテストを分けて記録する。各URLでGoogle-selected canonical、ユーザー指定canonical、最終クロール日時、Googlebot種類、取得・許可状態、サイトマップ／参照元を記録し、登録リクエストは行わない。

同日にAndroid Chromeの新しい通常タブでも4 URLを確認し、Chromeバージョン、アドレスバーの最終URL、メニュー表示、再生開始、実際の読み上げ内容を記録する。/ と /index.html の差が続く場合、キャッシュは消さずに同じURLを1時間超の間隔で再検し、公開コードに見られるクライアントキャッシュの期限と観測結果を比較する。結果の一致は相関を示すにとどまり、因果関係は別の対照実験が必要になる。

## 8. 作業範囲と証拠

この調査では、index.html、slot 01・07、registry.json、サイト設定、Chromeキャッシュを変更していない。読み上げ状態の更新、インデックス登録リクエスト、本番デプロイも行っていない。作成物はこの調査報告のみ。

### GitHub上の確認済み資料

- [Repository main HEAD 9068588](https://github.com/Josh-Temple/instant-radio/commit/9068588ba70e20dcf5676ca5d12f3159c556383f)
- [トップ index.html](https://github.com/Josh-Temple/instant-radio/blob/9068588ba70e20dcf5676ca5d12f3159c556383f/index.html)
- [slot 01](https://github.com/Josh-Temple/instant-radio/blob/9068588ba70e20dcf5676ca5d12f3159c556383f/articles/listen-slots/01.html)
- [slot 07](https://github.com/Josh-Temple/instant-radio/blob/9068588ba70e20dcf5676ca5d12f3159c556383f/articles/listen-slots/07.html)
- [slot registry](https://github.com/Josh-Temple/instant-radio/blob/9068588ba70e20dcf5676ca5d12f3159c556383f/articles/listen-slots/registry.json)
- [2026-10-07 Search Console調査メモ](https://github.com/Josh-Temple/instant-radio/blob/9068588ba70e20dcf5676ca5d12f3159c556383f/docs/chrome-read-aloud-findings-2026-10-07.md)
- [2026-10-17以降の実機観測ログ](https://github.com/Josh-Temple/instant-radio/blob/9068588ba70e20dcf5676ca5d12f3159c556383f/docs/chrome-native-read-aloud-observation-2026-10-17.md)

### 公式資料

- [Android Chromeヘルプ: 「このページを読み上げ」](https://support.google.com/chrome/answer/14768725?hl=ja)
- [Chrome Enterprise: Read Aloudポリシー](https://chromeenterprise.google/policies/listen-to-this-page-enabled/)
- [Chromium Android ReadAloudController.java（参照revision 06d300357b510d33bf53b8e8b5cdbd736dae676c）](https://chromium.googlesource.com/chromium/src/%2B/06d300357b510d33bf53b8e8b5cdbd736dae676c/chrome/browser/readaloud/android/java/src/org/chromium/chrome/browser/readaloud/ReadAloudController.java)
- [Search Consoleヘルプ: URL検査ツール](https://support.google.com/webmasters/answer/9012289?hl=ja)
- [Google Search Central: URL正規化](https://developers.google.com/search/docs/crawling-indexing/canonicalization?hl=ja)

日本時間は2026-10-20。HTTP応答のDateヘッダーは上記3節に記録した。Search Console URL検査のスクリーンショットと当日状態は未取得である。

---

## 2026-10-21 追補：Search Console 4 URL検査完了

**証拠の性質：** 以下は、ユーザーが2026-10-21に共有した**Work Cloud BrowserによるGoogle Search Console実測の報告**を転記・統合したもの。報告は「4/4件完了」とし、Google Indexの登録状況と**ライブURLテストを別々に記録**している。GSC画面に時刻のタイムゾーン表記がないため、ここでは時刻をJSTと断定しない。Workが保持する証拠画面の存在は報告されたが、この追補を書く側では**その画像の内容を独立に再閲覧していない**。したがって下表は提供されたWorkの実測報告であり、追加の独立再測定ではない。

### A. Google Index：現時点のインデックス登録状態

| URL（共通プレフィックス `https://josh-temple.github.io`） | Google Index | Google選択canonical | ユーザー指定canonical（Index画面） | 最終クロール | クロール/取得/索引 |
|---|---|---|---|---|---|
| `/instant-radio/` | **登録済み / URL is on Google** | **検査対象URL自身** | なし | **2026-10-07 22:23:59** / Googlebot smartphone | Yes / Successful / Yes |
| `/instant-radio/index.html` | **未登録 / URL is unknown to Google** | N/A | N/A | N/A | N/A / N/A / N/A |
| `/instant-radio/articles/listen-slots/01.html` | **未登録 / URL is unknown to Google** | N/A | N/A | N/A | N/A / N/A / N/A |
| `/instant-radio/articles/listen-slots/07.html` | **未登録 / URL is unknown to Google** | N/A | N/A | N/A | N/A / N/A / N/A |

全4件とも、GSCのIndex画面では参照サイトマップ・参照ページが検出されなかった。N/Aは**未測定・記録なし**であって「取得が禁止された」「クロールが失敗した」を意味しない。未登録3件のGoogle選択canonicalはN/Aのため、`/index.html` をGoogleが `/` にcanonical統合したとする根拠はない。

### B. ライブURLテスト：4件とも取得・インデックス許可

| URL | GSCライブテスト時刻（画面表示） | 取得時刻（画面表示） | クロール/取得/索引許可 | ユーザー指定canonical（ライブ） |
|---|---|---|---|---|
| `/instant-radio/` | 2026-10-21 00:29 | 00:29:59 | Yes / Successful / Yes | なし |
| `/instant-radio/index.html` | 2026-10-21 00:21 | 00:21:39 | Yes / Successful / Yes | なし |
| `/instant-radio/articles/listen-slots/01.html` | 2026-10-21 00:22 | 00:22:59 | Yes / Successful / Yes | **URL自身** |
| `/instant-radio/articles/listen-slots/07.html` | 2026-10-21 00:24 | 00:24:08 | Yes / Successful / Yes | **URL自身** |

全件「URL is available to Google / Page can be indexed」相当、Google Inspection Tool smartphone。ライブテストのGoogle-selected canonicalはすべて「Only determined after indexing」。Discoveryは全件「Not checked in live tests」。**ライブで取得可能であることと、既存Google検索Indexに載っていることは別**である。ライブテストは索引登録要求ではなく、今回新たなリクエスト送信もしていない。

### C. Android Chrome実機結果との対応

Chrome実機結果は**過去にユーザー自身が新しい通常Chromeタブで報告した結果**（§1・`docs/chrome-native-read-aloud-observation-2026-10-17.md`参照）で、今回のGSCライブテストと分単位で同期した測定ではない。Work Cloud BrowserからAndroid Chromeのネイティブ三点メニューは操作できず、Workによる実機再測定はない。

| URL | Google Search Index（今回） | Android Chrome「このページを読み上げ」（過去実機） |
|---|---|---|
| `/instant-radio/` | **登録済み** | **メニューあり・音声再生成功・表示本文と一致** |
| `/instant-radio/index.html` | **未登録（未知）** | **不可** |
| `/instant-radio/articles/listen-slots/01.html` | **未登録（未知）** | **不可** |
| `/instant-radio/articles/listen-slots/07.html` | **未登録（未知）** | **不可** |

4件中4件で、「登録済み／未登録」と「読み上げ可能／不可」の分類が一致。ただしn=4かつ非無作為抽出で、両判定の取得時刻も異なる。**相関の観測であって必要条件・十分条件・因果の証明ではない。** 同じHTMLでも `/` は可、`/index.html` は不可で、配信本文・レイアウト・HTTPリダイレクトの違いだけでは結果を説明できない。

先行HTTP検査（§3）では `/` と `/index.html` はそれぞれHTTP 200・リダイレクトなし、**30,195 bytes / SHA-256 `d19e28cb9b2a67c680a87d445451f4311af44b170899018fe11252ea63fa04c0`** で一致していた。Workの今回報告でもこの値が再掲されており、上記のURL差との比較に利用できる。ただし配信キャッシュとGoogle/Chromeの読み上げ評価状態は同一ではない。

### D. 6仮説の更新（証拠レベルを区別）

| 仮説 | 現在の判定 | 実測結果から言えること／未確定事項 |
|---|---|---|
| H1 URL単位のreadability判定 | **支持** | 同一HTMLの `/` と `/index.html` でChromeの実機結果が相違。ChromiumのURLベース判定実装とも整合。 |
| H2 Google検索インデックス登録は必要条件 | **未判定（相関あり）** | 今回のn=4では登録あり1件だけ可、未登録3件すべて不可。しかし「未登録でも読み上げ可」の反例探索も、Index状態だけを変える介入も不足。Google公式資料に必要条件とする記述はない。 |
| H3 公開後一定期間の経過が必要 | **未判定** | URLの最初のcommit日や最終クロール日時は、読み上げ判定の更新時刻や公開開始日とは異なる。定量的な閾値不明。 |
| H4 読み上げに適したHTML構造が必要 | **一般条件は未判定。特定タグは必要でも十分でもない** | 読み上げ可能なrootは初期HTMLで記事JSON-LDや静的articleBodyを備えない。一方でslot07はarticle/viewportを持っても不可。サーバー側の本文抽出が何を要求するかは非公開。 |
| H5 Google選択canonicalがChromeの判定に関係 | **未判定** | 検査対象自身がGoogle canonicalのrootは可。未登録3件のGoogle-selected canonicalはN/Aで比較不能。検索のcanonicalと読み上げ判定を同一視しない。 |
| H6 Chrome/サーバーの読み上げ判定キャッシュが関係 | **仕組みの存在は支持、原因は未判定** | Chromium AndroidのURL単位readability cacheは存在。ただし現在の4件の差を作った原因がキャッシュであると分離できない。 |

**一次資料との整合：** Chromium `ReadAloudController.java` ではURL文字列に基づくreadability問い合わせ・キャッシュがある。Chrome Enterpriseはサーバー側のcontent distillationと音声合成を説明している。これらはいずれも、**Google検索Indexに登録されていることが必須**とは述べていない。Google Search Centralはサイト内で辿れる通常のリンクやサイトマップがURL発見を支援すると説明しているが、インデックス登録を保証するものではない。

### E. 最小の次段階

1. 新しいタブで4 URLの**Android Chromeバージョン、最終URL、メニュー有無、再生内容、JST時刻**を同日に再記録して、GSCとの時間差を縮める。以前の実機結果を「Workで新たに確認済み」とは呼ばない。
2. 以降、対象4件についてGoogle Index状態・最終クロール・Chrome実機結果を定期的に対照し、**状態が変化する瞬間**に着目する。検索登録とChrome可否が時間差で変わる場合、即時同期仮説は弱まる。
3. 検索登録が必要条件かを**積極的に反証**するには「Search Index上は未登録だがChromeで読める」URLを探す。時点を揃えた反例が1件でも確認できれば必要条件仮説は反証される。
4. 将来的に検索インデックス登録の効果を介入検証する場合は、固定URL群の一部を対照群に残し、**明示的な新規許可を得てから**sitemap／内部リンク／インデックス登録リクエスト等を段階的に変更する。これらは検索用のURL発見手段であって、Chromeの読み上げ有効化スイッチではない。

**変更範囲：** この追補のみ。正常に読み上げられるroot、slot 01/07、残る98件、registry、PWA、キャッシュ、公開経路には変更を加えない。GSC登録リクエストは行っていない。
