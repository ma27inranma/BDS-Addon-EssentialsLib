[readme.md](readme.md) 英語版

# EssentialsLib
Minecraft: Bedrock Edition で使えるいろいろな機能を提供する(予定)のライブラリです。

## 機能
- Hitbox判定 (CollisionVolume)
  - AABB (Minecraftで使用されているようなボックスの形)
	- Cone (円錐の形)

## 使い方
[Release](https://github.com/ma27inranma/BDS-Addon-EssentialsLib/releases) から最新のバージョンの.js, .d.ts, .js.map, license.md をダウンロードする
Script APIから参照できる場所にフォルダを作り、中にそれらを配置する
`essentialslib.js` を import する

## 例
[example_collision.js](examples/example_collision.js)