'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from '@/models/User'
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from 'dayjs';

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

function MessageCard({ message, onMessageDelete}: MessageCardProps ) {

    const { toast } = useToast()

    const handleDeleteConfirm = async () => {

        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

            // if the message has been successfully deleted, call the onMessageDelete function
            if(response.data.success){
                toast({
                    title: response.data.message,
                })
                onMessageDelete(message._id as string)
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to delete message",
                variant: "destructive"
            })
        }
    }

  return (

    <Card className="card-bordered text-black bg-slate-800">
      <CardHeader>

        <div className="flex justify-between items-center">
          <CardTitle className="overflow-y-auto mr-4 text-white">{message.content}</CardTitle>

          <AlertDialog>
            <AlertDialogTrigger asChild>

              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>

            </AlertDialogTrigger>

            <AlertDialogContent className="text-white bg-slate-950">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-white">
                  This action cannot be undone. This will permanently delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-900 hover:bg-slate-900 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-red-800 hover:bg-red-900" onClick={handleDeleteConfirm}>
                    Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>

          </AlertDialog>

        </div>

        <div className="text-sm text-white">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>

      </CardHeader>
      <CardContent></CardContent>

    </Card>

  )
}

export default MessageCard