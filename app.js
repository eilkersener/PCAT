const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const ejs = require('ejs');

app.set("view engine","ejs");

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('index')
});

app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
