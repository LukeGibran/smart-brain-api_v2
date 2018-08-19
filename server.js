const express = require('express');
const bodyP = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const image = require('./controllers/image');

const db = knex ({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true
    }
  });




const app = express();

app.use(bodyP.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('it is working');
})

app.post('/signin', (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json('incorrect form submission');
    }
 db.select('email', 'hash').from('login').where('email', '=',email)
 .then(data =>{
    const isValid = bcrypt.compareSync(password, data[0].hash);

    if(isValid){
       return db.select('*').from('users').where('email', '=', email)
        .then(user => {
            res.json(user[0])
        }).catch(err => res.status(400).json('unable to get user'))
    } else{
        res.status(400).json('wrong information')
    }
}).catch(err => res.status(400).json('wrong information'))
    
})

app.post('/register', (req,res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id',(req,res) => {
    const {id} = req.params;
   db.select('*').from('users').where({
       id: id
   }).then(user => {
       if(user.length){
        res.json(user[0]);
       } else{
           res.status(400).json('not found')
       }
   }).catch(err => res.status(400).json('error getting user'))
})

app.put('/image',(req,res) => {image.handleImage(req, res,db)})
app.post('/imageUrl',(req,res) => {image.handleApiCall(req, res)})


// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT}`);
})