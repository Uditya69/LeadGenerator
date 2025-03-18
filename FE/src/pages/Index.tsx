
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { FadeIn, ScaleIn, SlideUp } from '@/components/ui/motion';
import { ChevronRight, Star, Zap, BarChart3, Shield, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10" />
        
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <ScaleIn>
                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full text-sm font-medium mb-4">
                  Software Development Agency
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Transform Your <span className="text-blue-500">Ideas</span> Into Powerful Solutions
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  We build innovative, custom software solutions for businesses of all sizes. Our expert team will bring your vision to life with cutting-edge technology.
                </p>
              </ScaleIn>
              
              <FadeIn delay={200}>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => navigate('/form')}
                    className="button-primary flex items-center gap-2 text-lg"
                  >
                    Start Your Project <ChevronRight size={20} />
                  </button>
                  <button className="button-secondary text-lg">Our Services</button>
                </div>
                
                <div className="flex items-center gap-4 mt-8">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        <span className="text-sm font-medium">{i}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Star className="text-yellow-400" size={16} />
                    <Star className="text-yellow-400" size={16} />
                    <Star className="text-yellow-400" size={16} />
                    <Star className="text-yellow-400" size={16} />
                    <Star className="text-yellow-400" size={16} />
                    <span className="ml-1">Trusted by 100+ companies</span>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="lg:w-1/2">
              <SlideUp delay={300}>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-20 animate-pulse" />
                  <div className="relative glass rounded-xl overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Software Development" 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Projects Delivered</p>
                        <p className="text-2xl font-bold">250+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideUp>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <ScaleIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full text-sm font-medium mb-4">
                Our Approach
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Intelligent Solutions for Modern Challenges
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We combine cutting-edge technology with strategic thinking to deliver exceptional results for our clients.
              </p>
            </div>
          </ScaleIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SlideUp delay={100}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-blue-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Driven Development</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Leverage artificial intelligence to build smarter, more efficient applications that adapt to user needs.
                </p>
                <a href="#" className="text-blue-500 font-medium flex items-center gap-1 hover:underline">
                  Learn more <ChevronRight size={16} />
                </a>
              </div>
            </SlideUp>
            
            <SlideUp delay={200}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-green-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Data-Backed Decisions</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Use analytics and data insights to drive development decisions and optimize for performance.
                </p>
                <a href="#" className="text-blue-500 font-medium flex items-center gap-1 hover:underline">
                  Learn more <ChevronRight size={16} />
                </a>
              </div>
            </SlideUp>
            
            <SlideUp delay={300}>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-purple-500" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure By Design</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Build with security at the core, ensuring your applications are protected against modern threats.
                </p>
                <a href="#" className="text-blue-500 font-medium flex items-center gap-1 hover:underline">
                  Learn more <ChevronRight size={16} />
                </a>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent -z-10" />
            
            <div className="max-w-3xl">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Transform Your Digital Presence?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Whether you need a new website, mobile app, or enterprise software solution, our team is ready to bring your vision to life.
                </p>
                <button 
                  onClick={() => navigate('/form')}
                  className="button-primary flex items-center gap-2 text-lg"
                >
                  Start Your Project <ChevronRight size={20} />
                </button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
