const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('<h2>It is working!</h2>')
});

server.get('/accounts', (req, res) => {
    db('accounts')
        .then(accounts => {
            console.log(accounts)
            res.status(200).json(accounts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "error getting accounts"})
        })
})

server.get('/accounts/:id', (req, res) => {
    const { id } = req.params;
    db('accounts')
        .where({ id }) // always returns an array
        .first() // picks the first element of the resulting array
        .then(account => {
            res.status(200).json(account);
        }).catch(err => {
            console.log(err)
            res.status(500).json({error: "error getting the account with the id"})
        });
});

server.post('/accounts', (req, res) => {
    const postAccount = req.body;

    db('accounts')
        .insert(postAccount, 'id')
        .then(([id]) => {
            db('accounts')
                .where({id})
                .first()
                .then(account => {
                    res.status(200).json(account)
                })
             //res.status(200).json(id);
        }).catch(err => {
            console.log(err)
            res.status(500).json({error: "error adding the account"})
        });
});

server.put('/accounts/:id', (req, res) => {
    const changes = req.body;
    db('accounts')
        .where('id', req.params.id)
        .update(changes)
        .then(count => {
            res.status(200).json({message: `updated ${count} account`})
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: "error updating the account"})
        });
});

server.delete('/accounts/:id', (req, res) => {
    db('accounts')
        .where({id: req.params.id})
        .del()
        .then(count => {
            res.status(200).json({message: `deleted ${count} record`})
        })
        .catch(err => {
            res.json(err)
        });
});

module.exports = server;