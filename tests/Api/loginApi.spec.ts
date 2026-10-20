import { test, expect } from '../../fixtures';

test.describe('API - Login', () => {
  test('logs in a user through the API', async ({ request, createdUser }) => {
    const response = await request.post('/api/verifyLogin', {
      form: {
        email: createdUser.email,
        password: createdUser.password,
      },
    });
    const body = JSON.parse(await response.text()) as { responseCode: number };
    expect(body.responseCode).toBe(200);
  });

  test('rejects invalid or empty credentials', async ({ request, createdUser }) => {
    await test.step('wrong password returns 404', async () => {
      const response = await request.post('/api/verifyLogin', {
        form: {
          email: createdUser.email,
          password: 'Wrong password',
        },
      });
      const body = JSON.parse(await response.text()) as { responseCode: number };
      expect(body.responseCode).toBe(404);
    });

    await test.step('missing password returns 400', async () => {
      const response = await request.post('/api/verifyLogin', {
        form: { email: createdUser.email },
      });
      const body = JSON.parse(await response.text()) as { responseCode: number };
      expect(body.responseCode).toBe(400);
    });

    await test.step('invalid email returns 404', async () => {
      const response = await request.post('/api/verifyLogin', {
        form: {
          email: 'invalid-email',
          password: createdUser.password,
        },
      });
      const body = JSON.parse(await response.text()) as { responseCode: number };
      expect(body.responseCode).toBe(404);
    });

    await test.step('missing email returns 400', async () => {
      const response = await request.post('/api/verifyLogin', {
        form: { password: createdUser.password },
      });
      const body = JSON.parse(await response.text()) as { responseCode: number };
      expect(body.responseCode).toBe(400);
    });
  });
});
