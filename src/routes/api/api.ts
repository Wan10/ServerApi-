import * as express from 'express';
import { userRoute } from '../../controllers/user/userRoute';
import { driverRoute } from '../../controllers/driver/driverRoute';
import { motoRoute } from '../../controllers/moto/motoRoute';
import { adminRoute } from '../../controllers/admin/adminRoute';

export const api = express();


api.use('/user', userRoute);
api.use('/driver', driverRoute);
api.use('/moto', motoRoute);
api.use('/admin', adminRoute);
