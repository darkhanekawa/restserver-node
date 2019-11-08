
const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

const app = express();
//default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res){
    let id = req.params.id;
    let tipo = req.params.tipo;
    if(!req.files){
        return res.status(400)
        .json({
        ok: false,
            err: {
            message: 'No se ha seleccionado nungun archivo'
            }
        });

    }

    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
    
            }
        });
    }

    // The name of the input field (i.e. "sampleFile") 
    //is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreSeparado = archivo.name.split('.');
    let extenciones = nombreSeparado[nombreSeparado.length - 1];

    //Extenciones permitidas
    let extencionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'JPG', 'JPEG', 'GIF', 'PNG'];

    if(extencionesValidas.indexOf(extenciones) < 0){
        //console.log(extenciones);
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son ' + extencionesValidas.join(', '),
                ext: extenciones 
            }
        });
    }

    //cambiar nombre de la imagen
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extenciones}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(tipo === 'usuarios'){

            imagenUsuario(id, res, nombreArchivo);
         
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
        
    });

});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {
        if(err){
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) =>{
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })
    });
}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, productoDB) => {
        if(err){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) =>{
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    });
}

function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}

module.exports = app;