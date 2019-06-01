import * as express from 'express';
import { json } from 'body-parser';
import { Driver } from '../../models/Driver';
import { Moto } from '../../models/Moto';
import { hash } from 'bcrypt';
import { ObjectId } from 'bson';
//Create User Routes
export const driverRoute = express();
const jsonParser = json();

interface SignUpInfo {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    birth: Date;
    tel: string;
    address: string;
    status: string;
    aboutMe: string;
    image: string;
    numPlate: string;
    color: string;
    motoMaker: string;
    type: string;
    description: string;
}

interface SignInInfo {
    email: string;
    password: string
}

const checkTokenMiddleware = async (req, res, next) => {
    const { token } = req.body;
    try {
        await Driver.checkToken(token);
        next();
    } catch (error) {
        res.status(404).send({message: 'Token is invalid'})
    }
}

driverRoute.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


driverRoute.get('/', (req, res) => {
    Driver.getAllDriver()
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => res.status(404).send({message: err.message}));
});

driverRoute.post('/signup', jsonParser, async (req, res) => {
    const { 
        userName, email, password ,birth, tel, address ,status,
        image ,numPlate ,color ,motoMaker ,type ,description } = req.body as SignUpInfo;
    const objM = {
        moto: {
            image: image,
            numPlate: numPlate,
            color: color,
            motoMaker: motoMaker,
            type: type,
            description: description
        }
    }
    const encrypted = await hash(password, 8);
    const objD = {
        driver: {
         userName: userName,
         birth: birth,
         email: email,
         firstName: '',
         lastName: '',
         password: encrypted,
         tel: tel,
         address: address,
         role: 'driver',
         idMoto: await Moto.createMotoInfo(objM),
         status: status,
         aboutMe: ''
        }
     } 
    Driver.signUp(objD)
    .then( response => res.send(response))
    .catch( error => res.status(400).send({message: error.message}));
});

driverRoute.post('/signin', jsonParser, (req, res) => {
    const { email, password } = req.body as SignInInfo;
    Driver.signIn( email, password )
    .then( response => res.send(response))
    .catch( error => res.status(400).send({message: error.message}));
});

driverRoute.get('/veirfy/:idDriver/:verifyCode', (req, res) => {
    const { idDriver, verifyCode } = req.params;
    Driver.verifyDriver(idDriver, verifyCode)
    .then(() => res.send({message: 'verified'}))
    .catch(err => res.status(404).send({message: err.message}))
});

driverRoute.post('/adminchangeinfo', jsonParser, async (req, res) => {
    const {
        idDriver, userName, email, firstName, lastName, birth, tel, address, aboutMe,
        idMoto ,image ,numPlate ,color ,motoMaker ,type ,description
    } = req.body ;

    const objM = {
        moto: {
            image: image,
            numPlate: numPlate,
            color: color,
            motoMaker: motoMaker,
            type: type,
            description: description
        }
    }
    const objD = {
        driver: {
         userName: userName,
         birth: birth,
         email: email,
         firstName: firstName, 
         lastName: lastName,
         tel: tel,
         address: address,
         aboutMe: aboutMe
        }
    } 
    Driver.adminChangeInfo(idDriver, objD)
    .then(driver => {
        res.send(driver)
        Moto.changeMotoInfo(idMoto, objM)
        // .then(moto => res.send(moto))
        // .catch(err => res.status(404).send({message: err.message}))
    })
    .catch(err => res.status(404).send({message: err.message}))
});

driverRoute.post('/changeinfo', jsonParser, checkTokenMiddleware, async (req, res) => {
    const {
        idDriver, userName, email, firstName, lastName, birth, tel, address, aboutMe,
        idMoto ,image ,numPlate ,color ,motoMaker ,type ,description
    } = req.body ;

    const objM = {
        moto: {
            image: image,
            numPlate: numPlate,
            color: color,
            motoMaker: motoMaker,
            type: type,
            description: description
        }
    }
    const objD = {
        driver: {
         userName: userName,
         birth: birth,
         email: email,
         firstName: firstName, 
         lastName: lastName,
         tel: tel,
         address: address,
         aboutMe: aboutMe,
         idMoto: await Moto.changeMotoInfo(idMoto, objM),
        }
    } 

    Driver.changeInfo(idDriver, objD)
    .then(driver => res.send(driver))
    .catch(err => res.status(404).send({message: err.message}))
});


driverRoute.post('/changepassword', jsonParser, checkTokenMiddleware, (req,res) => {
    const {idUser, oldPass, newPass} = req.body;
    Driver.changePassword(idUser, oldPass, newPass)
    .then(user => res.send(user))
    .catch(err => res.status(404).send({message: err.message}))
});


/* 
    * sign up & in      pass
    * verify 
    * change info       pass
    * change password   
    * restore password
    * request forget password
*/
