const express = require('express');
const cors = require('cors');
const db = require('./database/dbConfig.js');
const bcrypt = require('bcryptjs')


//POST to /api/register
//POST to /api/login
//GET to /api/users
const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Server is running properly');
});

server.get('/api/users', (req, res) => {
    db('users')
        .select('username','password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});//for testing purposes will be revamped

server.post('/api/register', (req,res) => {
    const creds = req.body;
    creds.password = bcrypt.hashSync(creds.password, 14)
    db('users').insert(creds)
    .then(userId => {
        res.status(201).json(userId);
    })
    .catch(err => {
        res.status(500).json({error : err})
    })
})

server.post('/api/login', (req, res) => {
    // grab username and password from body
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            //this checks if a user was present and compares the password entered with the password stored
            //in the database and only continues on if both are true
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).json({ message: 'You have passed the mighty security protocols!' });
            }else{
                res.status(401).json({ message: 'You shall not pass!' });
            }
        })
        .catch(err => res.json(err));
});

server.listen(9000, () => console.log('\nrunning on port 9000\n'));