import *as express from 'express';
import { api } from '../src/routes/api/api';

export const app = express();


app.use('/api', api);
