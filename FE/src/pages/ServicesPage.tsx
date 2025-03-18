
import { Layout } from '@/components/common/Layout';
import { services, testimonials } from '@/lib/data';
import { FadeIn, SlideUp } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We provide comprehensive development solutions tailored to your unique business needs. From web and mobile applications to AI integration and cloud services.
            </p>
          </div>
        </FadeIn>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <SlideUp key={service.id} delay={index * 100}>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-auto">
                  Learn More
                </Button>
              </div>
            </SlideUp>
          ))}
        </div>

        {/* CTA Section */}
        <FadeIn className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-10 text-center max-w-4xl mx-auto my-20">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help bring your vision to life with our expertise in development and design.
          </p>
          <Link to="/form">
            <Button size="lg" className="px-8">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </FadeIn>

        {/* Testimonials */}
        <div className="mb-16">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <SlideUp key={testimonial.id} delay={index * 100}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                  <p className="italic mb-4 text-gray-600 dark:text-gray-300">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage;
