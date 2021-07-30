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

router.get('/:id_produto', (req, res, next) =>{
    const id = req.params.id_produto;

    if(id == 1){
        res.status(200).send({
            mensagem: 'Id especial',
            id: id
        });
    }else{
        res.status(200).send({
            mensagem: 'Usando GET da nova rota',
            id: id
        });
    }
    
});

router.patch('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando patch da nova rota'
    });
});

router.delete('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando delete da nova rota'
    });
});

module.exports = router;
