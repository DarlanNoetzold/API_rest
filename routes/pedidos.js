const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando GET da nova rota PEDIDOS'
    });
});

router.post('/',(req, res, next) =>{
    res.status(201).send({
        mensagem: 'Usando POST da nova rota PEDIDOS'
    });
}); 

router.get('/:id_pedido', (req, res, next) =>{
    const id = req.params.id_pedido;

    if(id == 1){
        res.status(200).send({
            mensagem: 'Id especial PEDIDOS',
            id: id
        });
    }else{
        res.status(200).send({
            mensagem: 'Usando GET da nova rota PEDIDOS',
            id: id
        });
    }
    
});

router.patch('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando patch da nova rota PEDIDOS'
    });
});

router.delete('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando delete da nova rota PEDIDOS'
    });
});

module.exports = router;
