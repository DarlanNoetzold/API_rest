const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({ error: error})}
        conn.query(
            `SELECT orders.orderId,
                    orders.quantity,
                    product.productId,
                    product.name,
                    product.price,
            FROM orders
            INNER JOIN products
                ON products.productId = orders.productId`,
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error})}
                const response = {
                    quantity: result.length,
                    orders: result.map(order =>{
                        return{
                            orderId: order.orderId,
                            productId: order.productId,
                            quantity: order.quantity,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna a documentação de um pedido em específico',
                                url: 'http://localhost:3000/pedidos/' + order.orderId
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
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM products where productId = ?', [req.body.productId], (error, result, field) => {
            if (error) { return res.status(500).send({ error: error }) }
            if(result.lenght == 0){
                return res.status(404).send({
                    mensagem: 'Não foi encontrado o produto com este ID'
                })
            }
            conn.query(
                'INSERT INTO orders (productId, quantity) VALUES (?,?)',
                [req.body.productId, req.body.quantity],
                (error, result, field) => {
                    conn.release();
    
                    if (error) { return res.status(500).send({ error: error }) }
                    const response = {
                        mensagem: 'Pedido inserido com sucesso',
                        pedidoCriado: {
                            orderId: result.orderId,
                            productId: req.body.productId,
                            quantity: req.body.quantity,
                            request: {
                                tipo: 'POST',
                                descricao: 'Retorna todos os pedidos',
                                url: 'http://localhost:3000/pedidos/'
                            }
                        }
                    }
                    res.status(201).send(response);
                }
            )
        })
    });
}); 

router.get('/:orderId', (req, res, next) =>{
    mysql.getConnection((error, conn) =>{
        if(error) { return res.status(500).send({ error: error})}
        conn.query(
            'SELECT * FROM orders WHERE orderId = ?;',
            [req.params.orderId],
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error})}

                if(result.lenght == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o pedido com este ID'
                    })

                }
                const response = {
                    order:{
                        orderId: result[0].orderId,
                        productId: result[0].productId,
                        quantity: result[0].quantity,
                        request: {
                            tipo: 'GET',
                            descricao: 'Returna todos os pedidos',
                            url: 'http://localhost:3000/pedidos/'
                        }
                    }
                }
                res.status(200).send(response);            }
        )
    })
    
});

router.delete('/', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query(
            `DELETE FROM orders WHERE orderId = ?`,
            [req.body.orderId],
            (error, result, field) => {
                conn.release();

                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido novo',
                        url: 'http://localhost:3000/pedidos/',
                        body: {
                            "productId": "Number",
                            "quantity": "Number"
                        }
                    }
                }
                res.status(202).send(response);
            }
        )
    });
});

module.exports = router;
