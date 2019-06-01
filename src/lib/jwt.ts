
import { sign, verify } from 'jsonwebtoken';
const KEY = 'i2u1e812udjsaasdfasdacscnfq2qy2';

export function createToken(obj): Promise<string> {
    return new Promise((resolve, reject) => {
        sign(obj, KEY, { expiresIn: '2 days' }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

export function verifyToken(token): Promise<any> {
    return new Promise((resolve, reject) => {
        verify(token, KEY, (err, obj) => {
            if (err) return reject(err);
            resolve(obj);
        });
    });
}
