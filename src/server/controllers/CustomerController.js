const {Customer} = require("../models/db");
const fun = require('../lib/function');
let jwt = require("jsonwebtoken");
const {config} = require('../config/serv.config');

// Create and Save a new Customer
let create = async (req, res) => {
    Customer.createUser(req.body)
        .then(user => user ? res.json({
            'msg': 'Success',
            user
        }) : res.status(400).json({message: 'Username cant add'}))
        .catch(err => res.status(400).json({message: err.errors[0].message}));
};

// Retrieve all Customers from the database.
let findAll = async (req, res) => {
    Customer.findAllUser().then(users => users ? res.json({
        'msg': 'Success',
        users
    }) : res.status(400).json({message: 'Users cant get answer admin'}))
        .catch(err => res.status(400).json({message: err}));
};

// Find a single Customer with a customerId
let findOne = async (req, res) => {
    Customer.findFullInfo(req.params)
        .then(user => user ? res.json({
            'msg': 'Success',
            user
        }) : res.status(400).json({message: 'Username cant Find'}))
        .catch(err => res.status(400).json({message: err}));
};

// Update a Customer identified by the customerId in the request
let update = async (req, res) => {
    const {user_id} = req.params;

    Customer.updateById(req.body,user_id)
        .then(user => user ? res.json({
            'msg': 'Success',
            user
        }) : res.status(400).json({message: 'Username cant Update'}))
        .catch(err => res.status(400).json({message: err}));
};

// Delete a Customer with the specified customerId in the request
let delete_user = async (req, res) => {
    Customer.deleteById(req.params).then(user => user ? res.json({
        'msg': 'Success',
        user
    }) : res.status(400).json({message: 'Username cant Delete'}))
        .catch(err => res.status(400).json({message: err}));
};

let authenticate = async (req, res) => {
    Customer.findByLogin(req.body)
        .then(user => user ? res.status(200).json(fun.token_controller(user)) : res.status(400).json({message: 'User cant find check fields'}))
        .catch(err => res.status(400).json({message: err}));
};

let token = (req, res) => {
    jwt.verify(req.body.token, config.refresh_secret, (err, user) => {
        if (err) res.status(403).json({message: 'Refresh token incorrect'});
        let accessToken = fun.generateAccessToken({user}, config.secret, '60s');
        res.status(200).json({'msg': 'Success', accessToken})
    },);
};


module.exports = {
    token,
    authenticate,
    delete_user,
    update,
    findOne,
    findAll,
    create
};