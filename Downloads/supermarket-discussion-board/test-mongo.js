const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('接続文字列:', MONGODB_URI);
console.log('\nMongoDB接続テスト開始...\n');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB接続成功！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('✗ MongoDB接続失敗:');
    console.error('エラーコード:', error.code);
    console.error('エラー名:', error.codeName);
    console.error('エラーメッセージ:', error.message);
    process.exit(1);
  });
