# Chrome Android「このページを読み上げ」調査メモ

更新日: 2026-10-07

## 目的

Instant Radio で、Android Chrome の標準機能 **「このページを読み上げ」** を安定して利用できる条件を調べる。

Web Speech API を使う Instant Radio 本体の読み上げとは別の問題として扱う。

## 現時点の結論

2026-10-07 時点では、**HTML構造やホスティング先だけでは、Chrome の読み上げ可否を説明できない**。

特に強い観測は次のとおり。

- 読み上げ可能な既存URLと、内容が完全に同一の新規URLを同じ GitHub Pages サイト内に作成した。
- 元URLは「このページを読み上げ」利用可。
- 新規URLは利用不可。
- GitHub 上では両ファイルの blob SHA が同一で、HTML は文字単位で一致している。
- CSS・JavaScript・データの相対参照先も同一。

この観測に加え、現行 Chromium の Android Read Aloud 実装では、URLに対する **page readability request** を行い、返された readability result を利用して機能の可否を判断する経路が確認できた。したがって、少なくとも **URL単位のreadability判定が存在すること**は、単なる推測より強い根拠を持つ。

一方、Google Chrome 本番で使われるサーバー側 readability classifier の具体的な判定基準は公開コードから確認できない。現時点で、Vercel、Search Console、Google Analytics、検索インデックス登録、公開後の特定待機期間が eligibility 条件だと示す一次資料は確認できていない。

そのため現在は、**URL単位のreadability判定があることは強く支持されるが、判定基準と再評価タイミングは未確定**、という整理を採用する。Vercel 配信との相関は対照実験で継続検証するが、主要因とはまだ扱わない。

---

## 実機で確認した結果

### 1. Instant Radio 制御実験 01–10

URL:

- https://josh-temple.github.io/instant-radio/experiments/read-aloud/
- https://instant-radio.vercel.app/experiments/read-aloud/

実機結果:

| # | 条件 | Read Aloud | Reader Mode |
|---|---|---:|---:|
| 01 | Baseline: 静的・長文・semantic HTML・lang=ja | × | × |
| 02 | noindex | × | × |
| 03 | langなし | × | × |
| 04 | divのみ | × | × |
| 05 | 短文 | × | × |
| 06 | リスト中心 | × | × |
| 07 | JS遅延 | × | × |
| 08 | article入れ子 | × | × |
| 09 | Open Graph / JSON-LD / Schema.org追加 | × | × |
| 10 | nopagereadaloud | × | × |

この実験から、少なくとも以下は単独の決定要因ではなかった。

- `lang=ja`
- `main` / `article` / `p` の有無
- 本文長
- リスト中心か段落中心か
- 初期HTMLかJavaScript後挿入か
- Schema.org / Open Graph 等の記事メタデータ

### 2. Cocoon 成功構造の再現

読み上げ可能だった外部記事:

- https://www.atsuki-hamakawa.com/archives/716

Cocoon 公開テンプレートを参考に、以下を含む構造を Instant Radio 側に再現した。

- `article.article`
- `itemtype="https://schema.org/BlogPosting"`
- `data-clarity-region="article"`
- `entry-header`
- `entry-content cf`
- `itemprop="mainEntityOfPage"`
- 日付、パンくず、サイドバー等

テストページ:

- https://josh-temple.github.io/instant-radio/experiments/read-aloud/11-cocoon-success-structure.html
- https://instant-radio.vercel.app/experiments/read-aloud/11-cocoon-success-structure.html

結果:

- GitHub Pages: Read Aloud ×
- Vercel: Read Aloud ×

よって、Cocoon風DOM構造そのものでは説明できない。

### 3. RSVP Learning に同一 Baseline を配置

Instant Radio の `01-baseline.html` を内容完全一致で RSVP Learning に配置した。

- https://rsvp-learning-kappa.vercel.app/experiments/read-aloud/01-baseline.html

確認時、配信HTMLは Instant Radio 側の元ファイルと完全一致。

結果:

- Reader Mode ×
- Read Aloud ×

よって、「RSVP Learning のドメインだから利用可能」という単純なサイト単位仮説は支持されなかった。

### 4. Studio Lab Research

既存サイト:

- https://josh-temple.github.io/studio-lab-research/

実機結果:

- Chrome の「このページを読み上げ」が利用可能。

これは **GitHub Pages 自体が読み上げ対象外ではない**ことを示す。

### 5. Systematic Trading Research

既存サイト:

- https://josh-temple.github.io/systematic-trading-research/

実機結果:

- Chrome の「このページを読み上げ」が利用可能。

このリポジトリは 2026-09-26 作成であり、長期間運用された古いサイトだけが対象になる、という単純な仮説は弱い。

また、トップページは本文の一部を JavaScript で埋める構造である。このため、**本文が初期HTMLにすべて含まれることも必須条件ではない**。

### 6. Systematic Trading Research に新規 Baseline を追加

Instant Radio の Baseline を同じ GitHub Pages サイトに配置。

- https://josh-temple.github.io/systematic-trading-research/read-aloud-control.html

結果:

- 既存トップ: ○
- 新規 Baseline: ×

同一ホスト・同一ドメインでも、新規URLは不可だった。

### 7. 最重要実験: 成功トップの完全コピー

Systematic Trading Research の `web/index.html` を **一文字も変更せず**、別ファイル名へコピーした。

元:

- https://josh-temple.github.io/systematic-trading-research/

完全コピー:

- https://josh-temple.github.io/systematic-trading-research/read-aloud-top-copy.html

GitHub 上では、

- 元: `web/index.html`
- コピー: `web/read-aloud-top-copy.html`
- blob SHA: 完全一致

であり、HTML内容は完全同一。

CSS、JavaScript、データも同じ相対参照先を利用する。

実機結果:

- 元URL: ○
- 新規完全コピーURL: ×


### 8. World History Lab / GrokMath の Vercel 観測

既存サイト:

- https://world-history-lab.vercel.app/
- https://grok-math.vercel.app/

リポジトリ作成時期:

- World History Lab: 2026-02-25
- GrokMath: 2026-03-04

実機結果:

| サイト | Hosting | Reader Mode | Read Aloud |
|---|---|---:|---:|
| World History Lab | Vercel | ○ | × |
| GrokMath | Vercel | ○ | × |

この観測から分かること:

- Vercel 上でも Chrome は本文を抽出できるため、Reader Mode 自体は成立しうる。
- それでも Read Aloud は利用不可だった。
- したがって、**Reader Mode の可否と Read Aloud の可否は別に扱う必要がある**。
- 両サイトは新規作成直後ではないため、単純な「公開直後だからまだ Read Aloud 不可」という説明だけでは不十分。
- 一方で、URL単位の評価履歴・クロール状態・サイトごとの条件などは未確認であり、Vercel が原因だと断定はできない。


### この結果が示すこと

以下では説明できない。

- HTML本文
- DOM構造
- CSS
- JavaScript
- 同一ドメインかどうか
- GitHub Pagesかどうか

現在の証拠から優先して検証すべき点は、

1. URLごとのサーバー側readability判定
2. 同一コンテンツでもURLが変わると判定結果が変わる条件
3. readability result が変化する再評価タイミング
4. ホスティングや配信方式とreadability判定の相関
5. ページ言語・レンダリング完了時点・その他クライアント側の前提条件

である。

GitHub Pages の「既存トップ○ / 完全同一の新規URL×」は、HTMLだけでなくURL単位の判定が関係するという見立てと整合する。World History Lab / GrokMath の「Reader Mode ○ / Read Aloud ×」は、Reader Mode と Read Aloud を別判定として扱う必要性を支持するが、Vercelそのものを原因とは確定しない。

---

## Chrome / Chromium 実装から確認できたこと

公開されている Chromium の Android Read Aloud 実装では、ページの可読性を URL に対して問い合わせる `isPageReadable(...)` が存在する。

現行コードから確認できるクライアント側の主な動作は次のとおり。

- HTTP(S)など、readability requestを送る前のURL eligibility checkがある
- URLからユーザー情報を除いた値を使ってreadability requestを送る
- callbackとして `isReadable` と `timepointsSupported` を受け取る
- telemetry上も server readability result を別に記録する
- supported language と feature availability を合わせて実際の可否を決める
- readability result はクライアント側で一定時間キャッシュされ、現行コードでは約1時間で期限切れになる

過去の Chromium 変更でも、ページ読み込み後に readability check を遅延実行し、server readability check を呼ぶ実装が確認できる。

重要なのは、**約1時間という値はクライアントのキャッシュ期間であり、「公開後1時間待てばreadableになる」という意味ではない**こと。サーバー側classifierの再評価周期は公開コードから確認できない。

参考:

- ReadAloudController.java  
  https://chromium.googlesource.com/chromium/src/+/main/chrome/browser/readaloud/android/java/src/org/chromium/chrome/browser/readaloud/ReadAloudController.java
- Chromium Read Aloud directory  
  https://chromium.googlesource.com/chromium/src/+/main/chrome/browser/readaloud/android/

注意:

Chromium upstream の `ReadAloudReadabilityHooksUpstreamImpl` は空実装であり、Google Chrome 本番で使われる具体的な readability 判定ロジックは upstream 公開コードだけでは確認できない。

したがって、Google 側がURLをどのような基準で readable と判断するかは未確定。

---

## 現在の仮説

### 強く支持されている

**読み上げ可否は、ページのHTMLだけでは決まらない。**

根拠:

成功ページと完全同一HTMLを同一サイト内の別URLへ置いても、新規URLだけ不可だった。

### 強く支持されているが内部基準は未確定

**A. Read AloudにはURL単位のreadability判定がある。**

Chromiumのクライアント実装がURLに対するreadability request/resultを扱っており、実機でも同一HTMLの別URLで結果が分かれた。

ただし、Google Chrome本番のサーバー側classifierが何を見ているかは未公開。

### 検証継続

**B. 新規URLのreadability resultが時間経過で変化する可能性。**

同一HTMLの新規URLが既存URLと異なる結果だったため観測価値はある。ただし、公開後一定時間が必要だという仕様は確認できていない。

**C. VercelまたはVercelと相関する配信条件が結果に関係する可能性。**

World History Lab、GrokMath、Instant RadioのVercel URLではRead Aloud × が観測されているが、GitHub Pagesの新規URLでも×が出ている。Vercelを原因とするには、同一bundleを複数ホストから出す直接比較が必要。

### 現時点で根拠を確認できていない介入

- Search Console登録
- Google Analytics設定
- Google Searchへのインデックス登録
- 特定日数の待機
- Schema.org追加だけでの改善

これらをRead Aloud改善策として実施する根拠は、今回確認した一次資料からは得られていない。

### 現時点で弱くなった仮説

- GitHub Pages が原因
- Vercel だけで全結果を説明できる
- `article` / `main` がないことが原因
- `lang` が原因
- 本文が短いことが原因
- JavaScript 生成が原因
- Schema.org がないことが原因
- Cocoon特有のDOM構造が必要
- RSVP Learning というドメインなら通る

---

## Reader Mode について

Reader Mode と「このページを読み上げ」は同一機能ではないため、判定を分けて記録する。

今回の人工 Baseline 群では Reader Mode もすべて利用不可だった。

一方、Read Aloud が利用可能な既存サイトが存在するため、今後は次の4状態を分ける。

- Reader Mode ○ / Read Aloud ○
- Reader Mode ○ / Read Aloud ×
- Reader Mode × / Read Aloud ○
- Reader Mode × / Read Aloud ×

Reader Mode の成否だけから Read Aloud の成否を推定しない。

実際に World History Lab と GrokMath では **Reader Mode ○ / Read Aloud ×** が確認されている。これは両機能が少なくとも実用上は別判定として振る舞うことを示す。

---

## 次の観測計画

### A. GitHub Pages の新規URL経過観測

**完全コピーURLは変更しない。**

観測対象:

- https://josh-temple.github.io/systematic-trading-research/read-aloud-top-copy.html

比較対象:

- https://josh-temple.github.io/systematic-trading-research/

目安:

- 公開から約1時間後
- 24時間後
- 72時間後
- 1週間後

記録する項目:

- 「このページを読み上げ」表示 / 非表示
- Reader Mode 利用可 / 不可
- 判定日時
- Chrome バージョン
- 必要なら通常タブ / シークレットの別

### 判定

新規完全コピーが時間経過後に ○ へ変化した場合:

> URL公開後の時間・URL評価履歴が読み上げ可否に影響する、という仮説を強く支持する。

1週間後も × の場合:

> 単純な反映待ちでは説明できず、URLパス、クロール状態、Google側の別評価条件を調べる。

### B. 同一bundleの GitHub Pages / Vercel 対照実験

Systematic Trading Research の既存トップから、HTML・CSS・JavaScript・データを内容変更せず Instant Radio の実験ディレクトリへ複製した。

元の成功対照:

- https://josh-temple.github.io/systematic-trading-research/

新規mirror:

- GitHub Pages: https://josh-temple.github.io/instant-radio/experiments/read-aloud/str-mirror/
- Vercel: https://instant-radio.vercel.app/experiments/read-aloud/str-mirror/

source blob SHA と実験手順は `experiments/read-aloud/str-mirror/README.md` に固定した。4ファイルはコピー後にGit blob SHAを再照合し、元ファイルと一致することを確認した。

2026-10-07に両mirror URLが公開取得可能で、取得された主要見出し・説明文も一致することを確認した。**Reader Mode / Read Aloud の実機判定はまだ未実施であり、ここでは公開成功だけを確認済みとする。**

この2つのmirrorは同じリポジトリ・同じファイル群から配信されるため、両者で結果が継続的に分かれれば hosting / delivery と相関する要因の証拠が強まる。

ただし両mirrorとも新規URLである。そのため両方×の場合は、hosting差ではなくURL単位のreadability判定や別の共通要因でも説明できる。

観測は少なくとも、

- デプロイ確認後
- 現行クライアントキャッシュ期間を越えた後
- 24時間後
- 72時間後
- 1週間後

に行う。これは「待てば通る」という仮説を前提にするためではなく、readability result が変化するかを観測するための時系列サンプリングである。

---

## Instant Radio への当面の設計判断

現段階では、Chrome標準の「このページを読み上げ」を確実に有効化するために、HTMLをさらに複雑化しない。

当面は次の方針とする。

- Web Speech API を使う既存機能を主経路として維持する
- Chrome標準 Read Aloud は追加の実験対象として扱う
- 読み上げ用ページを公開する場合はURLを安定させる
- 公開済みテストURLを不用意に変更・削除しない
- URLごとの時間経過を観測する
- Chrome標準機能を保証する表現はしない

Chrome側の挙動が明確になるまでは、Instant Radio のプライバシー設計（本文をサーバーへ送らず、端末内で扱う）を崩してまで対応しない。
