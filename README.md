# s3のイベントをテストしたい

s3のイベント情報を模したjson(events/s3-event)を作り下記を実行。

```
sam local invoke HelloWorld -e events/s3-event.json
```

# s3からのイベント登録はlambdaを作成するたびにする

テンプレートからlambdaを作成するたびにarnが変わる。s3からのイベントの飛ばし先を毎回設定する必要がある。