const express = require('express');
const router = express.Router();
let users = [];
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send({
        "id": 1,
        "name": "name"
    });
});
router.post('/', function (req, res, next) {
    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
})
router.get('/:id', function (req, res, next) {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }

    res.json(user);
});

module.exports = router;
