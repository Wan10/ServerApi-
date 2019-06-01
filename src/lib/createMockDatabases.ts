import * as faker from 'faker';
import { Driver } from '../models/Driver';
import { User } from '../models/User';
import { Moto } from '../models/Moto';
import { hash } from 'bcrypt';

export async function startCreateMockDatabase() {
    const driverCount = await Driver.count({});
    const userCount = await User.count({});
    if (userCount > 10) return;
    // await create10Driver(); 
    await create10User();
}

async function create10Driver() {
    for (let i = 0; i < 10; i++) {
        const objM = {
            moto: {
                image: 'moto.jpg',
                numPlate: faker.random.alphaNumeric(9),
                color: faker.random.arrayElement(["Silver Metalic", "Black", "White", "Gold"]),
                motoMaker: faker.random.arrayElement(["Honda", "Yamaha", "SYM"]),
                type: faker.random.arrayElement(["scooter", "motorbike"]),
                description: faker.lorem.paragraph()
            }
        }

        let idMoto = await Moto.createMotoInfo(objM);

        const objD = {
            driver: {
                userName: faker.internet.userName(),
                birth: new Date('1998-06-02'),
                email: faker.internet.email(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                password: await hash('123456', 8),
                tel: faker.phone.phoneNumberFormat(0),
                address: faker.address.streetAddress(true),
                role: 'driver',
                idMoto: idMoto,
                status: 'offline',
                aboutMe: ''
            }
        }
        await Driver.signUp(objD);
    }
}

async function create10User() {
    for (let i = 0; i < 10; i++) {
        let birth = new Date('1998-01-20');
        let address = faker.address.streetAddress(true);
        // let location = await User.getLatLng(address);
        // console.log(location);
        const obj = {
            userName: faker.internet.userName(),
            email: faker.internet.email(),
            password: await hash('123456', 8),
            tel: faker.phone.phoneNumberFormat(0),
            address: address,
            // lat: location.lat,
            // lng: location.lng,
            role: 'member',
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            birth: birth,
            aboutMe: ''
        }

        const user = await User.signUp(obj);

    }
}
