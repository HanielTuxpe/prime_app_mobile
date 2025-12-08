import { validateMatricula, validatePassword } from "../../utils/validation";

describe("Validación de matrícula", () => {
    test("Debe fallar si la matrícula está vacía", () => {
        const result = validateMatricula("");
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/vacía/);
    });

    test("Debe fallar si contiene letras", () => {
        const result = validateMatricula("abc123");
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/números/);
    });

    test("Debe fallar si tiene menos de 8 dígitos", () => {
        const result = validateMatricula("12345");
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(/8 dígitos/);
    });

    test("Debe pasar con 8 dígitos numéricos", () => {
        const result = validateMatricula("20221026");
        expect(result.valid).toBe(true);
    });
});

describe("Validación de contraseña", () => {
    test("Debe fallar si la contraseña está vacía", () => {
        const result = validatePassword("");
        expect(result.valid).toBe(false);
    });

    test("Debe fallar si tiene menos de 6 caracteres", () => {
        const result = validatePassword("123");
        expect(result.valid).toBe(false);
    });

    test("Debe pasar con una contraseña válida", () => {
        const result = validatePassword("hshg6619.");
        expect(result.valid).toBe(true);
    });
});
