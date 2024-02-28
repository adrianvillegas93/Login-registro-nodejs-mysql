//vamos a definir las constantes con cada modulo que hemos instalado

const express = require('express');
const { engine } = require('express-handlebars');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');

const loginRoutes = require('./routes/login');

const app = express();
app.set('port', 4000);//Aqui llamamos la funcion de express

//Aqui declaramos view, y colocamos dirname que es la ruta absoluta de nuestro proyecto
app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({
    extended: true 
}));
app.use(bodyParser.json());

//Ahora vamos a iniciar la conexion con mysql
app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'Poseidon_.123',
    port: '3306',
    database: 'nodelogin'
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))


app.listen(app.get('port'), () => {
    //Lo siguientes es para probar que nuestro proyecto se esta ejecutando correctamente
    console.log('Listening on port ', app.get('port'));
});

app.use('/', loginRoutes);

app.get('/', (req, res) => {
    if (req.session.loggedin == true) {
        
        res.render('home', { name: req.session.name } );
        
    } else {
        res.redirect('/login');
    }
    
});