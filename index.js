const express = require('express')
const bodyParser = require('body-parser')
const ngrok = require('ngrok')

let endpoint = ''
const app = express();
app.use(bodyParser.json({ type: '*/*' }))

app.get('/', function(req, res) {
    res.send('hello world');
});

// run the app server and tunneling service
app.listen(8888, () => {
    ngrok.connect(8888).then(ngrokUrl => {
      endpoint = ngrokUrl
      console.log(`Login Service running, open at ${endpoint}`)
    }).catch(error => console.error(error))
})