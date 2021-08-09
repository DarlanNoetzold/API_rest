const express = require('express');
const router = express.Router();

const UserController = require('../controllers/users-controller');

router.post('/cadastro', UserController.userCadastro); 

router.post('/login', UserController.userLogin);

module.exports = router;