const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando GET da nova rota'
    });
});

router.post('/',(req, res, next) =>{
    res.status(201).send({
        mensagem: 'Usando POST da nova rota'
    });
}); 

module.exports = router;
