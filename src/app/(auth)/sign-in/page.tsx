'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from '@/components/ui/button';
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

function page() {

  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    try {
      const response = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      // if there is an error
      if(response?.error){
        toast({
          title: "Login Failed",
          description: response.error,
          variant: "destructive"
        })
        return;
      }

      if(response?.url){
        router.replace('/dashboard')
      }
      
    } catch (error) {

      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
          Welcome Back !
          </h1>
          <p className="mb-4">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                <FormLabel>Email / Username</FormLabel>
                <FormControl>
                  <Input placeholder="ID"{...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>)}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password"{...field}/>
                </FormControl>
                <FormMessage />
                </FormItem>)}
            />

            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>

          </form>
        </Form>
        
      </div>
    </div>
  )
}

export default page