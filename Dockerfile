# ビルドステージ
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 公開ステージ
FROM nginx:alpine

# ビルド成果物をコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginxの設定ファイルを新しく作成（$PORT を使うように記述）
# ここで直接 8080 を指定しても良いですが、Cloud Run の仕様に合わせるため
# 起動時に環境変数を流し込む設定にします。
RUN printf "server {\n\
    listen 8080;\n\
    location / {\n\
    root /usr/share/nginx/html;\n\
    index index.html index.htm;\n\
    try_files \$uri \$uri/ /index.html;\n\
    }\n\
    }\n" > /etc/nginx/conf.d/default.conf

# Cloud Run のデフォルトポートである 8080 で起動するように設定し、
# もし環境変数 PORT が指定されていればそれに合わせるようにします。
CMD sed -i "s/8080/${PORT:-8080}/g" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
