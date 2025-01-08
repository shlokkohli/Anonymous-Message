'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import messages from "@/messages.json"
import { Mail } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion } from "framer-motion";
import { Highlight } from "@/components/ui/hero-highlight";

function page() {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-900 
    min-h-[calc(100vh-85px)] text-white'>

    <BackgroundBeams />

      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-black mx-auto'>
          Dive into the World of{' '}
          <Highlight className="text-white dark:text-dark">
          Anonymous Feedback
          </Highlight>
        </h1>
        <p className='mt-3 md:mt-4 text-base md:text-xl font-bold'>
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
    plugins={[Autoplay({ delay: 2000 })]}
    className="w-full max-w-xs text-slate-900"
    >
    <CarouselContent>
      {messages.map((message, index) => (
        <CarouselItem key={index}>
          <div className="p-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{message.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex aspect-square items-center justify-center">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <p>{message.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.received}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
    </main>
  )
}

export default page