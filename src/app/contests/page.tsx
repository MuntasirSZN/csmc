'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Contest {
  id: number
  title: string
  date: string
  time: string
  location: string
  description: string
  status: 'upcoming' | 'running' | 'completed'
}

interface ContestsData {
  upcoming: Contest[]
  running: Contest[]
  past: Contest[]
}

export default function ContestsPage() {
  const contestsData: ContestsData = {
    upcoming: [
      /*
      {
        id: 1,
        title: "Spring Mathematics Olympiad",
        date: "May 15, 2025",
        time: "10:00 AM - 1:00 PM",
        location: "Main Auditorium",
        description: "Our annual Spring Mathematics Olympiad features challenging problems across algebra, geometry, number theory, and combinatorics.",
        status: "upcoming"
      },
      {
        id: 2,
        title: "Collegiate Team Challenge",
        date: "June 5, 2025",
        time: "9:00 AM - 12:00 PM",
        location: "Mathematics Department",
        description: "A team-based competition where groups of 3 students work together to solve complex mathematical problems.",
        status: "upcoming"
      }
      */
    ],
    running: [
      /*
      {
        id: 3,
        title: "Monthly Problem Set Challenge",
        date: "April 1-30, 2025",
        time: "Submission deadline: April 30, 11:59 PM",
        location: "Online",
        description: "Work on a set of challenging problems throughout the month and submit your solutions by the deadline.",
        status: "running"
      }
      */
    ],
    past: [
      {
        id: 4,
        title: 'CSMC Math Hunt',
        date: 'April 19, 2025',
        time: '10:00 AM - 3:40 PM',
        location: 'Chattogram Collegiate School ICT Auditorium',
        description: 'The first ever contest organized by the Collegiate School Math Club.',
        status: 'completed',
      },
      /*
      {
        id: 5,
        title: "Freshman Mathematics Tournament",
        date: "November 15, 2024",
        time: "9:00 AM - 12:00 PM",
        location: "Mathematics Department",
        description: "A competition designed specifically for freshmen to introduce them to competitive mathematics.",
        status: "completed"
      }
      */
    ],
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 pt-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Mathematics Contests</h1>
        <p className="text-gray-600 text-lg">
          Explore our upcoming, running, and past mathematics competitions.
        </p>
      </div>

      {/* Upcoming Contests Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Upcoming Contests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contestsData.upcoming.length > 0
            ? (
                contestsData.upcoming.map(contest => (
                  <ContestCard key={contest.id} contest={contest} />
                ))
              )
            : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No upcoming contests at the moment.
                </div>
              )}
        </div>
      </section>

      {/* Running Contests Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Running Contests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contestsData.running.length > 0
            ? (
                contestsData.running.map(contest => (
                  <ContestCard key={contest.id} contest={contest} />
                ))
              )
            : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No contests currently running.
                </div>
              )}
        </div>
      </section>

      {/* Past Contests Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Past Contests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contestsData.past.length > 0
            ? (
                contestsData.past.map(contest => (
                  <ContestCard key={contest.id} contest={contest} />
                ))
              )
            : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No past contests to display.
                </div>
              )}
        </div>
      </section>
    </div>
  )
}

interface ContestCardProps {
  contest: Contest
}

function ContestCard({ contest }: ContestCardProps) {
  const getBadgeStyles = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'running':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'completed':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming'
      case 'running':
        return 'Running'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  return (
    <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="relative">
        <Badge
          className={`absolute top-0 right-0 mt-4 mr-4 font-medium capitalize ${getBadgeStyles(contest.status)}`}
        >
          {getStatusText(contest.status)}
        </Badge>
        <CardTitle className="text-xl">{contest.title}</CardTitle>
        <CardDescription className="text-sm">
          <div className="mt-1">
            <strong>Date:</strong>
            {' '}
            {contest.date}
          </div>
          <div className="mt-1">
            <strong>Time:</strong>
            {' '}
            {contest.time}
          </div>
          <div className="mt-1">
            <strong>Location:</strong>
            {' '}
            {contest.location}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-700">{contest.description}</p>
      </CardContent>
      {contest.status !== 'completed' && (
        <CardFooter className="flex justify-end gap-2 pt-2">
          {contest.status === 'upcoming' && (
            <>
              <Button variant="outline" size="sm">Details</Button>
              <Button size="sm">Register</Button>
            </>
          )}
          {contest.status === 'running' && (
            <>
              <Button variant="outline" size="sm">View Problems</Button>
              <Button size="sm">Participate</Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
