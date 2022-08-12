const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const ejs = require('ejs');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const methodOverride = require('method-override');
const Photo = require('../models/Photo');

//Templete Engine
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photoPerPage = 2;
  const totalPhotos = await Photo.find({}).countDocuments();
  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((page - 1) * photoPerPage)
    .limit(photoPerPage);
  res.render('index', {
    photos: photos,
    current: page,
    pages: Math.ceil(totalPhotos / photoPerPage),
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  let uploadImage = req.files.image;

  let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;
  const uploadDir = 'public/uploads/';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  await photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
