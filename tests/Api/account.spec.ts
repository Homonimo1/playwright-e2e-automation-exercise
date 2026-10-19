import {test, expect} from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe('API - Account', () => {
    test('Creación de cuenta con datos válidos @smoke', async ({ request }) => {
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

     test('Verificación de creación de usuario duplicado', async ({ request }) => {
        const email= faker.internet.email()
        const password= faker.internet.password()    
        
        const form= {
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
        }

        // Creación de usuario nuevo

        await test.step('Crear usuario #1', async () => {
        const response= await request.post("/api/createAccount",{form});
        const first= JSON.parse(await response.text());
        expect (first.responseCode).toBe(201)    
        });
        
        

        //Crear usuario duplicado
        await test.step('Crear usuario duplicado', async () => {
        const response2= await request.post("/api/createAccount",{form})
        const second= JSON.parse(await response2.text());
        expect (second.responseCode).toBe(400) 
        });
        
                
        //Limpieza de datos

        await test.step('Eliminación/limpieza de usuario', async () => {
            await request.delete("/api/deleteAccount",{form:{email,password}})

        });
        

    });

    test("Creación de usuario sin campos obligatorios (Status 400)", async ({ request }) => {
        const form={
            name:"test",
            email:faker.internet.email()
        } 
        const solicitud= await request.post("/api/createAccount", {form})
        const res= JSON.parse(await solicitud.text())    
        expect (res.responseCode).toBe(400)    
    });
    

    
});
