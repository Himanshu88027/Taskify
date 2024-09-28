'use client'

import { useState, useRef, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button, buttonVariants } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  code: z.string().length(6, {
    message: "Verification code must be 6 digits.",
  }).regex(/^\d+$/, {
    message: "Verification code must only contain numbers.",
  }),
})

interface Props {
  params: {
    username: string;
  };
}

export default function VerifyCodePage({ params }: Props) {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/verify-code', {
          username: encodeURIComponent(params.username),
          code: data.code
      }).then((response) => toast.success(response.data.message))
        .catch((response) => toast.error(response.data.message))
      router.replace('/sign-in')
    } catch (error) {
      console.error('Error in verifying user',  error)
      toast.error("An error occurred while verifying user")
    }
  }

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    setCode([...code.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.value !== '') {
      const nextElement = inputs.current[index + 1]
      if (nextElement) {
        nextElement.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (index > 0 && code[index] === '') {
        const prevElement = inputs.current[index - 1]
        if (prevElement) {
          prevElement.focus()
        }
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...pastedData.split(''), ...Array(6 - pastedData.length).fill('')]
      setCode(newCode)
      form.setValue('code', newCode.join(''))
      if (inputs.current[5]) {
        inputs.current[5].focus()
      }
    }
  }

  useEffect(() => {
    form.setValue('code', code.join(''))
  }, [code, form])


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <Card className="w-full max-w-md font-monkey rounded-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Your Code</CardTitle>
          <CardDescription className="text-center">
            Please enter the 6-digit verification code we sent to your device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <div className="flex justify-between max-w-xs mx-auto">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <Input
                            {...field}
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={code[index]}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            ref={(el) => {
                                inputs.current[index] = el;
                                return;
                              }}
                            className="w-12 h-12 text-center text-2xl"
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the 6-digit code you received
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Verify</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href='/sign-up' className={cn("text-sm text-gray-600 hover:text-gray-800", buttonVariants({variant: "link"}))}>
            Didn&apos;t receive a code? Sign up again
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}