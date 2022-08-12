const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const port = 3000;
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override');
const photoController = require('./controllers/photoController');
const pageController = require('./controllers/pageController');



//Connect Database
mongoose.connect('mongodb://localhost/pcat-test-db');

//Templete Engine
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);

app.get('/add', pageController.getAddPage);

app.get('/about', pageController.getAboutPage);

app.get('/photos/edit/:id', pageController.getEditPage);

app.delete('/photos/:id', photoController.deletePhoto);

app.listen(port, () => {
  console.log(`sunucu ${port} portunda başlatıldı`);
});
