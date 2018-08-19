  const Clarifai = require('clarifai');


  
  const app = new Clarifai.App({
    apiKey: '2b4e2305fa4c40b0b6fecac993dbc118'
   });

   const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    }).catch(err => {res.status(400).json('unable to work with api')
    console.log(err);
    })

   }

const handleImage = (req,res,db) => {
    let found = false;
    const { id } = req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
 handleImage,
 handleApiCall
}