const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM products;',
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error})}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod =>{
                        return{
                            productId: prod.productId,
                            name: prod.name,
                            price: prod.price,
                            categoryId: prod.categoryId,
                            productImage: prod.productImage,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna a documentação de um produto em específico',
                                url: 'http://localhost:3000/produtos/' + prod.productId
                            }
                        }
                    })
                }

                return res.status(200).send(response)
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
            (error, result, field) =>{
                conn.release();

                if(error) { return res.status(500).send({ error: error})}
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado:{
                        productId: result.productId,
                        name: req.body.name,
                        price: req.body.price,
                        categoryId: req.body.categoryId,
                        productImage: req.body.productImage,
                        request: {
                            tipo: 'POST',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }
                res.status(201).send(response);
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
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error})}

                if(result.lenght == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o produto com este ID'
                    })

                }
                const response = {
                    produto:{
                        productId: result[0].productId,
                        name: result[0].name,
                        price: result[0].price,
                        categoryId: result[0].categoryId,
                        productImage: result[0].productImage,
                        request: {
                            tipo: 'GET',
                            descricao: 'Returna todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }
                res.status(200).send(response);            }
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
                (error, result, field) =>{
                    conn.release();

                    if(error) { return res.status(500).send({ error: error })}
                    const response = {
                        mensagem: 'Produto atualizado com sucesso',
                        produtoAtualizado:{
                            productId: req.body.productId,
                            name: req.body.name,
                            price: req.body.price,
                            categoryId: req.body.categoryId,
                            productImage: req.body.productImage,
                            request: {
                                tipo: 'POST',
                                descricao: 'Insere um produto',
                                url: 'http://localhost:3000/produtos/' + req.body.productId
                            }
                        }
                    }
                    res.status(202).send(response);
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
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Retorna o produto atualizado',
                        url: 'http://localhost:3000/produtos/',
                        body: {
                            name: 'String',
                            price: 'Number',
                            productImage: 'String',
                            categoryId: 'Number'

                        }
                    }
                }
                res.status(202).send(response);
            }
        )
    });
});

module.exports = router;
