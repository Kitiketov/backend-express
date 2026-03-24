const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, '..', 'mydb.db'));

db.run(`CREATE TABLE IF NOT EXISTS users
        (
            id
            INTEGER
            PRIMARY
            KEY
            AUTOINCREMENT,
            name
            TEXT
            NOT
            NULL
        )`);

router.get('/', function (req, res, next) {
    db.all('SELECT id, name FROM users', [], (err, rows) => {
        if (err) {
            return next(err);
        }

        return res.json(rows);
    });
});

router.post('/', function (req, res, next) {
    const {name} = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({error: 'Name is required'});
    }

    const insert = 'INSERT INTO users (name) VALUES (?)';

    return db.run(insert, [name], function (err) {
        if (err) {
            return next(err);
        }

        const newUser = {
            id: this.lastID,
            name,
        };

        return res.status(201).json(newUser);
    });
});

router.get('/:id', function (req, res, next) {
    const userId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(userId)) {
        return res.status(400).json({error: 'Invalid user id'});
    }

    return db.get('SELECT id, name FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) {
            return next(err);
        }

        if (!row) {
            return res.status(404).json({error: 'User not found'});
        }

        return res.json(row);
    });
});

module.exports = router;
