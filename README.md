Ivy Lee List
===

## Overview
これは、簡素なスマホ向けToDoアプリです。勉強用に作成しました。  

![image](https://user-images.githubusercontent.com/33190342/54879074-32648000-4e78-11e9-8311-768b8be2e09b.png)

## Description
フロントエンドにReact、バックエンドにRails(API)を使用しています。  
React部分には、[Framework7](https://framework7.io/react/)を使用しています。  
バックエンド部分は[こちら](https://github.com/xojan0120/ivy_lee_list_api)  

認証機能はありません。

## Install
```
git clone https://github.com/xojan0120/ivy_lee_list
cd ivy_lee_list
npm install
npm start
```

バックエンドサーバのエンドポイントURIを以下の2つのファイルが必要です。
```
.env.development.local # ローカル開発環境用
.env.production # 本番環境用(npm build時に読み込まれる)
```

ファイルの中身はいずれも下記の通りです。
```
REACT_APP_API_ENDPOINT_URI = http://<HOST>:<PORT>/api/v1/ill
```

## build
```
npm run build
```

### アプリの使い方
* タスクを入力するとリストの一番上に追加されます。
* 入力したタスク部分をタップすると編集することができます。
* 左端のタグアイコンをタップすると、区切り線のすぐ下に移動します。
* 右端の移動アイコンをドラッグすると、並び替えができます。
* タスクを右にスワイプすると、タスクをアーカイブすることができます。
* アーカイブされたタスクは、右上のチェックマークアイコンをタップすると表示できます。
* アーカイブ画面のタスクを右にスワイプすると、タスクをレストア、または、削除できます。
* アーカイブ画面の右上のゴミ箱アイコンをタップすると、アーカイブしたタスクを全削除できます。

### 私の使い方
このToDoアプリは私が日々行っているアイビーリーメソッドによるToDo管理のために作成しました。  

アイビーリーメソッドとは
> 1. 紙に「明日やるべきこと」を6つ、メモする
> 2. その6項目を重要だと思われる順に1、2、3、4、5、6と番号を振る
> 3. 翌日、このメモの順番に従って仕事を進める
> 4. もし全部できなかったら、悔やむことなく忘れる
> 5. その後、明日のための6つの項目を新しくメモする
> 6. 1～5を丁寧に繰り返す

（引用元：メンタリスト DaiGo（2016）,『自分を操る超集中力』,かんき出版.）

1日の始めに、区切り線より上に優先順に6つのタスクを入力します。  
上から順にタスクを実行し、そのタスクが完全に完了した場合はアーカイブします。  
そのタスクを翌日も繰り返したいときは、区切り線より下に移動しておきます。  
1日の途中で新たに思いついたタスクも、入力して下に移動しておきます。  
翌日の朝、下に移動したタスクから、その日にやるタスクを6つ選び、上に並べます。  
あとは繰り返し。

## Licence
[MIT](https://opensource.org/licenses/MIT)

## Author
[Kido Ryosuke](https://github.com/xojan0120)
