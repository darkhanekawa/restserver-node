//==========================
// Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
// BD
//==========================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://strider:EgJGboNYBRhuMYiD@cluster0-ytu5a.mongodb.net/cafe'
}

process.env.URLDB = urlDB;