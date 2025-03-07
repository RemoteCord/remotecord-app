import { z } from "zod";

const passwordValidation = z
  .string()
  .min(8, {
    message: "La contraseña tiene que tener un minimo de 8 caracteres",
  })
  .max(20, { message: "La contraseña no puede tener mas de 20 caracteres" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "La contraseña tiene que tener al menos una mayuscula",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "La contraseña tiene que tener al menos una minuscula",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "La contraseña tiene que tener al menos un numero",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "La contraseña tiene que tener al menos un caracter especial",
  });

export const SignUpSchema = z
  .object({
    username: z.string().min(2, {
      message: "El nombre tiene que tener un minimo de 2 caracteres",
    }),
    email: z.string().email({
      message: "El correo no es valido",
    }),

    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

export const SignInSchema = z.object({
  email: z.string().email({
    message: "El correo no es valido",
  }),

  password: passwordValidation,
});
