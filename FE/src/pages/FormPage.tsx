
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { ProjectTypeSelector } from '@/components/lead-form/ProjectTypeSelector';
import { MultiStepForm } from '@/components/lead-form/MultiStepForm';
import { FadeIn } from '@/components/ui/motion';

const FormPage = () => {
  const [searchParams] = useSearchParams();
  const projectType = searchParams.get('type');
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full text-sm font-medium mb-3">
              Let's Work Together
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {projectType ? 'Tell Us About Your Project' : 'Start Your Project'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {projectType 
                ? 'Fill out the form below to help us understand your project needs.'
                : 'Select the type of project you want to build with us.'}
            </p>
          </div>
        </FadeIn>
        
        {projectType ? <MultiStepForm /> : <ProjectTypeSelector />}
      </div>
    </Layout>
  );
};

export default FormPage;
