--説明
`/api` は Hono を使用しているため、開発・修正時には hono-skills と hono-cli を活用します。
アーキテクチャは クリーンアーキテクチャ を使用しAPIを構築します。OpenAPI・共有Zodスキーマで入出力を定義し、Swagger UIで確認してからユースケース・永続化処理を実装します。
データベースは Cloudflare D1 R2　を利用する

- `.env` ファイルを変更しない

--CI/CD

- APIはCloudflare Workersの `collegenavi-api` にデプロイする。
- mainへのpush時、`api/**`・`schemas/**`・`.github/workflows/api-ci.yml` の変更を対象に、CI成功後に自動デプロイする。
- mainへのマージは本番反映につながるため、明示的な依頼がある場合に行う。
- Worker名・バインディング・デプロイ条件は、依頼なく変更しない。
- Cloudflare認証情報はGitHub Actions Secretsで管理し、コードやログに出力しない。
- D1マイグレーションは現在のCDに含まれていない。
