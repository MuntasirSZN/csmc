import type { Metadata } from 'next'
import HomePageCarousel from '@/components/home-page-carousel'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  ChevronRight,
  CircleHelp,
  Info,
  Puzzle,
  Trophy,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Meet a new range of thinking with mathematics',
}

export default function Home() {
  const announcements = [
    {
      id: 1,
      title: 'CSMC Math Hunt Successfully held!',
      description: 'The first ever contest organized by Collegiate School Math Club has been successfully conducted.',
      link: '/contests',
      icon: 'Trophy',
      date: 'April 20, 2025',
    },
    {
      id: 2,
      title: 'New Practice Sets Available',
      description: 'We\'ve added new practice sets to help you prepare for upcoming competitions.',
      link: '/practices',
      icon: 'BookOpen',
      date: 'April 15, 2025',
    },
  ]

  const faqItems = [
    {
      id: 'item-1',
      question: 'What is the purpose of Collegiate School Math Club?',
      answer: 'Collegiate School Math Club is a club that is dedicated to serve the students with quality and knowledge for all. The club is open to all students in the school. The club is aimed to help students to enhance their mathematical skills and knowledge. Also, the club helps the students to know about and participate various contests and competitions on mathematics organized Nationally or Internationally.',
    },
    {
      id: 'item-2',
      question: 'What is the fee purchased for joining?',
      answer: 'Collegiate School Math Club club is dedicated to serve the students with quality and knowledge for all. So that, to ensure everyone can join the club without any hesitation. Collegiate School Math Club requires very low registration fee of only ৳50.',
    },
    {
      id: 'item-3',
      question: 'Do I need to be good at math to join?',
      answer: 'Not at all! The Math Club welcomes students of all skill levels. Our goal is to foster a love for mathematics and help everyone improve their skills in a supportive environment.',
    },
    {
      id: 'item-4',
      question: 'How do the practice contests work?',
      answer: 'Practice contests are available online through our website. You must complete them in sequential order, and each contest has a time limit. Once you start a contest, you must complete it before moving to the next one.',
    },
    {
      id: 'item-5',
      question: 'How can I prepare for math competitions?',
      answer: 'We recommend starting with our practice contests and attending problem-solving sessions.',
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* Hero Section with Background Gradient */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 px-4">
          <div className="w-32 h-32 relative animate-pulse">
            <Image
              src="/CSMC.gif"
              alt="Collegiate School Math Club Logo"
              fill
              className="object-contain"
              priority
              unoptimized={true}
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent">
            Collegiate School Math Club
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Meet a new range of thinking with mathematics
          </p>
          <Badge className="mt-8 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 text-lg font-medium">
            <Trophy className="mr-2" size={20} />
            Our latest contest: CSMC Math Hunt
          </Badge>
        </div>
      </section>

      {/* Carousel Section with Navigation Controls */}
      <section className="w-full max-w-5xl my-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold inline-flex items-center">
            <Trophy className="mr-2 text-primary" size={28} />
            Contest Highlights
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0 cursor-pointer" id="carousel-prev">
              <ChevronRight className="rotate-180" size={16} />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0 cursor-pointer" id="carousel-next">
              <ChevronRight size={16} />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
        </div>
        <HomePageCarousel />
      </section>

      {/* Contest Categories Section */}
      <section className="w-full max-w-6xl my-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 inline-flex items-center justify-center w-full">
          <Puzzle className="mr-2 text-primary" size={28} />
          Contest Categories
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          We offer competitions for various age groups and skill levels to ensure everyone can participate and grow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Primary Category */}
          <Card className="flex flex-col overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
              <CardTitle className="text-center flex items-center justify-center">
                <Info className="mr-2 text-blue-500" size={24} />
                Primary
              </CardTitle>
              <CardDescription className="text-center">For students in Class 5-6</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <p className="text-center">
                Introduction to mathematical concepts and problem-solving techniques appropriate for this age group.
              </p>
            </CardContent>
          </Card>

          {/* Junior Category */}
          <Card className="flex flex-col overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
            <CardHeader className="bg-green-50 dark:bg-green-900/20">
              <CardTitle className="text-center flex items-center justify-center">
                <BookOpen className="mr-2 text-green-500" size={24} />
                Junior
              </CardTitle>
              <CardDescription className="text-center">For students in Class 7-8</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <p className="text-center">
                Building on foundational knowledge with pre-algebra, basic geometry, and logical reasoning.
              </p>
            </CardContent>
          </Card>

          {/* Senior Category */}
          <Card className="flex flex-col overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
            <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
              <CardTitle className="text-center flex items-center justify-center">
                <Award className="mr-2 text-purple-500" size={24} />
                Senior
              </CardTitle>
              <CardDescription className="text-center">For students in Class 9-10</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-6">
              <p className="text-center">
                Advanced topics including algebra, geometry, combinatorics, and number theory.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gradient-to-b from-muted/50 to-background py-16 my-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 inline-flex items-center justify-center w-full">
            <Brain className="mr-2 text-primary" size={28} />
            What We Offer
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join our community and unlock your mathematical potential with our comprehensive features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Competitions Feature */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300 shadow-md">
                <Trophy className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-all duration-300">Contests</h3>
              <p className="text-muted-foreground">
                Participate in exciting math contests and challenge yourself against peers from different schools.
              </p>
              <Link href="/contests">
                <Button variant="link" className="mt-4 text-primary cursor-pointer">
                  View Contests
                  <ChevronRight className="ml-1" size={16} />
                </Button>
              </Link>
            </div>

            {/* Practice Feature */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300 shadow-md">
                <BookOpen className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-all duration-300">Practice</h3>
              <p className="text-muted-foreground">
                Improve your skills with our structured practice problems and contests designed by experienced educators.
              </p>
              <Link href="/practices">
                <Button variant="link" className="mt-4 text-primary cursor-pointer">
                  Start Practicing
                  <ChevronRight className="ml-1" size={16} />
                </Button>
              </Link>
            </div>

            {/* Community Feature */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300 shadow-md">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-all duration-300">Community</h3>
              <p className="text-muted-foreground">
                Join a community of math enthusiasts, learn together, and build lasting friendships with like-minded peers.
              </p>
              <Link href="https://www.facebook.com/collegiateschoolmathclub">
                <Button variant="link" className="mt-4 text-primary cursor-pointer">
                  Join Community
                  <ChevronRight className="ml-1" size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="w-full max-w-6xl my-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 inline-flex items-center justify-center w-full">
          <Award className="mr-2 text-primary" size={28} />
          Latest Announcements
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Stay updated with the latest news and events from our club.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {announcements.map(announcement => (
            <Card key={announcement.id} className="flex flex-col overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gradient-to-r from-primary to-purple-600 h-2"></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    {announcement.icon === 'Trophy'
                      ? (
                          <Trophy className="mr-2 text-primary" size={20} />
                        )
                      : (
                          <BookOpen className="mr-2 text-primary" size={20} />
                        )}
                    {announcement.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-normal">
                    {announcement.date}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2 pb-4">
                <p className="text-muted-foreground">{announcement.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" asChild className="px-0 group-hover:text-primary transition-colors duration-300">
                  <Link href={announcement.link} className="flex items-center">
                    Learn More
                    <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section with Updated Design */}
      <section className="w-full max-w-4xl my-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 inline-flex items-center justify-center w-full">
          <CircleHelp className="mr-2 text-primary" size={28} />
          Frequently Asked Questions
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
          Find answers to common questions about our math club and activities.
        </p>
        <div className="rounded-xl shadow-lg p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map(faq => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-muted last:border-0">
                <AccordionTrigger className="text-left hover:text-primary transition-colors duration-300 py-4">
                  <div className="flex items-center">
                    <CircleHelp className="mr-2 text-primary" size={20} />
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  )
}
