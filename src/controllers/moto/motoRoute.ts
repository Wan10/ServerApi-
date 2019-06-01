import * as express from 'express';
import { json } from "body-parser";
import { Moto } from '../../models/Moto';
import { ObjectId } from 'bson';

export const motoRoute = express();
const jsonParser = json();


motoRoute.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

motoRoute.get('/:idMoto', (req, res) => {
    const {idMoto} = req.params ;
    Moto.getMotoInfoWithIdMoto(idMoto)
    .then( response => res.status(200).json(response))
    .catch( err => res.status(400).send({message: err.message}))
    
});