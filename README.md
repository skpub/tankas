# Tankas

短歌共有サービス、Tankas.

名言管理API meigens-api (https://github.com/skpub/meigens-api) をバックエンドとして作られた短歌共有サービスです。

## 動かし方

まずmeigens-apiを動かしてください。
meigens-apiの動作には

* sqlc
* atlas (マイグレーションツール)
* docker

が必要です。事前にインストールしておいてください。

以下、meigens-apiをcloneしてcdしたディレクトリにて
```bash
docker compose up -d
./migrate.sh
(.envを環境に合わせて編集)
go run src/main.go
```
これでmeigens-apiが動きます(ビルドしたければしてください)。

なお、CORSのOrigin設定は.envで行ってください(デフォのやつが書いてあるはずですので書き換えてください)。
動かす予定のフロント(Tankas)のOriginを指定すれば良いです。

```bash
npm run dev
```

ビルドしたりCaddyなりnginxなりでちゃんとやったりしたければ好きにやってください。
