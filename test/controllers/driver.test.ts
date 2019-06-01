import * as assert from 'assert';
import { Driver } from '../../src/models/Driver';
import * as request from 'supertest';
import { app } from '../../src/app';
import { ObjectId } from 'bson';
import { compare } from 'bcrypt';
import { Moto } from '../../src/models/Moto';

describe('Test driver sign up controller', () => {
    it('Can sign up driver', async() => {
        const body = {
            userName: 'wank',
            birth: new Date("1998-01-20"),
            email: 'wan@gmail.com',
            firstName: 'wank',
            lastName: 'william',
            password: '123456',
            tel: '1234567894',
            address: '38/5 Be Van Cam, Quan 7',
            content: 'kakaka',
            image: 'moto.jpg',
            numPlate: '49g148832',
            color: 'black',
            motoMaker: 'honda',
            type: 'scooter',
            description: 'hahaa',
        }
        await request(app).post('/api/driver/signup').send(body);
        const driver = await Driver.findOne({}) as Driver;
        assert.equal('wank', driver.userName);
    });
});

describe('Test driver sign in controller', () => {
    let idDriver, userName;
    beforeEach('Sign up for test',async() => {
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
        const idMoto = await Moto.createMotoInfo(objM);
        const objD = {
           driver: {
            userName: 'wank',
            birth: new Date(),
            email: 'wan@gmail.com',
            firstName: 'wank',
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
        userName = driver.objD.driver.userName;
    });

    it('Can sign in driver', async() => {
        const body = {
            email: 'wan@gmail.com',
            password: '123456'
        }
        await request(app).post('/api/driver/signin').send(body);
        const driver = await Driver.findOne({userName}) as Driver;
        assert.equal('wank', driver.userName);
    });
});

describe('Test change info driver', () => {
    let idDriver: ObjectId, idMoto: ObjectId, email: string, token;
    beforeEach('SignUp for test', async () =>{
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
            firstName: 'wank',
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
    })

    it('Can change info driver', async() =>{
        const driver = await Driver.findOne({email}) as Driver;
        idDriver = driver._id;
        const body = {
            token: token,
            idDriver: idDriver,
            userName: 'wank2',
            birth: new Date('1998-06-02'),
            email: 'wan2@gmail.com',
            tel: '1234567895',
            address: '38/5 Be Van Cam, Quan 7',
            idMoto: idMoto,
            image: 'moto2.jpg',
            numPlate: '49g148832',
            color: 'black2',
            motoMaker: 'honda2',
            type: 'scooter2',
            description: 'hahaa',
        }

        
        await request(app).post('/api/driver/changeinfo').send(body);
        const driver2 = await Driver.findById(idDriver) as Driver;
        const moto = await Moto.findById(idMoto) as Moto;
        // console.log(driver2);
        // console.log(moto);
        assert.equal('wank2', driver2.userName);
    });
});
