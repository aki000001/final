# MongoDB セットアップガイド

このアプリケーションはMongoDBを使用してデータを保存します。以下の手順でセットアップしてください。

## 方法1: MongoDB Atlas（クラウド - 推奨）

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) にアクセスしてアカウントを作成

2. 無料のM0クラスタを作成
   - プロバイダー: AWS, Google Cloud, またはAzure
   - リージョン: お近くのリージョンを選択

3. データベースユーザーを作成
   - Database Access → Add New Database User
   - ユーザー名とパスワードを設定（メモしておく）

4. ネットワークアクセスを設定
   - Network Access → Add IP Address
   - 開発中は「Allow Access from Anywhere」(0.0.0.0/0) を選択

5. 接続文字列を取得
   - Clusters → Connect → Connect your application
   - Driver: Node.js
   - 表示された接続文字列をコピー
   - 例: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. `.env.local` ファイルを作成
   ```bash
   # プロジェクトルートに作成
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/supermarket-board?retryWrites=true&w=majority
   ```
   - `<username>` と `<password>` を実際の値に置き換える
   - データベース名（この例では `supermarket-board`）を追加

## 方法2: ローカルMongoDB

1. MongoDBをインストール
   - [公式サイト](https://www.mongodb.com/try/download/community)からダウンロード
   - またはHomebrewを使用（Mac）: `brew install mongodb-community`

2. MongoDBを起動
   ```bash
   # Mac/Linux
   mongod --dbpath ~/data/db

   # Windows
   mongod --dbpath C:\data\db
   ```

3. `.env.local` ファイルを作成
   ```bash
   MONGODB_URI=mongodb://localhost:27017/supermarket-board
   ```

## アプリケーションの起動

1. 環境変数が設定されているか確認
   ```bash
   cat .env.local
   ```

2. 開発サーバーを起動
   ```bash
   npm run dev
   ```

3. ブラウザで http://localhost:3000 にアクセス

## データの確認

### MongoDB Atlas の場合
- Atlas ダッシュボード → Clusters → Browse Collections

### ローカルの場合
- MongoDB Compassをインストールして接続
- またはmongoシェルを使用
  ```bash
  mongosh
  use supermarket-board
  db.threads.find()
  db.replies.find()
  ```

## トラブルシューティング

### 「MONGODB_URI環境変数を設定してください」エラー
- `.env.local` ファイルがプロジェクトルートに存在するか確認
- ファイル名が正確か確認（`.env.local.txt` などになっていないか）
- サーバーを再起動

### 接続エラー
- MongoDB Atlas の場合: IPアドレスがホワイトリストに登録されているか確認
- ローカルの場合: MongoDBサーバーが起動しているか確認
- 接続文字列のユーザー名・パスワードが正しいか確認

### データが表示されない
- ブラウザのコンソールでエラーを確認
- サーバーのログを確認
- MongoDBに直接接続してデータが存在するか確認
