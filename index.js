const express = require('express');
const mongoose = require('mongoose');
const ModelImagen = require('./image');
const fileUpload = require('express-fileupload');

const app = express ();

app.use(fileUpload({
    limits: {filesize: 50 * 1024 * 1024},
}));

app.get('/imagen/:id',(req, res) => {
    let id = req.params.id;
    ModelImagen.findById(id).exec((err,rpta)=>{
        if(err){
            res.json({
                err:err
            });
        }
        res.set('Content-Type', rpta.imagen.contentType);
        return res.send(rpta.imagen.data);
        })
})

app.post('/uploadmongo', (req, res) =>{
    let imagen = req.files.variable;

    let data = {
        producto_nombre: 'prueba nombre'
    }

 let modelImagen = new ModelImagen(data);
 console.log(imagen);

 modelImagen.imagen.data = req.files.variable.data;
 modelImagen.imagen.contentType = req.files.variable.mimetype;

 modelImagen.save((err,rpta)=>{
     if(err){
         res.json({
             err: err
         })
     }
     res.json({
         result: imagen
     })
 })
});


mongoose.connect('mongodb://localhost/upload',{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{   
    console.log("mongo OK");
});

app.listen(3000, () => {
    console.log("Servidor levantado");
});