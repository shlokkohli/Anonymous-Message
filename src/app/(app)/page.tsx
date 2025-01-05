'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay';
import messages from "@/messages.json"

function page() {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-900 
    min-h-[calc(100vh-85px)] text-white'>

      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-black mx-auto'>
          Dive into the World of Anonymous Feedback
        </h1>
        <p className='mt-3 md:mt-4 text-base md:text-xl font-bold'>
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 2000})]}
        className="w-full max-w-xs text-slate-900">
      <CarouselContent>
        {
          messages.map((message, index) => (
            <CarouselItem key={index}>
            <div className="p-1">
              <Card className="text-white bg-slate-700">
                <CardHeader className="font-medium text-center">
                  {message.title}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-2 text-center">
                  <span className="text-lg font-semibold">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      </Carousel>

    </main>
  )
}

export default page
