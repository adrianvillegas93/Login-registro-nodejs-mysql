const bcrypt = require('bcrypt');

function login(req, res) {
    if (req.session.loggedin != true) {
        res.render('login/index');
        
    } else {
        res.redirect('/');
    }
}

//Creamos una nueva funcion que nos va a verficar la contraseña y nos va a iniciar sesion
function auth(req, res) {
    const data = req.body;
    // console.log(data);


    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM user WHERE email = ?', [data.email], (err, userdata) => {
            //Si se encuemtra un usuario que ya existe, entonces no te permitira crear dicho usuario
            if (userdata.length > 0) {
                //En caso de que el usuario si exista:
                // console.log('Hi there');

                //Se debe recorrer con un forEach:
                userdata.forEach(element => {
                    //Ahora se va a comparar la contraseña ingresada con la contraseña que se encuentra en la base de datos, en pocas palabras se va a verificar que las contraseñas coincidan
                bcrypt.compare(data.password, element.password, (err, isMatch) => {
                    //En caso de que coincidan nos va a devolver lo siguiente:
                    if (!isMatch) { //Si no coinciden las contraseñas
                        res.render('login/index', { error: 'Error: incorrect password !' });
                    } else { //Si si coinciden las constraseñas
                        // console.log('welcome');

                        //Ahora vamos a pasar por las sesiones
                        req.session.loggedin = true;//Con esto nos dice que se ha creado una sesion
                        //tambien le pasamos el nombre del usuario
                        req.session.name = element.name;

                        //Y por ultimo que nos redirija a la raiz
                        res.redirect('/');
                    }
                });
                });

            } else {
                res.render('login/index', { error: 'Error: user not exists !' });
            }

        });

    });

}


function register(req, res) {

    if (req.session.loggedin != true) {
        res.render('login/register');
        
    } else {
        res.redirect('/');
    }

    
}

//Ahora vamos a hacer la funcion de registrar
function storeUser(req, res) {
    const data = req.body; //Esto para que nos imrpima los datos del formulario

    //Ahora vamos a hacer una consulta que nos verifique que el usuario al crearlo ya exista, es decir que no deje crear otro usuario repetido
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM user WHERE email = ?', [data.email], (err, userdata) => {
            //Si no se encuentra un registro que coincida con el email que hemos introducido nos va a imprimir en la consola lo siguiente
            if (userdata.length > 0) {
                // console.log('user already created');
                res.render('login/register', { error: 'Error: user already exists !' });
            } else {
                //Lo siguiente va a servir para encriptar la constraseña
                bcrypt.hash(data.password, 12).then(hash => {
                    data.password = hash;
                    // console.log(data);

                    //Ahora vamos a hacer una consulta sql
                    req.getConnection((err, conn) => {
                        conn.query('INSERT INTO user SET ?', [data], (err, rows) => {
                            req.session.loggedin = true;
                            req.session.name = data.name;

                            res.redirect('/');
                        });
                    })
                })
            }
        });
    });


    // //Lo siguiente va a servir para encriptar la constraseña
    // bcrypt.hash(data.password, 12).then(hash => {
    //     data.password = hash;
    //     // console.log(data);

    //     //Ahora vamos a hacer una consulta sql
    //     req.getConnection((err, conn) => {
    //         conn.query('INSERT INTO user SET ?', [data], (err, rows) => {
    //             res.redirect('/');
    //         });
    //     })
    // })
}

//Ahora creamos una funcion para cerrar sesion
function logout(req, res) {
    if (req.session.loggedin == true) {

        req.session.destroy(); //Esto es para destruir la sesion

    }
    res.redirect('/login');
}


//Ahora exportamos los siguientes modulos:
module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout,
}