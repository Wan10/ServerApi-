import * as assert from 'assert';
import { Driver } from '../../src/models/Driver';
import { Moto } from '../../src/models/Moto';
import { ObjDriver } from '../../src/types/ObjDriver';
import { ObjectId } from 'bson';


describe('Test Driver model',() => {
    let idDriver: ObjectId, idMoto, email: string, token;
    
    beforeEach('Sign up for test Change info Driver', async() => {
        const objM = {
            moto: { 
                image: 'moto.jpg',
                numPlate: '49g148832',
                color: 'black',
                motoMaker: 'honda',
                type: 'scooter',
                description: 'hahaa'
            }
        }

        idMoto = await Moto.createMotoInfo(objM);

        const objD = {
           driver: {
            userName: 'wank',
            birth: new Date(),
            email: 'wan@gmail.com',
            firstName: 'wan',
            lastName: 'william',
            password: '123456',
            tel: '1234567895',
            address: '38/5 Be Van Cam, Quan 7',
            role: 'driver',
            idMoto: idMoto,
            status: 'online',
            aboutMe: ''
           }
        } 
        
       const driver = await Driver.signUp(objD);
       email = driver.objD.driver.email;
       token = driver.token;
    });

    it('Can change info Driver models', async() => {
        const driver = await Driver.findOne({email});
        idDriver = driver._id;
        
        const body = {
            driver: {
                userName: 'wank2',
                birth: new Date('1998-06-02'),
                email: 'wan2@gmail.com',
                tel: '1234567895',
                address: '38/5 Be Van Cam, Quan 7',
                idMoto: idMoto
            }
        }
        const response = await Driver.changeInfo(idDriver, body);
        const driver2 = await Driver.findById(response) as Driver;
        // console.log(driver2);
        assert.equal('wank2', driver2.userName);
    });
});