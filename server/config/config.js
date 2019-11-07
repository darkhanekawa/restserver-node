//==========================
// Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;

//==========================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================
//Vencimiento del token
//==========================

process.env.CADUCIDAD_TOKEN = 60 * 60 *24 * 30; 

//==========================
// Seed de autenticacion
//==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==========================
// BD
//==========================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==========================
// Google client ID
//==========================
 process.env.CLIENT_ID = process.env.CLIENT_ID || '963344539621-39ifrq00jp7qd7el1kmsmi6cc5gmqua4.apps.googleusercontent.com';
