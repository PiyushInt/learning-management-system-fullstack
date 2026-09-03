import request from 'supertest';
import app from '../src/app.js';
import { fixtures, reseed, getToken } from './fixtures.js';

describe('Input Coercion All Routes', () => {
    beforeAll(async () => await reseed());

    const routes = [
        ['GET', '/courses/:id', 'TEACHER'],
        ['POST', '/courses/:id/enroll', 'STUDENT'],
        ['GET', '/courses/:id/assignments', 'TEACHER'],
        ['POST', '/courses/:id/assignments', 'TEACHER'],
        ['POST', '/assignments/:id/submit', 'STUDENT'],
        ['GET', '/assignments/:id/submissions', 'TEACHER']
    ];
    
    const inputs = ['abc', '-1', '999999999999', '0'];

    for (const [method, route, role] of routes) {
        describe(`Route ${method} ${route}`, () => {
            for (const val of inputs) {
                it(`handles ${val}`, async () => {
                    const url = route.replace(':id', val);
                    const user = role === 'TEACHER' ? fixtures.teacherA : fixtures.enrolledStudent;
                    const token = getToken(user);
                    const res = await request(app)[method.toLowerCase()](url).set('Authorization', `Bearer ${token}`);
                    expect(res.statusCode).toBe(400);
                });
            }
        });
    }
});
