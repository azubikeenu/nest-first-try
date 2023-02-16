import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should signup a new user', async () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({email :'enuazubike88@gmail.com' , password : 'userpass'})
      .expect(201)
      .then((res) => {
        const {email ,id} = res?.body
        expect(id).toBeDefined()
        expect(email).toBe('enuazubike88@gmail.com')
      })
  });

  it(`Should signup as a new user and get the currently logged in user`, async ()=>{

    const payload = {email :'rashput@gmail.com' , password : 'userpass'}
    const res = await request(app.getHttpServer()).post('/auth/sign-up')
      .send(payload)
      .expect(201);
    const cookie = res.get('Set-Cookie')

   request(app.getHttpServer()).get('/auth/whoAmI').set('Cookie' , cookie).expect(200).then(res => {
      const {email} = res.body
      expect(email).toBe(payload.email)
    })
  })
});
