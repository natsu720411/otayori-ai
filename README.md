# おたよりAI

個人教室向けのお知らせ文・休講連絡・SNS文章を作る試作Webアプリ。

## 現在できること
- GitHub Pages: テンプレートによる文章生成、編集、コピー、ローカル履歴保存
- Cloudflare Pages + Workers AIバインディング設定後: AIによる文章生成
- 生徒の氏名などの個人情報は入力しないでください

## Cloudflare Pages に公開してAI生成を有効化する手順
1. 無料Cloudflareアカウントで **Workers & Pages → Create → Pages → Connect to Git** に進み、このリポジトリを選ぶ。
2. Framework preset: **None**、Production branch: **main**、Build command: **exit 0**、Build output directory: **.** にして公開する。
3. Pagesプロジェクトの **Settings → Bindings** から **Workers AI** バインディングを追加し、Variable name を **AI** にする。Production環境に追加する。
4. バインディング設定後、**再デプロイ** して \`https://<project>.pages.dev/\` を開き、「AIで文章を生成」を選択する。
5. AIの利用状況・無料枠をCloudflareダッシュボードで確認する。

`functions/api/generate.js` は Cloudflare Pages Functions のサーバーコードです。APIキーをブラウザに置く必要はありません。

## 注意
- テンプレートモードでの入力は端末内で処理。AIモードでは入力がCloudflare Workers AIに送られます。
- 無料枠を超えるとAI生成できなくなります。
- 現段階では試作版。一般公開前に利用規約・プライバシー説明・濫用対策（Turnstile / レート制限等）を導入してください。
- GitHub Pagesは商用SaaSのホスティングに利用できません。本格運営にはCloudflare Pages等を使用してください。

## AI接続後の確認（2026年10月）
Cloudflare Pagesの本番環境に Workers AI バインディング `AI` を保存した後は、再デプロイが必要です。`main` ブランチの更新で自動デプロイされる設定の場合、今回の更新が再デプロイのきっかけになります。
公開サイトで「AIで文章を生成（Cloudflare公開後）」を選び、架空の教室のお知らせを入力して文章が返るか確かめてください。エラーが出る場合は、Cloudflareの「デプロイ」画面で最新のビルドが成功したかと、Production 側のバインディング名が `AI` であるかを確認してください。

## 使いやすさの改善（2026年10月）
- 教室名・送信先・文体・生成モード・文章の長さを明示的な操作でブラウザに保存できます。個人情報や本文は「教室の設定」に保存しません。
- AIの文章の長さを「短め・標準・詳しく」から選択できます。テンプレートでも長さを切り替えられます。
- 架空のお知らせ例（発表会・休講・月のおたより）を入力欄に反映できます。
- 保存した文章の履歴を1件ずつ削除できます。本文編集後のコピー・保存もできます。
- 設定と履歴は同じブラウザ・同じドメインのみに保存されるため、別の端末やGitHub PagesからCloudflare Pagesには同期されません。

### 運用前の注意
本サービスのAI APIはパブリックにアクセス可能です。UI側の制限はサーバーの悪用防止ではないため、不特定多数への告知・収益化より先にCloudflareのレート制限やTurnstile等の濫用対策、利用規約・プライバシー方針を整えてください。

## 集客・安心して使うためのページ
- `guide.html`: 発表会、休講、月のおたよりの独立した例文と注意点
- `privacy.html`: AI送信・保存する情報・削除方法など
- `robots.txt` と `sitemap.xml`: Cloudflare Pages版を検索に案内
- メインページに説明・FAQへの導線・共有用メタデータを追加

## Turnstile（公開AIを保護するための重要設定）
本実装は**任意の認証を設定可能にした段階**です。キー未設定ではAI生成を止めないため、公開APIの濫用防止にはなりません。本番利用前に有効化してください。

1. Cloudflare dashboard の **Turnstile** に進み、無料のManaged widgetを作る。
2. ホスト名を `otayori-ai.pages.dev` とする。サイトキー（公開用）とシークレットキー（非公開）を取得する。
3. Workers & Pages → otayori-ai → Settings → Variables and Secrets で本番環境に `TURNSTILE_SITE_KEY`（文字列）、`TURNSTILE_SECRET_KEY`（暗号化されたSecret）を登録する。**シークレットはGitHubに絶対保存しない**。
4. 本番環境を再デプロイする。`/api/config` に公開用sitekeyのみが返ることを確認する。
5. サイトを開くと安全確認が現れ、成功するとサーバー側のSiteverify検証後にAI生成できる。使い終わったトークンは毎回更新される。

**片方のキーだけ**設定された場合は、誤った認証回避を防ぐためにサーバーが503を返し、生成が止まります。設定前は従来どおりAI生成が可能です。Turnstileはbot対策の一部で、無制限のアクセスやAI消費を保証するものではありません。別途Cloudflareのリクエスト制限・消費モニタリングも必要です。

## Cloudflare Pages の再デプロイについて
GitHub連携で作成した Pages プロジェクトは、production branch `main` への新規コミットで自動デプロイされます（自動デプロイが有効の場合）。Turnstile の `TURNSTILE_SITE_KEY` と `TURNSTILE_SECRET_KEY` を Production に保存した後、Cloudflare の **Workers & Pages → otayori-ai → Deployments** で、この README 更新コミットに対応する新しいデプロイが Success か確認してください。コード側に秘密鍵を記載しないでください。

## 文章作成フローの改善（2026年10月）
- ピアノ・音楽／英会話・語学／スポーツ・ダンス／学習塾のジャンル設定（任意）を追加
- AI生成済み・編集中の文章を「やわらかく／丁寧／短く／読みやすく」書き直し（追加AI呼び出し）
- Turnstileによるサーバー検証を **新規生成と書き直しの両方** に適用
- 編集前へ1回戻す、.txt保存（端末内）、文字数表示、公開前のチェック項目を追加
- これまでの保存済み履歴・テンプレート生成・設定保存を維持
- 生徒の個人情報や機密情報は入力しないこと。AIが書き直した内容は必ず原稿と比較すること

## 運用時の注意
- AIの書き直しも新規生成と同じくモデル利用量を消費します。過度な連続実行に対しては Turnstile のみでは十分な保護になりません。
- 一般公開前に Cloudflare のサーバー側レート制限と消費状況の監視を追加してください。
- 自動チェックは警告のみ。必須情報や日付などの正しさを機械的に保証するものではありません。

## 継続利用向け改善
- 文章の保存履歴を検索でき、お気に入りを一覧の先頭に表示します。
- 20件超過時にはお気に入りを優先して残します（同じブラウザ内のみ）。

## AI回数制限（無料のCloudflare D1、設定後に有効）
**コードを配置しただけではサーバー側の制限は有効になりません。**
本番運営前にCloudflareダッシュボードで以下を設定してください。
1. Workers & Pages → D1 SQL Database で `otayori-ai-limits` 等のDBを作成。
2. D1 Consoleで `schema.sql` のSQLを実行してテーブルを作成。
3. otayori-ai → Settings → Bindings → D1 Database → 新しいDBを `AI_RATE_DB` という名前でProductionに紐付け。
4. Settings → Variables and Secrets → `AI_RATE_SALT` を **Secret** としてProductionに登録（32文字以上のランダムな英数字を推奨、最低24文字）。キーはGitHubやチャットに絶対載せない。
5. 再デプロイ後、`https://otayori-ai.pages.dev/api/config` で `rateLimitEnabled: true` を確認。

D1とソルトの片方だけが設定された場合、AI利用は503で停止します。両方ある時は、同一接続元からAI文章作成＋書き直しを12回/時に制限し、上限後は429を返します。利用者のIPアドレスは保存せず、時間ごとに変化するHMAC-SHA256のハッシュキーで回数を記録します。D1障害時には生成を停止します。学校など共用回線では回数を共有します。大量アクセス・VPNによる制限回避には別の対策が必要です。


## D1接続後の本番確認チェック
Cloudflare側で `AI_RATE_DB`（D1バインディング）と `AI_RATE_SALT`（Secret）を設定したら、`main` へのコミットでPagesの自動デプロイを開始します。

- Cloudflare → Workers & Pages → otayori-ai → Deployments で、このコミットに対応するProductionデプロイが成功したことを確認。
- `https://otayori-ai.pages.dev/api/config` を開き、`rateLimitEnabled: true` と `rateLimitMisconfigured: false` が返ることを確認。
- AIで文章生成を1回実行し、既存のTurnstile認証とD1の両方が正常に動くことを確認。
- `rateLimitEnabled: false` ならバインディングとSecretの設定先がProductionか確認。DBを作成するだけでは制限は有効になりません。
- `rateLimitMisconfigured: true` なら片方の設定が不足しています。両方の設定を揃えてから再デプロイ。

## 検索流入を目的とした独立したガイド（2026年10月）
- `piano-recital.html`：ピアノ発表会の案内文とLINE文面、送信前の確認事項。
- `lesson-cancellation.html`：予定休講、急な休講、振替日が確定している場合の例文。
- 両ページから `/?sample=...` で入力例を文章作成フォームにセットする。許可済みの固定サンプルのみ使い、URLパラメータの自由入力は行わない。AI生成を自動実行せず、訪問者が日時・金額・場所を確認してから生成する。
- `guide.html` とトップページから相互リンク、`sitemap.xml` に追加。検索順位・流入効果は保証されないため、Google Search Consoleで実データを確認して改善する。

## SEO・導線・将来の料金案内（2026年10月）
- `english-trial.html`：英会話教室向け体験レッスンの案内文。本文例・LINE例・誤認防止のチェック。
- `monthly-newsletter.html`：習い事教室の月のおたより（家庭へのお願い・教室ごとの工夫を掲載）。
- ホームページの無料作成CTA、使い方3ステップ、サイトURLのみを共有するボタン。
- `/?sample=english-trial`、`english-line`、`monthly-parent`、`monthly-line` の固定サンプル入力を追加。サンプルにある日時や費用は架空と表示し、自動AI生成しない。
- `plans.html` は現在無料・将来の有料機能候補・料金未定・申し込み不可を明示。誤認防止のため `noindex,follow` を指定し、サイトマップには載せない。
- `GROWTH_PLAN.md` に、実データに基づく集客と課金準備のチェックリストを記載。
- Cloudflare Web Analytics はこのコミットでは**自動有効化されない**。Cloudflareダッシュボードで別途有効化したうえで、数字を見て改善方針を調整する。

## Cloudflare Pagesの正規URLの統一
Cloudflare Pages はHTMLページへの `/guide.html` などのアクセスを拡張子なしの `/guide` にリダイレクトします。検索エンジンに転送前URLを案内しないよう、内部リンク、canonical、サイトマップは `/guide` の形式で統一しました。GitHub内の実ファイル名は引き続き `guide.html` 等です。

## Cloudflare Web Analytics 接続後の確認（2026年10月）

ユーザーが Cloudflare Web Analytics を管理画面で有効にした後、`main` の更新で Cloudflare Pages の新しいデプロイを促すための記録。

1. Cloudflare → Workers & Pages → **otayori-ai** → Deployments で最新の Production が成功しているか確認する。
2. 公開サイト `https://otayori-ai.pages.dev/` と例文ページをブラウザで開いてみる。
3. Cloudflare Web Analytics のダッシュボードで、このサイトのデータが記録され始めたか確認する。反映まで多少時間がかかる場合がある。
4. 記録されない場合は、Analytics 側で正しいサイト／ホスト名が対象になっているか、Pagesへの自動導入が有効か確認する。
5. 初日から十分な数字が集まるとは限らない。最低でも数日分のデータが集まってから、閲覧されたページとSearch Consoleの検索クエリを比較する。

このコミットでは新しい解析用 JavaScript を手動挿入しない。Cloudflare の自動導入との二重計測を避けるため。
