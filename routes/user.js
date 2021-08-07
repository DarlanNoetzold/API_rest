const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error})}
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
        
    })

    
}); 

module.exports = router;