const express = require('express');
const router = express.Router();

router.get('/about', (req, res) => {
    res.render('aboutUs');
});

router.get('/schedule', (req, res) => {
    res.render('schedule');
});

router.get('/gallery', (req, res) => {
    res.render('gallery');
});

router.get('/blog', (req, res) => {
    res.render('blog');
});

router.get('/blogDetails', (req, res) => {
    res.render('blogDetails');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;