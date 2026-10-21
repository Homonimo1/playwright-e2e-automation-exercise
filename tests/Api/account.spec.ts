import { test, expect } from '@playwright/test';

import { buildUser, buildUserForm } from '../../data/userFactory';

test.describe('API - Account', () => {
  test('creates an account with valid data @smoke', async ({ request }) => {
    const user = buildUser();

    await withCreatedAccount(request, user, async (body) => {
      expect(body.responseCode).toBe(201);
    });
  });

  test('rejects a duplicate email', async ({ request }) => {
    const user = buildUser();
    const form = buildUserForm(user);

    await withCreatedAccount(request, user, async () => {
      await test.step('try to create the same user again', async () => {
        const response = await request.post('/api/createAccount', { form });
        const body = (await response.json()) as { responseCode: number };
        expect(body.responseCode).toBe(400);
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

async function withCreatedAccount(
  request: import('@playwright/test').APIRequestContext,
  user: ReturnType<typeof buildUser>,
  runTest: (createdBody: { responseCode: number }) => Promise<void>,
): Promise<void> {
  const createResponse = await request.post('/api/createAccount', {
    form: buildUserForm(user),
  });
  const createBody = (await createResponse.json()) as { responseCode: number };
  expect(createBody.responseCode).toBe(201);

  let testError: unknown;
  try {
    await runTest(createBody);
  } catch (error) {
    testError = error;
  }

  try {
    const deleteResponse = await request.delete('/api/deleteAccount', {
      form: { email: user.email, password: user.password },
    });
    const deleteBody = (await deleteResponse.json()) as { responseCode: number };
    expect(deleteBody.responseCode).toBe(200);
  } catch (cleanupError) {
    if (testError) {
      console.error('Account cleanup also failed after the test failed:', cleanupError);
      throw testError;
    }
    throw cleanupError;
  }

  if (testError) throw testError;
}
