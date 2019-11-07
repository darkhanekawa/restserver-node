const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middleware/authentication');
const _ = require('underscore');
 
const app = express();
const Categoria = require('../models/categoria');

//==============================
// Mostrar todas las categorias
//==============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    //puede haber mas de un populate escritos uno abajo del otro
    .exec( (err, categorias) =>{
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categorias
        });
    })
});

//==============================
// Mostrar una categoria por ID
//==============================
app.get('/categoria/:id', verificaToken, (req, res) => {
   
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

//==============================
// Crear nueva categoria
//==============================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

//==============================
//Actualizar la categoria
//==============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

//==============================
// Eliminar una categoria
//==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo el admin puede borrarlo
    
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaBorrada){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada',
            //categoria: CategoriaBorrada
        });
    });

});

module.exports = app;