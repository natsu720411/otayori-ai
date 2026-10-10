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
