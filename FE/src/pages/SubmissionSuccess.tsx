
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { FadeIn, ScaleIn } from '@/components/ui/motion';
import { CheckCircle2, ArrowLeft, Mail, Calendar } from 'lucide-react';

const SubmissionSuccess = () => {
  const navigate = useNavigate();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <ScaleIn>
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-green-500" size={36} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Project Request Received!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Thank you for your interest in working with us. We've received your project details and will be in touch soon.
              </p>
            </div>
          </ScaleIn>
          
          <FadeIn delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">What happens next?</h2>
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium">Review</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Our team will review your project details and prepare a preliminary assessment.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium">Initial Contact</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      A project specialist will contact you within 1-2 business days to discuss your project in more detail.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium">Proposal</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We'll prepare a detailed proposal including timeline, budget, and project specifications.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-medium">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium">Project Kickoff</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Once the proposal is approved, we'll schedule a kickoff meeting and begin work on your project.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </FadeIn>
          
          <FadeIn delay={300}>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start gap-3">
                  <Mail className="text-blue-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium mb-1">Email Us Directly</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Have questions? Reach out to us at <a href="mailto:contact@geniusdev.com" className="text-blue-500 hover:underline">contact@geniusdev.com</a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start gap-3">
                  <Calendar className="text-blue-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-medium mb-1">Schedule a Call</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Want to talk sooner? <a href="#" className="text-blue-500 hover:underline">Book a consultation</a> with one of our experts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="button-secondary flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmissionSuccess;
