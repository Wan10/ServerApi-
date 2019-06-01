import * as express from 'express';
import { Moto } from '../../models/Moto';
import { Driver } from '../../models/Driver';
import { User } from '../../models/User';
import { json } from 'body-parser';

export const adminRoute = express();
const jsonParser = json();


adminRoute.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

adminRoute.get('/admindeluser/:idUser', (req, res) => {
    const { idUser } = req.params;
    User.delUser(idUser)
    .then(() => res.send({message: "Delete user success!!"}))
    .catch(err => res.status(404).send({message: err.message}));
});

adminRoute.post('/admindel', jsonParser, (req, res) => {
    const {idDriver, idMoto} = req.body;
    Driver.deleteDriver(idDriver)
    .then(() => {
        res.send({message: 'Delete driver success!!'});
        Moto.deleteMoto(idMoto)
        .then(() => res.send({message: 'Delete Moto success!!'}))
        .catch(err => res.send({message: err.message}))
    })
    .catch(err => res.send({message: err.message}))
});

adminRoute.post('/adminchangeinforuser', jsonParser, (req, res) => {
    const { objUser } = req.body;
    User.adminChangeInfo(objUser)
        .then(user => res.send(user))
        .catch(err => res.status(404).send({ message: err.message }))
});

adminRoute.post('/signin', jsonParser, (req, res) => {
    const { email, password } = req.body;
    User.adminSignIn(email, password)
        .then(response => res.send(response))
        .catch(error => 
            {console.log(error.message);
            res.status(404).send(error.message);
        }
        );
});