//////////////////////////////////////////////
//            CONFIGURANDO EL PUERTO        //
//////////////////////////////////////////////
process.env.PORT = process.env.PORT || 3000;
//////////////////////////////////////////////
//                  ENTORNO                 //
//////////////////////////////////////////////
//Para saber si estoy corriendo en producción o desarrollo
//Si "process.env.NODE_ENV" no existe, entonces estoy en desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//////////////////////////////////////////////
//               BASE DE DATOS              //
//////////////////////////////////////////////
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://crsa1899:15732069@cluster0-tvcf8.mongodb.net/cafe'
}

process.env.URLDB = urlDB;