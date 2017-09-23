const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const config = require('../config');
const User = require('../models/user');
const Message = require('../models/message');

router.post('/register', function(req, res, next){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hash
        });

        newUser.save(function(err, user) {
            if (err) throw err;
            let token = jwt.sign({data: user}, config.secret, {expiresIn: '7d'});

            res.json({
                success: true,
                token: token,
                user_id: user._id,
                message: 'User created successfully'
            });
        });
    })
})

router.post('/login', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user){
            if (!user) {
            res.json({
                message: 'User not exist',
            })
        } else {
            var response = res;
            bcrypt.compare(req.body.password, user.password, function(err, res) {
                if (res == false) {
                    res.json({
                        message: 'Wrong Password'
                    });
                } else {
                    let token = jwt.sign({data: user}, config.secret, {expiresIn: '7d'});

                    response.json({
                        success: true,
                        token: token,
                        user_id: user._id,
                        message: 'User created successfully'
                    });
                }
            })
        }
    })
});

const auth = function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({ message: 'failed to authenticate token'});
            } else {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.json({
            success: false,
            message: 'No Token provided'
        });
    }
};

router.post('/message', function(req, res, next) {
    User.findOne({username: req.body.username}, function(err, user) {
        if (!user) {
            res.json({
                success: false,
                messsage: 'No user found',
            });
        } else {
            let newMessage = new Message({
                sender_id: req.body.sender_id,
                receiver_id: user._id,
                content: req.body.content,
                createdAt: new Date(),
                name: user.name
            });

            newMessage.save(function(err, user) {
                if (err) throw err;
                res.json({
                    success: true,
                    message: 'Message sent successfully',
                });
            });
        }
    })
})

router.get('/messages/:id', auth, function(req, res, next) {
    Promise.all([Message.find({receiver_id: req.params.id}),
                 Message.find({sender_id: req.params.id})])
                .then(data => {
                    let received = data[0];
                    let sent = data[1];

                    res.json({
                        received: received,
                        sent: sent,
                    });
                });
});

module.exports = router;
