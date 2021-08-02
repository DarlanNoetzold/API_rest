const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM products;',
            (error, resultado, fields) => {
                if(error) { return res.status(500).send({ error: error})}
                return res.status(200).send({response: resultado})
            }
        )
    })

});

router.post('/',(req, res, next) =>{
    const produto = {
        name: req.body.name,
        price: req.body.price,
        productImage: req.body.productImage,
        categoryId: req.body.categoryId
    }

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error})}
        conn.query(
            'INSERT INTO products (name, price, productImage, categoryId) VALUES (?,?,?,?)',
            [req.body.name, req.body.price, req.body.productImage, req.body.categoryId],
            (error, resultado, field) =>{
                conn.release();

                if(error) { return res.status(500).send({ error: error})}
                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso',
                    productName: resultado.name
                });
            }
        )
    })

    
}); 

router.get('/:id_produto', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM products WHERE productId = ?;',
            [req.params.id_produto],
            (error, resultado, fields) => {
                if(error) { return res.status(500).send({ error: error})}
                return res.status(200).send({response: resultado})
            }
        )
    })
    
});

router.patch('/', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
            conn.query(
                `UPDATE products
                    SET name = ?,
                        price = ?,
                        productImage = ?,
                        categoryId = ?
                    WHERE productId = ?
                `,
                [req.body.name, req.body.price, req.body.productImage, req.body.categoryId, req.body.productId],
                (error, resultado, field) =>{
                    conn.release();

                    if(error) { return res.status(500).send({ error: error })}
                    res.status(202).send({
                        mensagem: 'Produto atualizado com sucesso',
                        productName: resultado.name
                    });
                }
            )
        });
});


router.delete('/', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            `DELETE FROM products WHERE productId = ?`,
            [req.body.productId],
            (error, resultado, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Produto deletado com sucesso',
                    productName: resultado.name
                });
            }
        )
    });
});

module.exports = router;
