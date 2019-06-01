import * as express from 'express';
import { json } from 'body-parser';
import { User } from '../../models/User';
import { hash } from 'bcrypt';
const randomString = require('random-string');

//Create User Routes
export const userRoute = express();
const jsonParser = json();

interface SignUpInfo {
    userName: string;
    email: string;
    password: string;
    tel: string;
    address: string;
    role: string;
    birth: Date;
    firstName: string;
    lastName: string;
    aboutMe: string;
}

interface SignInInfo {
    email: string;
    password: string
}

// userRoute.get('/signin', (req, res) => res.send('user signin'));
// userRoute.post('/signin', (req, res) => res.send('post signin'));


const checkTokenMiddleware = async (req, res, next) => {
    const { token } = req.body;
    try {
        await User.checkToken(token);
        next();
    } catch (error) {
        res.status(404).send({ message: 'Token is invalid' })
    }
}

userRoute.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


userRoute.get('/', (req, res) => {
    User.getAllUser()
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => res.status(404).send({ message: err.message }));
});
userRoute.get('/:idUser', (req, res) => {
    const { idUser } = req.params
    User.findById(idUser)
        .then(response => res.status(200).json(response))
        .catch(err => res.status(404).send({ message: err.message }));
});
userRoute.post('/', (req, res) => {
    User.getAllUser()
        .then(response => res.send(response))
        .catch(err => res.status(404).send({ message: err.message }));
});

userRoute.post('/signup', jsonParser, async (req, res) => {
    const { userName, email, password, tel } = req.body as SignUpInfo;

    const encrypted = await hash(password, 8);
    const objUser = {
        userName: userName,
        email: email,
        password: encrypted,
        tel: tel,
        address: '',
        role: 'member',
        verifyCode: randomString(),
        firstName: '',
        lastName: '',
        birth: '',
        aboutMe: ''
    }

    User.create()
    User.signUp(objUser)
        .then(response => res.send(response))
        .catch(error => res.status(400).send({ message: error.message }));
});

userRoute.post('/signin', jsonParser, (req, res) => {
    const { email, password } = req.body as SignInInfo;
    User.signIn(email, password)
        .then(response => res.send(response))
        .catch(error => res.status(400).send({ message: error.message }));
});

userRoute.get('/verify/:idUser/:verifyCode', (req, res) => {
    const { idUser, verifyCode } = req.params;
    User.verifyUser(idUser, verifyCode)
        .then(() => res.send({ message: 'verified' }))
        .catch(err => res.status(400).send({ message: err.message }))
});

userRoute.post('/changeinfo', jsonParser, checkTokenMiddleware, (req, res) => {
    const { idUser, newUserName, newEmail, newTel, newAddress } = req.body;
    User.changeInfo(idUser, newUserName, newEmail, newTel, newAddress)
        .then(user => res.send(user))
        .catch(err => res.status(404).send({ message: err.message }))
});

userRoute.post('/changepassword', jsonParser, checkTokenMiddleware, (req, res) => {
    const { idUser, oldPass, newPass } = req.body;
    User.changePassword(idUser, oldPass, newPass)
        .then(user => res.send(user))
        .catch(err => res.status(404).send({ message: err.message }))
});

userRoute.post('/requestfogetpassword', jsonParser, (req, res) => {
    const { email } = req.body;
    User.requestChangePassword(email)
        .then(() => res.send({ message: 'Send request success' }))
        .catch(err => res.status(404).send({ message: err.message }));
});

userRoute.get('/restoespassword/:email/:code', (req, res) => {
    const { email, code } = req.params;
    User.checkRestorePasswordCode(email, code)
        .then(code => res.send({ message: 'Code is invalid', code }))
        .catch(() => res.status(404).send({ message: 'Code is invalid' }))
});

userRoute.post('/restorepassword', jsonParser, (req, res) => {
    const { email, newPass, code } = req.body;
    User.changePasswordWhenForget(email, code, newPass)
        .then(() => res.send({ message: 'Password changed' }))
        .catch(err => res.status(404).send({ message: err.message }));
})



/*
    * sign up & in
    * verify
    * change info
    * change password
    * restore password
    * request forget password
*/