const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('coach/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    
    const { name, lastName, dni, email, phoneNumber, salary } = req.body;

    const newCoach = {
        name,
        lastName,
        dni,
        email,
        phoneNumber,
        salary,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO coach set ?', [newCoach]);
    req.flash('success', 'Entrenador Guardado Satisfactoriamente.');
    res.redirect('/entrenadores');
});

router.get('/', isLoggedIn, async (req, res) => {
    const coachs = await pool.query('SELECT * FROM coach WHERE user_id = ?', [req.user.id]);
    res.render('coach/list', { coachs });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM coach WHERE ID = ?', [id]);
    req.flash('success', 'Entrenador Eliminado Satisfactoriamente.');
    res.redirect('/entrenadores');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM coach WHERE id = ?', [id]);
    res.render('coach/edit', {link: links[0]})
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { name, lastName, dni, email, phoneNumber, salary } = req.body;

    const coach = {
        name,
        lastName,
        dni,
        email,
        phoneNumber,
        salary
    };

    await pool.query('UPDATE coach set ? WHERE id = ?', [coach, id]);
    req.flash('success', 'Entrenador Editado Satisfactoriamente.');
    res.redirect('/entrenadores');
});

module.exports = router;