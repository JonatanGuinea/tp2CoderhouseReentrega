import { Router } from 'express';
import passport from 'passport';
import initAuthStrategies from '../auth/passport.config.js'

<<<<<<< HEAD
import UserController from "../Dao/controllers/usersManager.js"
import { createToken } from '../utils.js';

=======
import { uploader } from '../uploader.js';
import UserManager from '../dao/users.manager.js';
import initAuthStrategies from '../auth/passport.config.js';
import { verifySession, createToken, verifyToken, passportCall, handlePolicies } from '../utils.js';
>>>>>>> 0c0a70991c584da988a81dcf0fae33e934e6a585

import config from '../config.js';


const router = Router();
const manager = new UserManager();
initAuthStrategies();

<<<<<<< HEAD
const um = new UserController();
initAuthStrategies()
=======
/**
 * Middleware para verificación de formato de ids
 * 
 * Express nos brinda el método param, podemos indicar el nombre (id en este caso)
 * y el middleware será inyectado automáticamente en cualquier endpoint donde se
 * encuentre este parámetro. De esa forma evitamos repetir controles de formato en
 * distintos endpoints
 */
router.param('id', async (req, res, next, id) => {
    // Aprovechamos la expresión regular MONGODB_ID_REGEX,
    // para ver si el id que llega por req.params contiene ese formato
    if (!config.MONGODB_ID_REGEX.test(req.params.id)) return res.status(400).send({ error: 'Id no válido', data: [] });
    next();
})
>>>>>>> 0c0a70991c584da988a81dcf0fae33e934e6a585

router.get('/', async (req, res) => {
    try {
        const data = await manager.get();
        res.status(200).send({ error: null, data: data });
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

<<<<<<< HEAD
router.post('/pplogin', passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.session.userData = req.user;
=======
// router.post('/', verifySession, uploader.array('thumbnail', 3), (req, res) => { // gestión de múltiples archivos
router.post('/', verifySession, uploader.single('thumbnail'), async (req, res) => { // gestión de archivo único
    try {
        const { name, age, email } = req.body;

        if (name != '' && age != '' && email != '') {
            const data = { name: name, age: +age, email: email };
            const process = await manager.add(data);
            res.status(200).send({ error: null, data: process });
        } else {
            res.status(400).send({ error: 'Faltan campos obligatorios', data: [] });
        }
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

/**
 * Como estamos utilizando el nombre id para el parámetro, Express ejecutará automáticamente
 * el middleware definido arriba en el router.param, solo si el formato es válido, pasará a verifySession().
 */
router.patch('/:id?', verifySession, async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id) {
            res.status(400).send({ error: 'Se requiere parámetro id', data: null });
        } else {
            const { name, age, email } = req.body;
            const filter = { _id: id };
            const update = {};
            if (name) update.name = name;
            if (age) update.age = +age;
            if (email) update.email = email;
            const options = { new: true }; // new: true retorna el documento actualizado
            
            const process = await manager.update(filter, update, options);
            if (!process) {
                res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
            } else {
                res.status(200).send({ error: null, data: process });
            }
        }
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

/**
 * Para borrar datos de un usuario, no alcanza con estar autenticado (verifyToken),
 * también debo ser admin (handlePolicies).
 */
router.delete('/:id?', verifyToken, handlePolicies(['ADMIN']), async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!id) {
            res.status(400).send({ error: 'Se requiere parámetro id', data: null });
        } else {
            const filter = { _id: id };
            const options = {};
            
            const process = await manager.delete(filter, options);
            if (!process) {
                res.status(404).send({ error: 'No se encuentra el usuario', data: [] });
            } else {
                res.status(200).send({ error: null, data: process });
            }
        }
    } catch (err) {
        res.status(500).send({ error: 'Error interno de ejecución del servidor', data: [] });
    }
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, username, password } = req.body;

    if (first_name != '' && last_name != '' && username != '' && password != '') {
        const process = await manager.register({ first_name: first_name, last_name: last_name, email: username, password: password });

        if (process) {
            res.status(200).send({ error: null, data: 'Usuario registrado, bienvenido!' });
        } else {
            res.status(401).send({ error: 'Ya existe un usuario con ese email', data: [] });
        }
    } else {
        res.status(400).send({ error: 'Faltan campos: obligatorios first_name, last_name, email, password', data: [] });
    }
});

// Login manual contra nuestra base de datos, utilizando sessions
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (username != '' && password != '') {
        const process = await manager.authenticate(username, password);
        if (process) {
            req.session.userData = { first_name: process.first_name, last_name: process.last_name, email: process.email, admin: true };

            req.session.save(err => {
                if (err) return res.status(500).send({ error: 'Error al almacenar datos de sesión', data: [] });

                // res.status(200).send({ error: null, data: 'Usuario autenticado, sesión iniciada!' });
                res.redirect('/views/profile');
            });
        } else {
            res.status(401).send({ error: 'Usuario o clave no válidos', data: [] });
        }
    } else {
        res.status(400).send({ error: 'Faltan campos: obligatorios username, password', data: [] });
    }
});

// Login con passport, utilizando sessions
// router.post('/pplogin', passport.authenticate('login', { failureRedirect: '/views/login' }), async (req, res) => {
// En este caso, utilizamos el middleware passportCall en lugar de llamar directamente al passport.authenticate
// (ver passportCall en utils.js).
router.post('/pplogin', passportCall('login'), async (req, res) => {
>>>>>>> 0c0a70991c584da988a81dcf0fae33e934e6a585
    req.session.save(err => {
        if (err) {
            return res.status(500).send({ error: 'Error al almacenar la sesión', data: [] });
        }
        res.redirect('/');
    });
});

<<<<<<< HEAD


router.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user:email'] }), async (req, res) => {});


router.get('/ghcallback', passport.authenticate('ghlogin', { failureRedirect: '/' }), async (req, res) => {
    try {
        console.log("Usuario autenticado con GitHub:", req.user);
        req.session.userData = req.user;
        res.redirect('/');
    } catch (err) {
        console.error("Error en GitHub Callback:", err);
        res.status(500).send({ error: "Error al procesar el inicio de sesión con GitHub", data: [] });
    }
});




router.post('jwtlogin', async(req, res)=>{
    const {email, password}=req.body;

    if(email!='' && password !=''){
        const process = await um.authenticate(email, password);

        if(process){
            const payload= {email, admin:true};
            const token = createToken(payload, '1h')

            res.status(200).send({error: null, data:{autentication: 'ok', token: token}})
        }else {
            res.status(401).send({error:'Usuario o clave no válidos JWT', data:[]})
        }
    }else{
        res.status(400).send({error:'Faltan campos obligatorios , email y password', data:[]})
    }
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            return res.status(500).send({ error: "Error al cerrar sesión", data: [] });
        }
        res.status(200).send({ error: null, data: "Sesión cerrada" });
=======
// Login con passport, a través de proveedor externo (Github)
// Habilitamos 2 endpoints pq uno redirecciona al proveedor (ghlogin) y el otro vuelve con el resultado (githubcallback)
router.get('/ghlogin', passport.authenticate('ghlogin', { scope: ['user:email'] }), async (req, res) => {});

router.get('/ghcallback', passport.authenticate('ghlogin', { failureRedirect: '/views/login' }), async (req, res) => {
    req.session.save(err => {
        if (err) return res.status(500).send({ error: 'Error al almacenar datos de sesión', data: [] });

        // res.status(200).send({ error: null, data: 'Usuario autenticado, sesión iniciada!' });
        res.redirect('/views/profile');
>>>>>>> 0c0a70991c584da988a81dcf0fae33e934e6a585
    });
});

// Login manual contra nuestra base de datos, utilizando tokens (JWT = JSON Web Tokens)
router.post('/jwtlogin', async (req, res) => {
    const { username, password } = req.body;

    if (username != '' && password != '') {
        const process = await manager.authenticate(username, password);
        if (process) {
            const payload = { username: username, first_name: process.first_name, last_name: process.last_name, role: process.role };
            const token = createToken(payload, '1h');
            // res.status(200).send({ error: null, data: { authentication: 'ok', token: token } });
            
            /**
             * En lugar de retornar el token en la respuesta, utilizamos el mecanismo de cookies
             * para que el navegador almacene el token automáticamente (res.cookie), y lo adjunte en sucesivas
             * solicitudes:
             * 
             * si usamos signed: true, estará disponible en req.signedCookies, sino en req.cookies.
             * 
             * secure: true, solo acepta transacciones de cookies por HTTPS
             * no habilitar si se prueba la API por HTTP, porque obviamente no se transmitirán las cookies
             */
            res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, secure: false, httpOnly: true, signed: true });
            res.status(200).send({ error: null, data: { authentication: 'ok via cookie' } });
        } else {
            res.status(401).send({ error: 'Usuario o clave no válidos', data: [] });
        }
    } else {
        res.status(400).send({ error: 'Faltan campos: obligatorios username, password', data: [] });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ error: 'Error al cerrar sesión', data: [] });
        
        // res.status(200).send({ error: null, data: 'Sesión cerrada' });
        res.redirect('/views/login');
    });
});

// Endpoint protegido por middleware propio (verifySession desde utils.js)
router.get('/private', verifySession, (req, res) => {
    res.status(200).send({ error: null, data: 'Este contenido solo es visible por usuarios autenticados' });
});

/**
 * Endpoint protegido por token y policies
 * 
 * Similar al método delete de más arriba, aquí tenemos un doble control;
 * primero la autenticación para identificar al usuario (verifyToken), y luego
 * el chequeo de rol. Solo los usuarios con rol ADMIN o PREMIUM podrán acceder
 * a la respuesta de este endpoint.
 */
router.get('/private2', verifyToken, handlePolicies(['ADMIN', 'PREMIUM']), (req, res) => {
    res.status(200).send({ error: null, data: 'Este contenido solo es visible por usuarios autenticados' });
});

/**
 * Endpoint de tipo CATCHALL
 * 
 * Se coloca al final, router.all() indica que es válido para CUALQUIER TIPO de solicitud.
 * 
 * Todo request que no encuadre en ninguno de los endpoints definidos previamente, será "capturado"
 * por este endpoint y recibirá un mensaje de error formateado a nuestro gusto.
 * Por supuesto, se podría también redireccionar por ejemplo a una plantilla con mensaje visual.
 */
router.all('*', async () => {
    res.status(404).send({ error: 'No se encuentra la ruta especificada', data: [] });
})



export default router;
