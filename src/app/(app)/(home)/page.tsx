import { Button } from "@/components/ui/button"
import { Calendar, List } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b relative -mt-[88px] pt-[88px] from-blue-100 to-white">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-normal font-fredericka text-gray-900 mb-6">
            Organize Your Life with TodoMaster
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Boost your productivity and never miss a task again. TodoMaster helps you manage your todos effortlessly.
          </p>
          <Button className='drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]' asChild size="lg">
            <Link href="/sign-up">Get Started for Free</Link>
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard 
            icon={<List className="h-12 w-12 text-blue-600" />}
            title="Organize Tasks"
            description="Create and manage your todo lists with ease. Categorize and prioritize your tasks effortlessly."
          />
          <FeatureCard 
            icon={<Calendar className="h-12 w-12 text-blue-600" />}
            title="Plan Ahead"
            description="Plan your days, weeks, and months in advance. Stay on top of your schedule and achieve your goals."
          />
          <FeatureCard 
            icon={<Calendar className="h-12 w-12 text-blue-600" />}
            title="Plan Ahead"
            description="Plan your days, weeks, and months in advance. Stay on top of your schedule and achieve your goals."
          />
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Get Things Done?
          </h2>
          <Button className='drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]' asChild size="lg">
            <Link href="/sign-up">Start Organizing Today</Link>
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className='relative w-10 h-10'>
                <Image className='object-cover' src='/logo.svg' alt='logo' fill />
              </div>
              <span className="text-xl font-bold text-gray-900">Taskify</span>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li><Link href="#" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
              </ul>
            </nav>
          </div>
          <div className="mt-4 text-center text-gray-600">
            © 2024 Taskify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}