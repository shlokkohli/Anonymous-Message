'use client'
import MessageCard from "@/components/MessageCard"
import { useToast } from "@/hooks/use-toast"
import { Message, User } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button';
import { Loader, Loader2, RefreshCcw } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useCopyToClipboard } from "usehooks-ts"

function page() {

    const [messages, setMessages] = useState<Message[]>([]) // all the messages of the user will be stored in the messages
    const [isLoading, setIsLoading] = useState(false) // this is the in general is loading of the page
    const [isSwitchLoading, SetIsSwitchLoading] = useState(false) // this makes sure whrn the user clicks the toggle and the server
    //is taking time, they do not click the toggle again and again until the server replies with something (success or failure)

    const { toast } = useToast();

    const { data: session, status } = useSession()
    const username = session?.user.username

    const baseURL = `${window.location.protocol}//${window.location.host}` // http://localhost3000
    let profileURL: string;
    if(status === 'loading'){
        profileURL = 'Loading...'
    } else {
        profileURL = `${baseURL}/u/${username}`
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileURL)
        toast({
            title: "URL Copied",
            description: "Profile URL has been copied to clipboard"
        })
    }

    const { register, watch, setValue } = useForm({
        resolver: zodResolver(acceptMessageSchema),
    })

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((eachVal) => eachVal._id !== messageId))
    }

    const acceptMessages = watch('acceptMessages')

    const fetchNewMessages = async (refresh: boolean = false) => {
        setIsLoading(true)
        SetIsSwitchLoading(true)

        try {
            const response = await axios.get('/api/get-messages')
            setMessages(response.data.message || [])
            toast({
                title: "Refreshed Messages",
                description: "Showing latest messages"
            })

        } catch (error) {

            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            });

        } finally {
            setIsLoading(false)
            SetIsSwitchLoading(false)
        }
    }

    const Check_Has_User_Enabled_Fetching_Messages = async () => {
        SetIsSwitchLoading(true)

        try {
            const response = await axios.get('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages)

        } catch (error) {
            console.log('some error occured')
        } finally {
            SetIsSwitchLoading(false)
        }
    }

    useEffect(() => {
        if(!session || !session.user) return // if there is no user, do not do anything
        console.log(session)
        // if the user is logged in, first check if the user has enabled for fetching new messages, then fetch new messages
        Check_Has_User_Enabled_Fetching_Messages()
        fetchNewMessages()

    }, [session])

    const handleSwitchToggle = async () => {
        SetIsSwitchLoading(true)

        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message
              });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
              }); 
        } finally {
            SetIsSwitchLoading(false)
        }
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileURL}
                        disabled
                        className="input input-bordered w-full p-2 mr-2 bg-slate-100"
                    />
                    <Button onClick={() => copyToClipboard()}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    disabled={isSwitchLoading}
                    onCheckedChange={() => handleSwitchToggle()}
                />
                <span className="ml-2">
                    Accpetance Message: {acceptMessages ? "On" : "Off"}
                </span>
            </div>

            <Button // this is the refresh button for refreshing fetch new messages
                className="mt-4"
                variant='outline'
                onClick={(e) => {
                    e.preventDefault
                    fetchNewMessages(true)
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                ) }
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDelete={() => handleDeleteMessage(message._id as string)}
                        />
                    ))
                ) : (
                    <p>No messages to display</p>
                )}
            </div>

        </div>
    )
}

export default page