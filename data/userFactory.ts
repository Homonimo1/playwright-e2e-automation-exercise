import { faker } from '@faker-js/faker';

export type User = {
  name: string;
  email: string;
  password: string;
};

/**
 * Builds a disposable user. Every test gets its own email so runs stay independent.
 */
export function buildUser(): User {
  return {
    name: faker.person.firstName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
  };
}

/**
 * Builds the full payload required by `/api/createAccount`.
 */
export function buildUserForm(user: User): Record<string, string> {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: 'Mr',
    birth_date: '1',
    birth_month: '1',
    birth_year: '1990',
    firstname: user.name,
    lastname: faker.person.lastName(),
    company: 'QA',
    address1: faker.location.streetAddress(),
    address2: 'Apt 1',
    country: 'Canada',
    zipcode: '1234',
    state: 'State',
    city: faker.location.city(),
    mobile_number: '3202245566',
  };
}
