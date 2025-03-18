
import { Layout } from '@/components/common/Layout';
import { team, faqs } from '@/lib/data';
import { FadeIn, SlideUp, ScaleIn } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Instagram, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AboutPage = () => {
  const socialIcons = {
    github: <Github className="h-5 w-5" />,
    linkedin: <Linkedin className="h-5 w-5" />,
    twitter: <Twitter className="h-5 w-5" />,
    dribbble: <Instagram className="h-5 w-5" />
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About GeniusDev</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We're a team of passionate developers, designers, and strategists dedicated to creating innovative digital experiences.
            </p>
          </div>
        </FadeIn>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <SlideUp>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                At GeniusDev, our mission is to empower businesses through technology. We believe in creating solutions that not only meet current needs but are built to evolve with your business.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We strive to be more than just developers – we're partners in your digital journey, committed to your long-term success.
              </p>
            </div>
          </SlideUp>
          <SlideUp delay={200}>
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <ul className="space-y-3">
                {['Innovation', 'Quality', 'Collaboration', 'Integrity', 'Continuous Learning'].map((value, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{value}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {idx === 0 && "We embrace new technologies and creative solutions."}
                        {idx === 1 && "We never compromise on the quality of our deliverables."}
                        {idx === 2 && "We believe in transparent and open communication."}
                        {idx === 3 && "We build relationships based on trust and honesty."}
                        {idx === 4 && "We continuously upgrade our skills and knowledge."}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </SlideUp>
        </div>

        {/* Team Section */}
        <FadeIn className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <ScaleIn key={member.id} delay={index * 100}>
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-48 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-blue-500 dark:text-blue-400 text-sm mb-3">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{member.bio}</p>
                    <div className="flex space-x-3">
                      {Object.entries(member.social).map(([platform, url]) => (
                        <a 
                          key={platform} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          {socialIcons[platform as keyof typeof socialIcons]}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </ScaleIn>
            ))}
          </div>
        </FadeIn>

        {/* FAQ Section */}
        <FadeIn className="mb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-2">
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-10 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's collaborate to build something amazing together. Reach out to discuss your project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" variant="outline" className="px-8">
                Contact Us
              </Button>
            </Link>
            <Link to="/form">
              <Button size="lg" className="px-8">
                Start a Project <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </Layout>
  );
};

export default AboutPage;
