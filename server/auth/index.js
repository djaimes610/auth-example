const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const db = require('../db/connection');
const users = db.get('users');
//users.index('username');
users.createIndex('username', { unique: true });

const router = express.Router();

const schema = Joi.object().keys({
    username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(30).required(),
    password: Joi.string().trim().min(10).required()
});

// any route in here is pre-pended with /auth
router.get('/', (req, res) => {
    res.json({
        message: 'locked'
    });
});

// POST /auth/signup

router.post('/signup', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
        // if user is undefined, is not in db, otherwise, user is duplicated
        users.findOne({
            username: req.body.username
        }).then(user => {

            if (user) {
                //there is already a user in DB
                const error = new Error('That user is already taken!');
                next(error);
            } else {
                // hast pass
                // insert user with hashed pass
                bcrypt.hash(req.body.password, 15).then(hashedPassword => {
                    const newUser = {
                        username : req.body.username,
                        password : hashedPassword
                    };
                    users.insert(newUser).then(insertedUser => {
                        delete insertedUser.password;
                        res.json(insertedUser);
                    });
                });
            }
        });
    } else {
        next(result.error);
    }
    //res.json(result);
})

module.exports = router;