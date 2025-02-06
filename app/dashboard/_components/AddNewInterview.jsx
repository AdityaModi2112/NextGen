"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/GeminiAIModal";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle, Sparkles } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
const CLUB_SUGGESTIONS = [
  'Club A',
  'Club B',
  'Club C',
  'Club D',
  'Club E'
];
// Job Role Suggestions
const JOB_ROLE_SUGGESTIONS = [
  
  'Management Member',
  'Frontend Developer',
  'Backend Developer',
  'Research Member',
  'Competitive Coder',
  'Events Manager',
  'Python Devleoper',
  'Java Developer'

];


const TECH_STACK_SUGGESTIONS = {
  'Management Member': ['Notion, Trello, Slack, Google Workspace, Microsoft Excel', 'Management skills', 'Teamwork', 'Crisis management'],
  'Frontend Developer': ['React', 'HTML', 'Angular', 'TypeScript', 'Tailwind CSS'],
  'Backend Developer': ['Node.js', 'Express', 'Python (Django, Flask)', 'Java (Spring Boot)', 'PostgreSQL'],
  'Research Member': ['Python', 'Jupyter Notebook', 'LaTeX', 'TensorFlow', 'PyTorch', 'Scikit-learn'],
  'Competitive Coder': ['C++', 'Python', 'Java', 'Data Structures & Algorithms', 'Codeforces', 'LeetCode'],
  'Events Manager': ['Teamwork', 'Organising events', 'Google Workspace', 'Sponsorships', 'Canva', 'Marketing'],
  'Python Developer': ['Python', 'Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas'],
  'Java Developer': ['Java', 'Spring Boot', 'Hibernate', 'Maven', 'PostgreSQL']
};

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [club, setClub] = useState("");

  // Auto-suggest tech stack based on job role
  const autoSuggestTechStack = (role) => {
    const suggestion = TECH_STACK_SUGGESTIONS[role];
    if (suggestion) {
      setJobDescription(suggestion);
      toast.info(`Auto-filled tech stack for ${role}`);
    }
  };

  
const onSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const inputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}, Club: ${club}.
  Generate 5 beginner friendly interview questions and answers related to the club name, position and job description for college students in JSON format.`;

  try {
    const result = await chatSession.sendMessage(inputPrompt);
    const responseText = await result.response.text();
    
    const cleanedResponse = responseText.replace(/```json\n?|```/g, '').trim();
    
    const mockResponse = JSON.parse(cleanedResponse);
    
    const res = await db.insert(MockInterview)
      .values({
        mockId: uuidv4(),
        jsonMockResp: JSON.stringify(mockResponse),
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: jobExperience,
        club: club, // Add the club here
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      }).returning({ mockId: MockInterview.mockId });
    
    toast.success('Interview questions generated successfully!');
    router.push(`dashboard/interview/${res[0]?.mockId}`);
  } catch (error) {
    console.error("Error generating interview:", error);
    toast.error('Failed to generate interview questions.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className="font-bold text-lg text-center">+ Add New</h1>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Create Your Club's Interview
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <div className="mt-7 my-3">
                  <label>Domain</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      value={jobPosition}
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                      list="jobRoles"
                    />
                    <datalist id="jobRoles">
                      {JOB_ROLE_SUGGESTIONS.map(role => (
                        <option key={role} value={role} />
                      ))}
                    </datalist>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => autoSuggestTechStack(jobPosition)}
                      disabled={!jobPosition}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="my-3">
                  <label>Skill Set/Tech Stack</label>
                  <Textarea
                    placeholder="Ex. React, Angular, NodeJs, MySql etc"
                    value={jobDescription}
                    required
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label>Years of Experience</label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    min="0"
                    max="70"
                    value={jobExperience}
                    required
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
                <div className="my-3">
  <label>Club</label>
  <select
    value={club}
    required
    onChange={(e) => setClub(e.target.value)}
    className="w-full p-2 border rounded-lg"
  >
    <option value="">Select a club</option>
    {CLUB_SUGGESTIONS.map(club => (
      <option key={club} value={club}>{club}</option>
    ))}
  </select>
</div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" /> Generating
                    </>
                  ) : (
                    'Start Interview'
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;