/*
 * The /about page
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'About',
  description: 'The team behind the scenes at CSMC.',
}

export default function AboutPage() {
  const foundingTeamMembers = [
    {
      id: 1,
      name: 'Mohammad Anis Faruque',
      designation: 'Coordinator',
      image: '/members/Anis-Sir.png',
    },
    {
      id: 2,
      name: 'Ahnaf Tajwar',
      designation: 'Founding President',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 3,
      name: 'Nowazish Nur Kayef',
      designation: 'Founding General Secretary',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 4,
      name: 'Muntasir Mahmud',
      designation: 'Founding IT Director',
      image: '/members/Muntasir.png',
    },
    {
      id: 5,
      name: 'Sabit Rahman',
      designation: 'Founding Publicity Secretary',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 6,
      name: 'Nahian Al Rahman',
      designation: 'Founding Publicity Secretary',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 7,
      name: 'Sayed Mohammad Kaab',
      designation: 'Founding Executive Member',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 8,
      name: 'Syed Ahnaf Ahmad',
      designation: 'Founding Executive Member',
      image: '/members/Ahnaf.png',
    },
    {
      id: 9,
      name: 'Arvin Deb',
      designation: 'Founding Executive Member',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 10,
      name: 'Ayman Shafi',
      designation: 'Founding Executive Member',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 11,
      name: 'Jawadul Amin Nashit',
      designation: 'Founding Executive Member',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 12,
      name: 'Mumnoon Mohymin',
      designation: 'Founding Executive Member',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
    {
      id: 13,
      name: 'Md. Nazir Tiham',
      designation: 'Founding Executive Member',
      image: '/png-logos/android/mipmap-hdpi/logos.png',
    },
  ]

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
          About Collegiate School Math Club
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fostering mathematical excellence and problem-solving skills since 2024
        </p>
      </div>

      <Tabs defaultValue="mission" className="w-full max-w-4xl mx-auto mb-16">
        <TabsList className="grid grid-cols-3 mb-8 text-center">
          <TabsTrigger value="mission">Our Mission</TabsTrigger>
          <TabsTrigger value="history">Our History</TabsTrigger>
          <TabsTrigger value="founding-team">Founding Team</TabsTrigger>
        </TabsList>
        <TabsContent value="mission">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>What drives us every day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Collegiate School Math Club is dedicated to fostering a love for mathematics,
                developing problem-solving skills, and preparing students for mathematics competitions.
              </p>
              <p>
                We believe in creating an inclusive environment where students can explore
                mathematical concepts beyond the classroom curriculum.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Our History</CardTitle>
              <CardDescription>How we got started</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Established in 2024, the Collegiate School Math Club has grown from a small
                group of enthusiastic students to a vibrant community. Since our inception,
                we have been committed to excellence in mathematics education and promoting
                problem-solving skills among students.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="founding-team">
          <Card>
            <CardHeader>
              <CardTitle>Our Founding Team</CardTitle>
              <CardDescription>The visionaries behind our mission</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6">
                Our founding team consists of dedicated individuals who are passionate about
                mathematics education and creating opportunities for students to excel.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <AnimatedTooltip items={foundingTeamMembers} />
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Meet Our Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {foundingTeamMembers.map(member => (
                    <div key={member.id} className="flex items-center p-3 rounded-lg border">
                      <Image
                        src={member.image}
                        alt={member.name}
                        className="h-12 w-12 rounded-full mr-4 object-cover"
                        width="100"
                        height="100"
                      />
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.designation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-10" />

      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
        <p className="mb-8">
          Whether you're just starting your mathematical journey or you're already an
          accomplished problem solver, the Collegiate School Math Club welcomes you. Join us
          to enhance your skills, prepare for competitions, and connect with like-minded peers.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/sign-in">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium cursor-pointer">
              Join Now
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-md font-medium cursor-pointer">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
