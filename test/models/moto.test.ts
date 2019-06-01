import * as assert from 'assert';
import { Moto } from '../../src/models/Moto';


describe('Test moto model', () => {
    it('Can create moto', async () => {
        const body = {
            moto: { 
                image: 'moto.jpg',
                numPlate: '49g148832',
                color: 'black',
                motoMaker: 'honda',
                type: 'scooter',
                description: 'hahaa'
            }
        }
        await Moto.createMotoInfo(body);
        const moto = await Moto.findOne({}) as Moto;

        // console.log(moto._id);

        assert.equal('49g148832', moto.numPlate);
    })

    it('Can get infor moto with idMoto', async () =>{
        const idMoto = '5ce374f192ad14351ca86e6f';

        const moto = await Moto.getMotoInfoWithIdMoto(idMoto) as Moto;
       
        console.log(moto);
    })
})

