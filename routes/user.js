const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/cadastro', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error})}
        conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results) =>{
            if(error) { return res.status(500).send({ error: error})}
            if(results.length > 0){
                res.status(409).send({ mensagem: 'User já cadastrado' })
            }else{
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if(errBcrypt){ return res.status(500).send({ error: errBcrypt})}
        
                    conn.query(
                        `INSERT INTO users (email, password) VALUES (?,?)`, 
                        [req.body.email, hash],
                        (error, result, field) =>{
                            conn.release();
                            response = {
                                mensagem: 'Usuário criado',
                                userCreate: {
                                    id_user: result.insertId,
                                    email: req.body.email
                                }
                            }
                            if(error) { return res.status(500).send({ error: error})}
                            return res.status(201).send(response);
                        }
                    )
                });
            }
        })      
    })
}); 

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        const query = `SELECT * FROM users WHERE email = ?`
        conn.query(query, [req.body.email], (error, results) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error }) }
            if(results.length < 1){
                res.status(401).send({ mensagem: 'Falha na autenticação' })
            }
            bcrypt.compare(req.body.password, results[0].password, (error, result) => {
                if(error){
                    return res.status(401).send({ mensagem: 'Falha na autenticação' });
                }
                if(result){
                    const token = jwt.sign({
                        id_user: results[0].userId,
                        email: results[0].email,
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });
                    return res.status(200).send({
                         mensagem: 'Autenticado com sucesso',
                         token: token
                    });
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' });
            });
        });
    });
});

module.exports = router;