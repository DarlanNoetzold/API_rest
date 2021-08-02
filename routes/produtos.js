const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Usando GET da nova rota'
    });
});

router.post('/',(req, res, next) =>{
    const produto = {
        name: req.body.name,
        price: req.body.price,
        productImage: req.body.productImage,
        categoryId: req.body.categoryId
    }

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO products (name, price, productImage, categoryId) VALUES (?,?,?,?)',
            [req.body.name, req.body.price, req.body.productImage, req.body.categoryId],
            (error, resultado, field) =>{
                conn.release();

                if(error){
                    res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                console.error(error);
                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso'
                });
            }
        )
    })

    
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
