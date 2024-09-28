import {z} from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username can't be more than 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain alphanumeric or along with _ characters")

export const signUpSchemas = z.object({
    username: usernameValidation,
    password: z
       .string()
       .min(8, "Password must be at least 8 characters long"),
    email: z.string().email({message: "Invalid email address"})
})


export const signInSchemas = z.object({
    identifier : z.string(),
    password : z.string()
})