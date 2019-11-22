require('./config/config');

const express = require('express');
const app = express();
//Me permite obtener los parametros que se envien en
//el POSTMAN desde los campos del body
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
//use: indica que son midelwares, indica que cada vez que 
//se pase por esta linea se va a ejecutar esa funcion
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

/*
app.get('/', function(req, res) {
    //send: indica que lo que se manda es HTML
    //res.send('Hello World')

    //json: define que lo que se va a enviar es un JSON
    res.json('Hola mundo')
});
*/
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    //res.json('post Usuario');
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }
});
//put: Se usa para actulizar data
//app.put('/usuario', function(req, res) {
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id
        //res.json('put Usuario')
    res.json({
        id: id
    });
});
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

//app.listen(3000, () => {
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto: 3000`);
})