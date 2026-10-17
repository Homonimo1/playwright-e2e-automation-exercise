import {test,expect} from "../../fixtures";

test.describe('Validacion de usuarios por API', () => {
    test('Login de User por API', async ({ request, usuarioCreado }) => {
        const response= await request.post("/api/verifyLogin",{
            form:{
                email:usuarioCreado.email,
                password:usuarioCreado.password
            }
        });
        const body= JSON.parse(await response.text())
        expect(body.responseCode).toBe(200);
        
    })

    test('Login con datos invalidos/vacios', async ({ request, usuarioCreado }) => {
        await test.step('Validacion con constraseña incorrecta', async () => {
            const solicitud= await request.post("/api/verifyLogin", {form:{
                email: usuarioCreado.email,
                password: "Clave incorrecta"
            }});
        const body= JSON.parse(await solicitud.text());
                      
            expect (body.responseCode).toBe(404)
            
        });
        await test.step('Validacion con contraseña vacia', async () => {
            const solicitud= await request.post("/api/verifyLogin", {form:
                {
                    email: usuarioCreado.email
                    
                }                
            });
            const body= JSON.parse(await solicitud.text());
            expect(body.responseCode).toBe(400)
            
        });
        
        await test.step('Validacion email invalido', async () => {
            const solicitud= await request.post("/api/verifyLogin",{form:{
                email: "EmailInvalido",
                password: usuarioCreado.password
            }});
            const body= JSON.parse(await solicitud.text());
            expect (body.responseCode).toBe(404)


        });

        await test.step('Validacion email vacio', async () => {
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
