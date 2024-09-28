"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input";
import { signUpSchemas } from "@/schemas/user-schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react'
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";

const SignUpPage = () => {
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const delayed = useDebounceCallback(setUsername, 500)
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchemas>>({
      resolver: zodResolver(signUpSchemas),
      defaultValues: {
          username: "",
          email: "",
          password: "",
      }
  })
  useEffect(() => {
    const checkUniqueUsername = async () => {
        if (username) {
            setIsCheckingUsername(true)
            setUsernameMessage('') //reset message
            
            try {
                const response = await axios.get(`/api/check-unique-username?username=${username}`)
                setUsernameMessage(response.data.message)
            } catch (error) {
              console.error(error)
                setUsernameMessage(
                  'Error checking username'
                );
            } finally {
                setIsCheckingUsername(false);
            }
        }
    }
    checkUniqueUsername()
  }, [username])

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const onSubmit = async (data: z.infer<typeof signUpSchemas>) => {
      setIsSubmitting(true)

      try {
          await axios.post('/api/sign-up', data)
          .then((response) => toast.success(response.data.message))
          .catch((response) => toast.error(response.data.message))
          

          router.replace(`/verify/${username}`)

          setIsSubmitting(false)
      } catch (error) {
          console.error('Error in signup user',  error)

          toast.error('An error occurred while signing up')

          setIsSubmitting(false)
      } finally {
        setIsSubmitting(false)
      }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full sm:max-w-md max-w-sm font-monkey rounded-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="username"
                        onChange={(e) => {
                          field.onChange(e);
                          delayed(e.target.value)
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className='animate-spin text-sm' />}
                    {!isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-xs ${
                            usernameMessage === 'Username is unique'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {usernameMessage}
                        </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isSubmitting} type="submit" className="w-full">Sign Up</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href='/sign-in'>
            <Button variant="link" className="text-sm text-gray-600 hover:text-gray-800">
              Already have an account? Sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
