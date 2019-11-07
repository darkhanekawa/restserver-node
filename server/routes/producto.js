const express = require('express');
const { verificaToken } = require('../middleware/authentication');

const app = express();
const Producto = require('../models/producto');

//===========================
//Obtener todos los productos
//===========================
app.get('/producto', verificaToken, (req, res) => {
    //populate usuario y categoria
    //paginacion
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Producto.find({disponible: true})
    .skip(desde)
    .limit(hasta)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec( (err, productos) =>{
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        Producto.count({disponible: true}, (err, conteo) =>{
            
            res.json({
                ok: true,
                productos,
                cuantos: conteo
            });
        })

    })

});

//===========================
//Obtener un producto
//===========================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate usuario y categoria
    let id = req.params.id;
    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec( (err, productoDB) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })

});

//===========================
//Buscador
//===========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino =req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex, disponible: true})
    .populate('categoria', 'descripcion')
    .exec( (err, productos) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });


    })

});

//===========================
//Crear un producto
//===========================
app.post('/producto/', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar la categoria del sistema
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        desponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });


    });

});

//===========================
//Actualizar un producto
//===========================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })

});

//===========================
//Eliminar un producto
//===========================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let change = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, change, {new: true}, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(!productoBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado,
            mensaje: 'producto borrado'
        });
    });
    
});

module.exports = app;