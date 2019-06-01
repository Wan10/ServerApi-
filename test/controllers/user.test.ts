// import * as assert from 'assert';
// import { User } from '../../src/models/User';
// import * as request from 'supertest';
// import { app } from '../../src/app';
// import { ObjectId } from 'bson';
// import { compare } from 'bcrypt';

// describe('Test user sign up controller', () => {
//     it('Can sign up user', async() => {
//         const body = { 
//             userName: 'Hong Van',
//             email: 'hongvan@gmail.com',
//             password: '123456',
//             tel: '1234567891',
//             address: 'Tân Kiểng, Quận 7',
//             role: 'member'    
//         }
//         await request(app).post('/api/user/signup').send(body);
//         const user = await User.findOne({}) as User;
//         assert.equal('Hong Van', user.userName);
//     });
// });

// describe('Test user sign in controller', () => {
//    beforeEach('Sign in a user for test', async ()=>{
//         await User.signUp('Hong Van', 'hongvan@gmail.com', '123456', '1234567891', 'Quan 7', 'member');
//    });

//     it('Can sign in', async() => {
//         const body = {
//             email: 'hongvan@gmail.com',
//             password: '123456'
//         };
//         const response = await request(app).post('/api/user/signin').send(body);
//         assert.equal('Hong Van', response.body.user.userName);
//     });

//     it('Cannot sign in with wrong email', async() => {
//         const body = {
//             email: 'hongvan1@gmail.com',
//             password: '123456'
//         };
//         const response = await request(app).post('/api/user/signin').send(body);
//         assert.equal(400, response.status);
//     });

//     it('Cannot sign in with wrong password', async() => {
//         const body = {
//             email: 'hongvan1@gmail.com',
//             password: '456789'
//         };
//         const response = await request(app).post('/api/user/signin').send(body);
//         assert.equal(400, response.status);
//     });
// });

// describe('Test user verify controller', () => {
//     let idUser, verifyCode;

//     beforeEach('Sign up for test', async() =>{
//         await User.signUp('Thanh Van', 'thanhvan@gmail.com', '123456', '1234567892', 'Quan 7', 'member');
//         const user = await User.findOne() as User;
//         idUser = user._id;
//         verifyCode = user.verifyCode;
//         assert.equal('thanhvan@gmail.com', user.email);
//     });

//     it('Can verify a user', async()=>{
//         await request(app).get(`/api/user/verify/${idUser}/${verifyCode}`);
//         const user = await User.findOne({}) as User;
//         assert.equal(true, user.isVerified); 
//     });

//     it('Cannot verify a user with wrong verify code', async()=>{
//         await request(app).get(`/api/user/verify/${idUser}/${verifyCode + 1}`);
//         const user = await User.findOne({}) as User;
//         assert.equal(false, user.isVerified); 
//     });

// });

// describe('Test user change information', () => {
//     let idUser: ObjectId, token: string;

//     beforeEach('Sign up for test', async() =>{
//         const signupSend = { 
//             userName: 'Thanh Van',
//             email: 'thanhvan@gmail.com',
//             password: '123456',
//             tel: '1234567894',
//             address: 'Tân Kiểng, Quận 7',
//             role: 'member'    
//         };
//         const signinSend = {
//             email: 'thanhvan@gmail.com',
//             password: '123456'
//         };
//         const response = await request(app).post('/api/user/signup').send(signupSend);
        
//         idUser = response.body.user.idUser;
//         token = response.body.token;
//         });

//     it('Can change info user', async()=>{
//         const body = {
//             idUser: idUser,
//             newUserName: 'Hong Van 2',
//             newEmail: 'hongvan2@gmail.com',
//             newTel: '1234567895',
//             newAddress: 'Quan 7',
//             token: token
//         }
//         await request(app).post('/api/user/changeinfo').send(body);
//         const user = await User.findOne() as User;
//         assert.equal('Hong Van 2', user.userName); 
//     });

//     it('Can change password', async() =>{
//         const body = {
//             idUser: idUser,
//             oldPass: '123456',
//             newPass: '3456789',
//             token: token
//         }
//         await request(app).post('/api/user/changepassword').send(body);
//         const user = await User.findById(idUser) as User;
//         const same = await compare('3456789', user.password);
//         assert.equal(true, same);
//     })
// });