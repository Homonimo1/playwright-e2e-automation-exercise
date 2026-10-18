import {test,expect} from "../../fixtures";

test.describe('Validación de usuarios por API', () => {
    test('Login de usuario por API', async ({ request, usuarioCreado }) => {
        const response= await request.post("/api/verifyLogin",{
            form:{
                email:usuarioCreado.email,
                password:usuarioCreado.password
            }
        });
        const body= JSON.parse(await response.text())
        expect(body.responseCode).toBe(200);
        
    })

    test('Login con datos inválidos/vacíos', async ({ request, usuarioCreado }) => {
        await test.step('Validación con contraseña incorrecta', async () => {
            const solicitud= await request.post("/api/verifyLogin", {form:{
                email: usuarioCreado.email,
                password: "Clave incorrecta"
            }});
        const body= JSON.parse(await solicitud.text());
                      
            expect (body.responseCode).toBe(404)
            
        });
        await test.step('Validación con contraseña vacía', async () => {
            const solicitud= await request.post("/api/verifyLogin", {form:
                {
                    email: usuarioCreado.email
                    
                }                
            });
            const body= JSON.parse(await solicitud.text());
            expect(body.responseCode).toBe(400)
            
        });
        
        await test.step('Validación email inválido', async () => {
            const solicitud= await request.post("/api/verifyLogin",{form:{
                email: "EmailInvalido",
                password: usuarioCreado.password
            }});
            const body= JSON.parse(await solicitud.text());
            expect (body.responseCode).toBe(404)


        });

        await test.step('Validación email vacío', async () => {
            const solicitud= await request.post("/api/verifyLogin",{form:
                {
                    password: usuarioCreado.password
            }
            })
            const body= JSON.parse(await solicitud.text());
            expect(body.responseCode).toBe(400);
        });
        
        
        
        
    });
    
    
    
});
