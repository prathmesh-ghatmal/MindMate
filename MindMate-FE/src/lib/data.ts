// Centralized data management - all dynamic data for easy backend integration

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: Date
  streak: number
}

export interface MoodEntry {
  id: string
  mood: number
  date: Date
  note?: string
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  mood: { emoji: string; value: number }
  date: Date
  tags: string[]
}

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export interface Resource {
  id: string
  title: string
  description: string
  type: string
  duration: string
  url: string
  category: string
}

// Mock data - to be replaced with backend integration
export const mockUser: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  streak: 7,
}

    export const mockMoodHistory: MoodEntry[] = [
      { id: "1dlnmbngnbklgfmmnkl bfm",  mood: 1, date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { id: "2 ,mcmmc,m mm,",  mood: 5, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { id: "3 c,mm,mcm,,m",  mood: 3, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { id: "4 ,.cv ,mm",  mood: 4, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { id: "5 .c.m,mc",  mood: 2, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { id: "6 cm,, cb",  mood: 4, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { id: "7x,nmnbkjjk",  mood: 5, date: new Date() },
    ]

export const landingPageContent = {
  hero: {
    title: "Your Wellbeing Companion",
    subtitle:
      "A safe, supportive space to track your mood, express your thoughts, and nurture your mental health journey with AI-powered companionship.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "Learn More",
  },
  features: [
    {
      icon: "Heart",
      title: "Mood Tracking",
      description: "Track your daily emotions and discover patterns in your wellbeing journey.",
    },
    {
      icon: "Sparkles",
      title: "AI Companion",
      description: "Chat with your supportive AI companion whenever you need someone to listen.",
    },
    {
      icon: "Shield",
      title: "Safe Space",
      description: "Your thoughts and feelings are private and secure in your personal sanctuary.",
    },
    {
      icon: "Users",
      title: "Community",
      description: "Connect with resources and tools designed by mental health professionals.",
    },
  ],
  testimonials: [
    {
      name: "Sarah M.",
      text: "MindMate has become my daily companion. It helps me understand my emotions better.",
      rating: 5,
    },
    {
      name: "Alex K.",
      text: "The mood tracking feature helped me identify triggers I never noticed before.",
      rating: 5,
    },
    {
      name: "Jamie L.",
      text: "Having a safe space to express my thoughts has been incredibly healing.",
      rating: 5,
    },
  ],
}

export const journalPrompts = [
  "What made you smile today?",
  "What are you grateful for right now?",
  "How did you take care of yourself today?",
  "What's one thing you learned about yourself?",
  "What would you tell a friend who's having a tough day?",
  "What's something you're looking forward to?",
]

export const botResponses = [
  "I hear you. It's completely normal to feel that way. Can you tell me more about what's on your mind?",
  "Thank you for sharing that with me. Your feelings are valid. What would help you feel better right now?",
  "That sounds challenging. Remember, you're not alone in this. What's one small thing that usually brings you comfort?",
  "I appreciate you opening up. It takes courage to share your feelings. How can I best support you today?",
  "Your wellbeing matters. What you're experiencing is important. Would you like to explore some coping strategies together?",
]
