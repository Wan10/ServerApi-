import * as assert from 'assert'
import { Moto } from '../../src/models/Moto';
import * as request from 'supertest';
import { app } from '../../src/app';

describe('Test moto controller', () => {
    it('Can get moto infor', async() => {
        const idMoto = '5ce374f192ad14351ca86e6f';
        await request(app).post('/api/moto').send(idMoto);
        const moto = await Moto.findOne({}) as Moto;
        assert.equal('Gold', moto.color);
    });
});