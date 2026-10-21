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

  test('rejects a wrong password (404)', async ({ request, createdUser }) => {
    const response = await request.post('/api/verifyLogin', {
      form: {
        email: createdUser.email,
        password: 'Wrong password',
      },
    });
    const body = JSON.parse(await response.text()) as { responseCode: number };
    expect(body.responseCode).toBe(404);
  });

  test('rejects a missing password (400)', async ({ request, createdUser }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: createdUser.email },
    });
    const body = JSON.parse(await response.text()) as { responseCode: number };
    expect(body.responseCode).toBe(400);
  });

  test('rejects an invalid email (404)', async ({ request, createdUser }) => {
    const response = await request.post('/api/verifyLogin', {
      form: {
        email: 'invalid-email',
        password: createdUser.password,
      },
    });
    const body = JSON.parse(await response.text()) as { responseCode: number };
    expect(body.responseCode).toBe(404);
  });

  test('rejects a missing email (400)', async ({ request, createdUser }) => {
    const response = await request.post('/api/verifyLogin', {
      form: { password: createdUser.password },
    });
    const body = JSON.parse(await response.text()) as { responseCode: number };
    expect(body.responseCode).toBe(400);
  });
});
