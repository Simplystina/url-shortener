const request = require('supertest')
const { connect } = require('./database')
const UserModel = require('../../Model/user')
const app = require('../../app');

describe('Auth: Signup', () => {
    let conn;

    beforeAll(async () => {
       conn = await connect()
   })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('should signup a user', async () => {
        const response = await request(app).post('/signup')
        .set('content-type', 'application/json')
        .send({ 
            password: 'Password123', 
            firstName: 'tobie',
            lastName: 'Augustina',
            email: 'tobi@mail.com'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('firstName', 'tobie')
        expect(response.body.user).toHaveProperty('lastName', 'Augustina')
        expect(response.body.user).toHaveProperty('email', 'tobi@mail.com')        
    })


   it('should login a user', async () => {
        // create user in out db
        const user = await UserModel.create({ email: 'tobi@mail.com', password: 'Password123'});

        // login user
        const response = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            password: 'Password123',
            email:"tobi@mail.com"
        });
    

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')      
    })
})