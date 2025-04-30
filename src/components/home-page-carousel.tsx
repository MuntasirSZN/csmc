'use client'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'

export default function HomePageCarousel() {
  const carouselImages = [
    { src: '/contests/math-hunt/pic1.jpg', alt: 'Math Contest 1' },
    { src: '/contests/math-hunt/pic2.jpg', alt: 'Math Contest 2' },
    { src: '/contests/math-hunt/pic3.jpg', alt: 'Math Contest 3' },
    { src: '/contests/math-hunt/pic4.jpg', alt: 'Math Contest 4' },
    { src: '/contests/math-hunt/pic5.jpg', alt: 'Math Contest 5' },
    { src: '/contests/math-hunt/pic6.jpg', alt: 'Math Contest 6' },
    { src: '/contests/math-hunt/pic7.jpg', alt: 'Math Contest 7' },
    { src: '/contests/math-hunt/pic8.jpg', alt: 'Math Contest 8' },
    { src: '/contests/math-hunt/pic9.jpg', alt: 'Math Contest 9' },
    { src: '/contests/math-hunt/pic10.jpg', alt: 'Math Contest 10' },
    { src: '/contests/math-hunt/pic11.jpg', alt: 'Math Contest 11' },
  ]
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 5000,
        }),
        Fade({}),
      ]}
      opts={{
        loop: true,
        align: 'start',
      }}
      setApi={(api) => {
        setTimeout(() => {
          const prevButton = document.getElementById('carousel-prev')
          const nextButton = document.getElementById('carousel-next')
          if (prevButton && nextButton && api) {
            prevButton.addEventListener('click', () => api.scrollPrev())
            nextButton.addEventListener('click', () => api.scrollNext())
          }
        }, 100)
      }}
      className="w-full"
    >
      <CarouselContent>
        {carouselImages.map((image, index) => (
          <CarouselItem key={index} className="h-[450px] rounded-xl overflow-hidden">
            <div className="h-full w-full relative rounded-lg overflow-hidden shadow-xl">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold">Explore the World of Mathematics</h3>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
