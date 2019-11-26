const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function(req, res) {
    //res.json('get Usuario');

    //La variable "desde" se pasa como parametro en la petición del POSTMAN
    //req.query.desde: Me permite obtener el parametro que paso en la URL desde le POSTMAN
    //URL: {{url}}/usuario?desde=3
    let desde = req.query.desde || 0;
    desde = Number(desde);

    //{{url}}/usuario?limite=10
    //Si quisiera una consulta total incluyendo el "desde" y el "limite"
    //{{url}}/usuario?limite=10&desde=10
    let limite = req.query.limite || 5;
    limite = Number(limite);



    //Hacer get de la BD
    //Usuario.find({})
    //Si quiero pasar alguna condición en la petición, como por Ej seleccionar solo los usuarios que sean de "google", (clase "101")
    //Usuario.find({google:true})
    //Si quiero hacer un filtrado de cuales campos quiero recibir en el JSON (clase "102")
    //Usuario.find({}, 'nombre email role estado google img')
    //Si quiero hacer un filtro de los usuarios que tengan solo "estado= true"
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        //Salta los primeros 5 registros, luego muestra los siguientes 5 y ejecuta el query
        //.skip(5)
        .skip(desde)
        //Limite de la cantidad a consular de usuarios
        //.limit(5)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //Conteop de registros
            //Usuario.count({google:true}, (err, conteo) => {
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cuantos: conteo
                });
            });
        })
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        //password: body.password,
        //hashSync: indica que la encriptación es de tipo has
        //numeroSaltos: es numero de encriptaciones que se le hará a la variable, el valor 10 es lo normal
        //hashSync(variable, numeroSaltos)
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img
        role: body.role,
    });

    //Guardando en la base de datos, el save es una palabra reservada de mongoose
    usuario.save((err, usuarioDB) => {

        /*
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
        */


        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });


});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id

    // res.json({
    //     id: id
    // });

    //let body = req.body;


    //Usando libreria underscore, la variable underscore se defincio como "_"
    //pick es una propiedad de la librería "underscore"
    //Esta librería me permite hacer una actualización del usuario, a excepción de
    //las propiedades que no esten dentro del arreglo, como es el caso de las variables
    //de "password" y "google" ya que esas no deseo actualizarlas
    let body = _pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    // //Forma 1
    // Usuario.findById( id, (err, usuarioBD) => {
    //     usuarioBD.save
    // })

    //Forma 2
    //el objeto "{ new: true }" permite hacerme el retorno automatico del usuario ya actualizado, hace la actualización en la BD y retorna el usuario 
    //runValidators: Ejecuta todas las validaciones definidas en el modelo de usuario
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    });


});
//app.delete('/usuario', function(req, res) {
app.delete('/usuario/:id', function(req, res) {
    //res.json('delete Usuario');
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //if (usuarioBorrado === null) {
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });


});

module.exports = app;