import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Parking System E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/login (POST) - should login with admin credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'admin123' })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user.username).toBe('admin');
          expect(res.body.user.role).toBe('admin');
        });
    });

    it('/auth/login (POST) - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('Check-in/Check-out Flow', () => {
    let token: string;
    let stayId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'operator', password: 'operator123' });
      token = response.body.access_token;
    });

    it('should complete a full check-in and check-out flow', async () => {
      // Check-in
      const checkInResponse = await request(app.getHttpServer())
        .post('/stays/check-in')
        .set('Authorization', `Bearer ${token}`)
        .send({
          plate: 'TEST-123',
          vehicleType: 'car',
          model: 'Test Car',
          color: 'Blue',
        })
        .expect(201);

      expect(checkInResponse.body.id).toBeDefined();
      expect(checkInResponse.body.vehicle.plate).toBe('TEST-123');
      expect(checkInResponse.body.status).toBe('active');
      stayId = checkInResponse.body.id;

      // Small delay to ensure measurable duration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check-out
      const checkOutResponse = await request(app.getHttpServer())
        .post('/stays/check-out')
        .set('Authorization', `Bearer ${token}`)
        .send({
          stayId: stayId,
          isLostTicket: false,
        })
        .expect(200);

      expect(checkOutResponse.body.status).toBe('completed');
      expect(checkOutResponse.body.checkOutTime).toBeDefined();
      expect(checkOutResponse.body.calculatedFee).toBeDefined();
      // Should be free due to tolerance period
      expect(Number(checkOutResponse.body.calculatedFee)).toBe(0);
    });

    it('should prevent duplicate check-in for same vehicle', async () => {
      // First check-in
      await request(app.getHttpServer())
        .post('/stays/check-in')
        .set('Authorization', `Bearer ${token}`)
        .send({
          plate: 'DUP-TEST',
          vehicleType: 'moto',
        })
        .expect(201);

      // Second check-in for same vehicle should fail
      await request(app.getHttpServer())
        .post('/stays/check-in')
        .set('Authorization', `Bearer ${token}`)
        .send({
          plate: 'DUP-TEST',
          vehicleType: 'moto',
        })
        .expect(400);
    });
  });
});
