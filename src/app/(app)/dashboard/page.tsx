'use client'
import MessageCard from "@/components/MessageCard"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from "lucide-react"
import { Switch } from "@/components/ui/switch"

function Page() {

    const [messages, setMessages] = useState<Message[]>([]) // all the messages of the user will be stored in the messages
    const [isLoading, setIsLoading] = useState(false) // this is the in general is loading of the page
    const [isSwitchLoading, setIsSwitchLoading] = useState(true) // this makes sure whrn the user clicks the toggle and the server
    //is taking time, they do not click the toggle again and again until the server replies with something (success or failure)
    const [intialLoadComplete, setIntialLoadComplete] = useState(false) // this check whether the initial api call has finished
    const [baseURL, setBaseURL] = useState('')

    const { toast } = useToast();

    const { data: session, status } = useSession()
    const username = session?.user.username

    useEffect(() => {
        // Only run on the client side
        setBaseURL(`${window.location.protocol}//${window.location.host}`) // http://localhost3000
    }, [])

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
            description: "Profile URL has been copied to clipboard",
        })
    }

    const { register, watch, setValue } = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false
        }
    })

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((eachVal) => eachVal._id !== messageId))
    }

    const acceptMessages = watch('acceptMessages')

    const fetchNewMessages = async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(true)

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
            setIsSwitchLoading(false)
        }
    }

    const Check_Whether_User_Has_Enabled_Fetching_Messages = async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessages)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
              title: 'Error',
              description: axiosError.response?.data.message || 'Failed to fetch message settings',
              variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false)
            setIntialLoadComplete(true)
        }
    }

    useEffect(() => {
        if(!session || !session.user) return // if there is no user, do not do anything
        // if the user is logged in, first check if the user has enabled for fetching new messages, then fetch new messages
        Check_Whether_User_Has_Enabled_Fetching_Messages()
        fetchNewMessages()

    }, [session])

    const handleSwitchToggle = async () => {
        setIsSwitchLoading(true)

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
            setIsSwitchLoading(false)
        }
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-slate-900 rounded w-full max-w-6xl text-white">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileURL}
                        disabled
                        className="input input-bordered w-full p-2 mr-2 shadow-lg rounded-md bg-white text-black"
                    />
                    <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                        onClick={() => copyToClipboard()}>Copy
                    </Button>
                </div>
            </div>

            {intialLoadComplete && (
                <div className="mb-4">
                    <Switch
                        {...register('acceptMessages')}
                        checked={acceptMessages}
                        disabled={isSwitchLoading}
                        onCheckedChange={() => handleSwitchToggle()}
                        className="border-2 border-white"
                        />
                    <span className="ml-2">
                        Accpetance Message: {acceptMessages ? "On" : "Off"}
                    </span>
                </div>
            )}

            <Button // this is the refresh button for refreshing fetch new messages
                className="mt-4 bg-teal-800 border-none hover:bg-teal-900"
                variant='outline'
                onClick={(e) => {
                    e.preventDefault()
                    fetchNewMessages(true)
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                    <RefreshCcw className="h-4 w-4 text-white" />
                ) }
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
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

export default Page;