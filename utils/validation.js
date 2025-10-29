// src/utils/validation.js

/**
 * Valida la matrícula ingresada.
 * Debe contener solo dígitos y tener al menos 8 caracteres.
 */
export function validateMatricula(matricula) {
    if (!matricula || matricula.trim() === "") {
        return { valid: false, message: "La matrícula no puede estar vacía." };
    }

    if (!/^\d+$/.test(matricula)) {
        return { valid: false, message: "La matrícula solo debe contener números." };
    }

    if (matricula.length < 8) {
        return { valid: false, message: "La matrícula debe tener al menos 8 dígitos." };
    }

    return { valid: true, message: "OK" };
}

/**
 * Valida la contraseña ingresada.
 * Debe tener al menos 6 caracteres y no estar vacía.
 */
export function validatePassword(password) {
    if (!password || password.trim() === "") {
        return { valid: false, message: "La contraseña no puede estar vacía." };
    }

    if (password.length < 6) {
        return { valid: false, message: "La contraseña debe tener al menos 6 caracteres." };
    }

    return { valid: true, message: "OK" };
}
