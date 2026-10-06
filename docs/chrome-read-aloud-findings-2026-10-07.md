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

この結果から、**URLごとの判定履歴、新規URLの評価タイミング、URLパス固有の評価**が主要候補になっている。

ただし、公開後一定時間で必ず利用可能になるという仕様は確認できていないため、**時間経過説は有力仮説であり、未確定**。

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

### この結果が示すこと

以下では説明できない。

- HTML本文
- DOM構造
- CSS
- JavaScript
- 同一ドメインかどうか
- GitHub Pagesかどうか

残る主要候補は、

1. URLごとの読み上げ可否判定
2. URLの公開・認識からの経過時間
3. Chrome / Google 側のURL評価履歴
4. URLパスそのものに依存する別条件

である。

---

## Chrome / Chromium 実装から確認できたこと

公開されている Chromium の Read Aloud 実装では、ページの可読性を URL に対して問い合わせる `isPageReadable(...)` が存在する。

また、readability 情報を URL ごとに保持するキャッシュ構造がある。

過去の Chromium 変更では、

- ページ読み込み後に readability check を遅延実行する
- server readability check / readability request
- URL単位の readability cache

が確認できる。

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

### 有力だが未確定

**新規URLは、Chrome / Google 側で readable と判定されるまで時間が必要な可能性がある。**

ただし、

- 必要時間
- クロールの要否
- Google Search インデックス登録の要否
- Search Console の影響
- ドメイン評価の影響

はいずれも未確認。

### 現時点で弱くなった仮説

- GitHub Pages が原因
- Vercel が原因
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

---

## 次の観測計画

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
