'use client'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { messageSchema } from '@/schemas/messageSchema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import Navbar from '@/components/Navbar'
import { BackgroundBeams } from "@/components/ui/background-beams";

const page = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [suggestMessageLoading, setSuggestMessageLoading] = useState(false)
  const [messages, setMessages] = useState<string[]>([
    "What's a hobby you're passionate about?",
    " you could meet any historical figure, who would it be?",
    "What’s something small that brightens your day?",
  ])

  const specialCharacter = '||';

  const parsedStringMessages = (generatedMessage: string): string[] => {
    return generatedMessage.split(specialCharacter)
  }

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    }
  })

  const params = useParams()
  const username = params?.username as string

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)

    try {
      const response = await axios.post('/api/send-message', {
        username: username,
        content: data.content
      })

      toast({
        title: response?.data.message,
        variant: 'default',
      })
      form.setValue('content', '')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: axiosError.response?.data.message || "Error occured in sending the message",
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    setSuggestMessageLoading(true)
    
    try {

      const response = await axios.get('/api/suggest-messages')
      console.log(response?.data.message)
      setMessages(parsedStringMessages(response?.data.message))
      
    } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: axiosError.response?.data.message || "Error occured suggesting messages",
        variant: "destructive"
      })

    } finally {
      setSuggestMessageLoading(false)
    }
  }

  const handleMessageClick = (message: string) => {
    form.setValue('content', message)
  }

  return (
    <div className='bg-slate-900 max-h-screen'>
      <BackgroundBeams />
    <div className='container mx-auto px-6 py-4 max-w-4xl bg-slate-900 text-white shadow-2xl rounded-xl border-red-500/10 max-h-screen'>
      <h1 className='text-3xl font-bold text-center m-6'>
        Public Profile Link
      </h1>

      {/* create a form here */}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Send Anonymous Message to @{username}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Write your anonymous message here'
                  className='resize-none text-black relative z-20'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-center'>
          {isLoading ? (
            <Button disabled className='text-white bg-teal-700 hover:bg-teal-800'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin text-white' />
              Please Wait
            </Button>
          ) : (
          <Button className='text-white bg-teal-700 hover:bg-teal-800 hover:text-white' type='submit'>
            Send It
          </Button>
          ) }
        </div>
      </form>
      </Form>

      <div className='space y-4 my-5'>
        <div className='space-y-2'>
          {suggestMessageLoading ? (
            <Button
            className='my-4 bg-blue-700 hover:bg-blue-800'
            disabled>
              Suggesting...
            </Button>
          ) : (
            <Button
            className='my-4 bg-blue-700 hover:bg-blue-800'
            onClick={() => fetchSuggestedMessages()}
            disabled={suggestMessageLoading}>
              Suggest Messages
            </Button>
          ) }
          <p>Click on any message below to select it.</p>
        </div>

        {/* AI generated responses */}
        <Card className='mt-4 text-white bg-slate-900'>
          <CardHeader>
            <h1 className='text-xl font-semibold'>Messages</h1>
          </CardHeader>
          <CardContent className='flex flex-col space-y-4'>
            {messages.map((message, index) => (
              <Button
                key={index}
                onClick={() => handleMessageClick(message)}
                variant="outline"
                className="mb-2 text-white bg-slate-800 border-none hover:bg-blue-700 whitespace-normal h-auto text-left break-words"
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />
      </div>
      </div>
  )
}

export default page