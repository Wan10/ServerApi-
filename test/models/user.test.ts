import * as assert from 'assert';
import { User } from '../../src/models/User';
import * as request from 'supertest';
import { app } from '../../src/app';


describe('Test user model', () => {
    it('Can add new user', async() => {
        const user = new User({
            userName: 'Thanh Van',
            email: 'lamthanhvan0206@gmail.com',
            password: '123456',
            tel: '0123456789'
        });
        await user.save();
        const user2 = await User.findOne({}) as User;
        // console.log(user2); 
        assert.equal('lamthanhvan0206@gmail.com', user2.email);
    });
});


xdescribe('Test get location address user model', () => {
    it('Sign up for test', async() => {
        const user = new User({
            userName: 'Thanh Van',
            email: 'lamthanhvan0206@gmail.com',
            password: '123456',
            tel: '0123456789',
            address: '38/5 Be Van Cam Quan 7, Ho Chi Minh'
        });
        await user.save();
        const user2 = await User.findOne({}) as User;
        await User.getLocationAddress(user2._id, 'Di Linh, Lâm Đồng');
        // console.log(user2); 
        assert.equal('lamthanhvan0206@gmail.com', user2.email);
    });
});