const chai = require('chai');
const chaiHttp = require('chai-http');
const { setupDB } = require('./testConfig.js');
const app = require('../src/app.js');
let expect = chai.expect;
const User = require("../src/modules/users/model.js");
const Notes = require("../src/modules/notes/model.js");
const bcrypt = require("bcrypt");
let user, sharedUser, userLogin, noteCreateRes, noteCreateResId;

setupDB();

chai.use(chaiHttp);

describe('Notes function Unit Testing', () => {

    before("its execute before the test cases", async () => {

        user = await new User({
            firstName: "test2",
            lastName: "Kumar",
            email: "newCreateUserTest@gmail.com",
            username: "newCreateUserTest",
            password: await bcrypt.hash("password", 10),
        }).save();

        sharedUser = await new User({
            firstName: "test2",
            lastName: "Kumar",
            email: "sharedUserTest@gmail.com",
            username: "sharedUserTest",
            password: await bcrypt.hash("password", 10),
        }).save();
        

        userLogin = await chai.request(app).post('/api/auth/login').send({
            username: "newCreateUserTest@gmail.com", password: "password"
        });
        
    })

    after("its execute after all test cases and delete all user",()=>{
        Notes.deleteMany({owner : userLogin.body.data._id});
        User.deleteMany({firstName: "test2"}).exec()
    })

    it("it should POST a Note", async () => {
      let note = {
        title: "title",
        content: "content",
      };
      noteCreateRes = await chai.request(app).post('/api/notes').send(note)
            .set('Authorization', `Bearer ${userLogin.body.data.tokens.accessToken}`);

      noteCreateResId = noteCreateRes.body.data._id;
      expect(noteCreateRes.body.code).to.equal(201);
      expect(noteCreateRes.body.success).to.equal(true);
      expect(noteCreateRes.body.message).to.equal('Note created successfully');
    });

    it('it should get all the note of a user', async () => {
        const getNotesRes = await chai.request(app).get('/api/notes')
            .set('Authorization', `Bearer ${userLogin.body.data.tokens.accessToken}`);
        expect(getNotesRes.body.code).to.equal(200);
        expect(getNotesRes.body.success).to.equal(true);
        expect(getNotesRes.body.message).to.equal('User Notes fetched successfully');
    })

    it('it should get note by Id of a user', async () => {
        const getNotesRes = await chai.request(app).get(`/api/notes/${noteCreateRes.body.data._id}`)
            .set('Authorization', `Bearer ${userLogin.body.data.tokens.accessToken}`);
        expect(getNotesRes.body.code).to.equal(200);
        expect(getNotesRes.body.success).to.equal(true);
        expect(getNotesRes.body.message).to.equal('User Note fetched successfully');
    })

    it('it should update note by Id of a user', async () => {
        let newNoteData = {
            title: "newTitle",
            content: "newContent",
        };
        const getNotesRes = await chai.request(app).put(`/api/notes/${noteCreateRes.body.data._id}`)
            .send(newNoteData)
            .set('Authorization', `Bearer ${userLogin.body.data.tokens.accessToken}`);
        expect(getNotesRes.body.code).to.equal(200);
        expect(getNotesRes.body.success).to.equal(true);
        expect(getNotesRes.body.message).to.equal('Note updated successfully');
    })

    it("it should share a Note with other user", async () => {
      let sharedUserData = {
        shareUser : sharedUser._id.toString(),
      };
      noteCreateRes = await chai.request(app).post(`/api/notes/${noteCreateResId}/share`)
        .send(sharedUserData)
        .set('Authorization', `Bearer ${userLogin.body.data.tokens.accessToken}`);
      expect(noteCreateRes.body.code).to.equal(201);
      expect(noteCreateRes.body.success).to.equal(true);
      expect(noteCreateRes.body.message).to.equal('user shared successfully');
    });

    it("it should search in a Note with keyword", async () => {
      noteCreateRes = await chai.request(app).get(`/api/notes/search?q=newTitle`)
        .set('Authorization', `Bearer ${userLogin.body.data.tokens.accessToken}`);
      expect(noteCreateRes.body.code).to.equal(200);
      expect(noteCreateRes.body.success).to.equal(true);
      expect(noteCreateRes.body.message).to.equal('note searched successfully');
    });

    it('it should delete a note of a user', async () => {
        const getNotesRes = await chai.request(app).delete(`/api/notes/${noteCreateResId}`)
            .set('Authorization', `Bearer ${userLogin.body.data.tokens.accessToken}`);
        expect(getNotesRes.body.code).to.equal(200);
        expect(getNotesRes.body.success).to.equal(true);
        expect(getNotesRes.body.message).to.equal('Note deteled successfully');
    })
});