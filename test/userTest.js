const chai = require('chai');
const chaiHttp = require('chai-http');
const { setupDB } = require('./testConfig.js');
const app = require('../src/app.js');
let expect = chai.expect;
const User = require("../src/modules/users/model.js");

setupDB();

chai.use(chaiHttp);

describe('User function Unit Testing', () => {
    after("its execute after all test cases and delete all user",(done)=>{
        User.deleteMany({firstName:"test"}).exec()
        done();
    })

    it("it should POST a user", async () => {
      let user = {
        firstName: "test",
        lastName: "Kumar",
        email: "akashg@gmail.com",
        username: "akash",
        password:"anything"
      };
      const loginRes = await chai.request(app).post('/api/auth/signup').send(user);
      token = loginRes.body.data
      expect(loginRes.body.code).to.equal(201);
      expect(loginRes.body.success).to.equal(true);
      expect(loginRes.body.message).to.equal('User created successfully');
    });

    it('it should login a user', async () => {
        const loginRes = await chai.request(app).post('/api/auth/login').send({
            username: "akashg@gmail.com", password: "anything"
        })
        expect(loginRes.body.code).to.equal(201);
        expect(loginRes.body.success).to.equal(true);
        expect(loginRes.body.message).to.equal('Successfully logged in');
    })
});