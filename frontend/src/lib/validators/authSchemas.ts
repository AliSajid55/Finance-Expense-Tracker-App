import { z } from "zod"

export const loginSchema = z.object({

  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
  
})

export const signupSchema = z.object({

  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name must be at least 2 characters")

})