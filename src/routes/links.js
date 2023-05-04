const express = require('express');
const router = express.Router();
const moment = require('moment');
moment().format(); 

const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    
    const { name, lastName, dni, email, phoneNumber, emergencyNumber, dateInit, dateFinish } = req.body;

    const newLink = {
        name,
        lastName,
        dni,
        email,
        phoneNumber,
        emergencyNumber,
        dateInit,
        dateFinish,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO customer set ?', [newLink]);
    req.flash('success', 'Cliente Guardado Satisfactoriamente.');
    res.redirect('/clientes');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM customer WHERE user_id = ?', [req.user.id]);

    for (let i = 0; i < links.length; i++) {
        let customer = links[i];
        customer.fechaInicioMensualidad = moment(customer.dateInit).format('MMMM DD YYYY');
        let fechaActual = moment(new Date);
        let fechaVencimiento = moment(customer.dateFinish);
        customer.missingDays = (fechaVencimiento.diff(fechaActual, 'days') + 1);
        customer.warning = customer.missingDays <= 5;
    }

    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM customer WHERE ID = ?', [id]);
    req.flash('success', 'Cliente Eliminado Satisfactoriamente.');
    res.redirect('/clientes');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM customer WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]})
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { name, lastName, dni, email, phoneNumber, emergencyNumber, dateInit, dateFinish } = req.body;

    const newLink = {
        name,
        lastName,
        dni,
        email,
        phoneNumber,
        emergencyNumber,
        dateInit,
        dateFinish,
    };

    await pool.query('UPDATE customer set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Cliente Editado Satisfactoriamente.');
    res.redirect('/clientes');
});

module.exports = router;