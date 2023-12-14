// process.env.NODE_ENV = 'test';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../server.js'); // Import your Express app
// const User = require("../models/user");

// chai.use(chaiHttp);
// const expect = chai.expect;

// describe('User API Tests', () => {
//     it('Register user - Success', async () => {
//         const newUser = {
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             password: 'password123',
//         };

//         try {
//             const res = await chai.request(app)
//                 .post('/register')
//                 .send(newUser);

//             expect(res).to.have.status(200);
//             expect(res.body).to.be.an('object');
//             expect(res.text).to.equal('User Registered successfully');

//             // Add more assertions or actions based on your test scenario

//         } catch (error) {
//             console.error('Error during test:', error);
//             throw error;
//         }
//     });

//     it('Login user - Success', async () => {
//         // Assuming you have a user registered for testing
//         const existingUser = new User({
//             name: 'Test User',
//             email: 'test.user@example.com',
//             password: 'testpassword',
//         });
//         await existingUser.save();

//         const loginData = {
//             email: 'test.user@example.com',
//             password: 'testpassword',
//         };

//         try {
//             const res = await chai.request(app)
//                 .post('/login')
//                 .send(loginData);

//             expect(res).to.have.status(200);
//             expect(res.body).to.be.an('object');

//             // Add more assertions or actions based on your test scenario

//         } catch (error) {
//             console.error('Error during test:', error);
//             throw error;
//         }
//     });

//     // Add more test cases as needed for your application

// });

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const User = require("../models/user.js")


chai.use(chaiHttp);
const expect = chai.expect;

describe('User API Tests', () => {
    it('Signin user - Failure', async () => {
        const email = "john_doe@gmail.com";
        const password = "secret123";

        try {
            // Execute the query using await
            const user = await User.findOne({ email, password });

            const res = await chai.request(app)
                .post('/api/users/login')
                .send({email, password});

            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');

        } catch (error) {
            console.error('Error during test:', error);
            // Handle the error or fail the test if needed
            throw error;
        }
    }).timeout(5000);;

    it('Signin user - Success', async () => {
        const email = 'name@example.com';
        const password = '1234';

        try {
            // Execute the query using await
            const user = await User.findOne({ email, password });
            const res = await chai.request(app)
                .post('/api/users/login')
                .send({email, password});

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');

            // Add more assertions or actions based on your test scenario

        } catch (error) {
            console.error('Error during test:', error);
            // Handle the error or fail the test if needed
            throw error;
        }
    });

});