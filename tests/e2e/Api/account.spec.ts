import {test, expect} from "@playwright/test";
import { faker, Faker } from "@faker-js/faker";

test.describe('API - Account', () => {
    test('Creaccion de cuenta con datos validos @smoke', async ({ request }) => {
        const email= faker.internet.email()
        const password= faker.internet.password()    
        
        const res = await request.post("/api/createAccount", {
        form: {
            name: faker.person.firstName(),
            email,
            password,
            title: "Mr",
            birth_date: "1",
            birth_month: "2",
            birth_year: "1990",
            firstname: "Test",
            lastname: "User",
            company: "QA",
            address1: faker.location.streetAddress(),
            address2: "Apto1",
            country: "Canada",
            zipcode: "1234",
            state: "State",
            city: faker.location.city(),
            mobile_number: "3202245566",
        },
        });

        const body = (JSON.parse(await res.text())) as { responseCode: number };
        expect(body.responseCode).toBe(201);

        //LIMPIEZA 
        await request.delete("/api/deleteAccount", {form:{email,password}});
                
    });
    
});
