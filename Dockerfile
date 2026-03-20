# ビルドステージ
FROM node:20-alpine AS build

WORKDIR /app

# 依存関係をコピーしてインストール
COPY package*.json ./
RUN npm install

# ソースコードをコピーしてビルド
COPY . .
RUN npm run build

# 公開ステージ
FROM nginx:alpine

# Nginxのデフォルト設定を削除し、環境変数PORTに対応させる
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run は環境変数 $PORT を使用するため、起動時に Nginx のポートを置換する
CMD sed -i "s/listen  80;/listen ${PORT:-80};/" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
