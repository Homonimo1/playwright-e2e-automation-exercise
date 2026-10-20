import { test, expect } from '@playwright/test';

import { buildUser, buildUserForm } from '../../data/userFactory';

test.describe('API - Account', () => {
  test('creates an account with valid data @smoke', async ({ request }) => {
    const user = buildUser();

    const response = await request.post('/api/createAccount', {
      form: buildUserForm(user),
    });
    const body = JSON.parse(await response.text()) as { responseCode: number };
    expect(body.responseCode).toBe(201);

    await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
  });

  test('rejects a duplicate email', async ({ request }) => {
    const form = buildUserForm(buildUser());

    await test.step('create the first user', async () => {
      const response = await request.post('/api/createAccount', { form });
      const body = JSON.parse(await response.text()) as { responseCode: number };
      expect(body.responseCode).toBe(201);
    });

    await test.step('try to create the same user again', async () => {
      const response = await request.post('/api/createAccount', { form });
      const body = JSON.parse(await response.text()) as { responseCode: number };
      expect(body.responseCode).toBe(400);
    });

    await test.step('delete the user', async () => {
      await request.delete('/api/deleteAccount', {
        form: { email: form.email, password: form.password },
      });
    });
  });

  test('rejects a payload without required fields', async ({ request }) => {
    const form = {
      name: 'test',
      email: buildUser().email,
    };

    const response = await request.post('/api/createAccount', { form });
    const body = JSON.parse(await response.text()) as { responseCode: number };
    expect(body.responseCode).toBe(400);
  });
});
