const apps = require('supertest');
const assert = require('assert');
const { app } = require('../start.js');
var should = require('chai').should();
var expect = require('chai').expect();

describe('test connection to backend', function () {
    it('respond with 200 0k', function (done) {
        apps(app)
            .get('/api/v1/test')
            .expect(200, done)
    });
});
describe('test All endpoint response', function () {

    describe('test all auth routes', function () {
        let newuser = {
            "firstName": "firstname",
            "lastName": "lastname",
            "gender": "male",
            "email": "domrand9@gmail.com",
            "country": "testaddress",
            "address": "myaddrress",
            "occupation": "student",
            "status": "single",
            "password": "thepassword",
            "phone": "555356565636"
        }

        let wrongEmail = {
            "firstName": "firstname",
            "lastName": "lastname",
            "gender": "male",
            "email": "domrand9@com",
            "country": "testaddress",
            "address": "myaddrress",
            "occupation": "student",
            "status": "single",
            "password": "thepassword",
            "phone": "555356565636"
        }

        let wrongSignupData = {
            "firstName": "",
            "lastName": "lastname",
            "gender": "male",
            "email": "domrand9@gmail.com",
            "country": "testaddress",
            "address": "myaddrress",
            "occupation": "student",
            "status": "single",
            "password": "thepassword",
            "phone": "555356565636"
        }
        let loginData = {
            "email": "domrand9@gmail.com",
            "password": "thepassword"
        }

        let loginBadInput = {
            "email": "",
            "password": "thepassword"
        }
        let credit = {
            "amount": 3000
        }

        it('respond with cant login', function (done) {
            apps(app)
                .post('/api/v1/login')
                .send(loginData)
                .set('Accept', 'application/json')
                .expect(401, done)
        });

        it('respond with firstname is required', function (done) {
            apps(app)
                .post('/api/v1/signup')
                .send(wrongSignupData)
                .set('Accept', 'application/json')
                .expect(400, done)
        });

        it('respond with enter valid email address', function (done) {
            apps(app)
                .post('/api/v1/signup')
                .send(wrongEmail)
                .set('Accept', 'application/json')
                .expect(400, done)
        });

        it('respond with 201 created', function (done) {
            apps(app)
                .post('/api/v1/signup')
                .send(newuser)
                .set('Accept', 'application/json')
                .expect(201, done)
        });

        it('respond with credited', function (done) {
            apps(app)
                .patch('/api/v1/credit/1')
                .send(credit)
                .set('Accept', 'application/json')
                .expect(200, done)
        });

        it('respond with 200 created', function (done) {
            apps(app)
                .get('/api/v1/user/1')
                .set('Accept', 'application/json')
                .expect(200, done)
        });

        it('respond with email is taken', function (done) {
            apps(app)
                .post('/api/v1/signup')
                .send(newuser)
                .set('Accept', 'application/json')
                .expect(400, done)
        });

        it('respond with cant login, email required', function (done) {
            apps(app)
                .post('/api/v1/login')
                .send(loginBadInput)
                .set('Accept', 'application/json')
                .expect(400, done)
        });

        it('respond with logged in success', function (done) {
            apps(app)
                .post('/api/v1/login')
                .send(loginData)
                .set('Accept', 'application/json')
                .expect(200, done)
        });
    })
    

    after(function (done) {
        apps(app)
            .delete('/api/v1/cleartest')
            .end(function (err, res) {
                done();
            })

    })

});
