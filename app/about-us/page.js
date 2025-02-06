'use client'
import { useState } from 'react'
import { 
  Users, 
  Target, 
  Award, 
  Briefcase, 
  BookOpen, 
  Rocket 
} from 'lucide-react'

const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('mission')

  const tabContent = {
    mission: {
      icon: <Target className="mr-2 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <h1 className="text-base md:text-lg font-extrabold">Why Enroll in Clubs and Chapters at VIT? Unlock Your Potential with VIT's Clubs & Chapters</h1>
          <p className="text-base md:text-lg">VIT offers a vibrant array of clubs and chapters, each fostering a unique learning environment designed to empower students, help them grow, and enhance their skills in various domains. Whether you are interested in technology, business, creativity, or leadership, there's a club that will help you nurture your interests and make a real impact.
          </p>
          <h1 className="text-base md:text-lg font-extrabold">What Are Clubs and Chapters at VIT?</h1>          
          <p className="text-base md:text-lg">Clubs and chapters at VIT are student-led organizations that bring together like-minded individuals to engage in activities, workshops, events, and projects. These clubs provide a platform for students to explore new interests, collaborate on innovative ideas, and participate in real-world challenges. With a wide variety of clubs to choose from, VIT students can become part of vibrant communities that cater to their passions, career aspirations, and personal development.
</p>
          <h1 className="text-base md:text-lg font-extrabold">Skills You’ll Gain by Actively Participating
Leadership Skills
</h1> <p className="text-base md:text-lg">Active participation in clubs provides opportunities to take on leadership roles, where you can develop essential skills like team management, decision-making, and conflict resolution. Leading projects or teams will help you become a confident and responsible leader.
</p>
<br/>
<p className="text-base md:text-lg">Collaboration and Teamwork
Working with peers from different backgrounds on collaborative projects will help you build strong teamwork skills. You will learn how to delegate tasks, communicate effectively, and work toward a common goal.
</p>
<p className="text-base md:text-lg">Communication and Public Speaking
Whether presenting ideas in club meetings, leading events, or participating in discussions, clubs give you ample opportunities to hone your communication skills. Public speaking, persuasive communication, and active listening are all crucial skills developed through regular interaction.
</p>
<p className="text-base md:text-lg">Problem-Solving and Critical Thinking
Clubs often involve tackling real-world problems, whether through hackathons, competitions, or community service projects. You'll learn how to approach challenges creatively, analyze situations, and devise effective solutions.

</p>
          <h1 className="text-base md:text-lg font-extrabold">Technical Expertise
          </h1>
          <p className="text-base md:text-lg">For those involved in technical clubs, you will gain hands-on experience with industry-standard tools, programming languages, and technologies. Whether it’s coding, designing, or working with hardware, you'll become proficient in skills that will give you a competitive edge in your future career.
          </p>
          <h1 className="text-base md:text-lg font-extrabold">Event Planning and Management

          </h1>
          <p className="text-base md:text-lg">Many clubs organize workshops, seminars, and events that provide opportunities to develop event management skills. From logistics to budgeting, hosting an event will teach you to manage multiple tasks while ensuring everything runs smoothly.

</p>
          <h1 className="text-base md:text-lg font-extrabold">Networking Opportunities

          </h1>
          <p className="text-base md:text-lg">Clubs offer a great platform to network with professionals, alumni, and industry experts. Through events, guest lectures, and collaborations with other institutions, you can build valuable connections that will help you in your career journey.
          </p>
          <h1 className="text-base md:text-lg font-extrabold">Creativity and Innovation

          </h1>
          <p className="text-base md:text-lg">Clubs encourage you to think outside the box and come up with innovative ideas. Whether it’s designing a new product, solving a societal problem, or organizing a creative event, you'll be pushed to think creatively and explore new possibilities.
          </p>
          <br></br>
          Enroll Today and Be Part of Something Big!
Joining a club at VIT is not just about gaining skills; it's about being part of a community of passionate, driven individuals who are eager to learn, innovate, and make a difference. Whether you’re looking to enhance your technical abilities, develop leadership skills, or explore new interests, VIT's clubs and chapters offer you the resources, mentorship, and opportunities to take your personal and professional growth to the next level.
          </div>
      )
    }
  }

  const coreValues = [
    {
      icon: <Award className="w-12 h-12 text-indigo-600 mb-4" />,
      title: "Continuous Learning",
      description: "Always striving to improve and provide better tools for growth."
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-600 mb-4" />,
      title: "Empowerment",
      description: "Supporting individuals in building confidence and achieving professional success."
    },
    {
      icon: <Briefcase className="w-12 h-12 text-indigo-600 mb-4" />,
      title: "Excellence",
      description: "Delivering high-quality, impactful features to simplify interview preparation."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
            About NextGen Recruiter
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 px-4">
            Ace interviews through intelligent, personalized AI
          </p>
        </div>

        {/* Tabs Section */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 sm:mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row border-b">
            {Object.keys(tabContent).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full sm:flex-1 py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center 
                  ${activeTab === tab 
                    ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {tabContent[tab].icon}
                <span className="hidden sm:inline">
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            {tabContent[activeTab].content}
          </div>
        </div>

        {/* Values Section */}
        
      </div>
    </div>
  )
}

export default AboutUsPage