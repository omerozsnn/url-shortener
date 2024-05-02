require('dotenv').config();
const express = require('express');
const cors = require('cors');
const res = require('express/lib/response');
const req = require('express/lib/request');
const app = express();
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const url = require('url');
const dns = require('node:dns');
// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.DB_URI);
const urlSchema = new mongoose.Schema({
  original_url: {type:String, required:true, unique:true },
  short_url: {type:String, required: true, unique:true }
})
const UrlModel = mongoose.model('urlparsed', urlSchema);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req,res)=>{
  let url = req.body.url;
  const urlparsed = new URL(url)
  dns.lookup(urlparsed.hostname, (err,address)=>{
    if(!address)
    {return res.json('invalid input')}
    else
    { let short_url = 1;
      let original_url = urlparsed.href;
      res.json({original_url:original_url, short_url:short_url})
    }
  })
  

  



})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
