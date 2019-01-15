// server.js

const {getMetadata} = require('page-metadata-parser');
const domino = require('domino');

const fetch = require('node-fetch')
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors')

app.use(cors())

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

async function retrieveUrl(){
  return await fetch('https://vg.no/')
  .then(res => res.json())
}

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/fetch', async function(req, res) {

    if (req.body.source) {
      const url = req.body.source;
      const response = await fetch(url);
      const html = await response.text();
      const doc = domino.createWindow(html).document;
      const metadata = getMetadata(doc, url);
  
      res.json({ meta: metadata });    
    }
    
    res.json({ error: 'No source specified!' })
    
});

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
