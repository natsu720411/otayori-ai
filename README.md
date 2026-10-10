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
