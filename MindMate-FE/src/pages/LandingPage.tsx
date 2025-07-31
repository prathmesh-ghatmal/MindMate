import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/auth-modal"; // Adjust path if needed

const features = [
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Track your daily emotions and discover patterns in your wellbeing journey.",
  },
  {
    icon: Sparkles,
    title: "AI Companion",
    description: "Chat with your supportive AI companion whenever you need someone to listen.",
  },
  {
    icon: Shield,
    title: "Safe Space",
    description: "Your thoughts and feelings are private and secure in your personal sanctuary.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with resources and tools designed by mental health professionals.",
  },
];

const testimonials = [
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
];

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const handleGetStarted = () => {
    setAuthMode("signup");
    setShowAuth(true);
  };

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-teal-50">
      {/* Header */}
  
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-6 flex justify-between items-center"
      >
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-pink-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            MindMate
          </span>
        </div>
        <Button variant="outline" onClick={handleLogin}>
          Sign In
        </Button>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="relative mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 text-pink-300"
            >
              <Heart className="h-12 w-12" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-2 -right-8 text-teal-300"
            >
              <Heart className="h-8 w-8" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Your Wellbeing
              <br />
              Companion
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            A safe, supportive space to track your mood, express your thoughts, and nurture your mental health journey
            with AI-powered companionship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full"
              onClick={handleGetStarted}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full bg-transparent"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Everything you need for your wellbeing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thoughtfully designed features to support your mental health journey
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <feature.icon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Loved by thousands</h2>
          <p className="text-xl text-gray-600">See how MindMate is helping people on their wellbeing journey</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 text-pink-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-800">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Start your wellbeing journey today</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands who have found peace and support with MindMate</p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full"
            onClick={handleGetStarted}
          >
            Get Started Free
          </Button>
        </motion.div>
      </section>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} mode={authMode} onModeChange={setAuthMode} />
    </div>
  );
};

export default LandingPage;
