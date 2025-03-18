import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, Loader2 } from 'lucide-react';
import { FormStepper } from './FormStepper';
import { AIFeedback } from './AIFeedback';
import { useToast } from '@/hooks/use-toast';
import { FadeIn, ScaleIn } from '../ui/motion';
import { createLead, uploadFile } from '@/lib/api';

// Define the schemas for each step
const basicInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().min(2, { message: "Company name is required" }),
  phone: z.string().optional(),
});

const projectDetailsSchema = z.object({
  projectType: z.string(),
  projectTitle: z.string().min(5, { message: "Project title is required" }),
  description: z.string().min(30, { message: "Please provide a detailed description (at least 30 characters)" }),
  timeline: z.string(),
  budget: z.string(),
});

const additionalInfoSchema = z.object({
  goals: z.string().min(15, { message: "Please describe your goals (minimum 15 characters)" }),
  targetAudience: z.string().optional(),
  specialRequirements: z.string().optional(),
  referralSource: z.string().optional(),
});

// Combine all schemas for final validation
const formSchema = basicInfoSchema.merge(projectDetailsSchema).merge(additionalInfoSchema);

type FormValues = z.infer<typeof formSchema>;

export function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { search } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create form with initial values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      projectType: "",
      projectTitle: "",
      description: "",
      timeline: "",
      budget: "",
      goals: "",
      targetAudience: "",
      specialRequirements: "",
      referralSource: "",
    },
  });
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, dirtyFields }, 
    getValues,
    setValue,
    trigger,
    watch
  } = form;
  
  // Extract project type from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(search);
    const projectType = params.get('type');
    
    if (projectType) {
      setValue('projectType', projectType);
    }
  }, [search, setValue]);
  
  // Define steps
  const steps = [
    "Basic Information",
    "Project Details",
    "Additional Info",
    "Review & Submit",
  ];
  
  // Form fields by step
  const stepFields = [
    ['name', 'email', 'company', 'phone'],
    ['projectType', 'projectTitle', 'description', 'timeline', 'budget'],
    ['goals', 'targetAudience', 'specialRequirements', 'referralSource']
  ];
  
  // Check if current step is valid
  const isStepValid = () => {
    const currentFields = stepFields[step];
    if (!currentFields) return true;
    
    const fieldsToValidate = Object.fromEntries(
      currentFields.map(field => [field, getValues(field as keyof FormValues)])
    );
    
    // Build validation schema for current step
    let stepSchema;
    if (step === 0) stepSchema = basicInfoSchema;
    else if (step === 1) stepSchema = projectDetailsSchema;
    else if (step === 2) stepSchema = additionalInfoSchema;
    else return true;
    
    try {
      stepSchema.parse(fieldsToValidate);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    setUploadingFile(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newFiles = Array.from(e.target.files || []);
      setFiles(prev => [...prev, ...newFiles]);
      setUploadingFile(false);
      
      toast({
        title: "Files uploaded",
        description: `${newFiles.length} file(s) uploaded successfully.`,
      });
    }, 1500);
  };
  
  // Remove file
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle form navigation
  const nextStep = async () => {
    const isCurrentStepValid = await trigger(stepFields[step] as any);
    
    if (!isCurrentStepValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/');
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create the lead
      const leadResponse = await createLead(data);
      
      if (!leadResponse.success) {
        throw new Error(leadResponse.error || 'Failed to create lead');
      }

      // Upload files if any
      if (files.length > 0) {
        const uploadPromises = files.map(file => 
          uploadFile(leadResponse.data.id, file)
        );
        
        await Promise.all(uploadPromises);
      }

      toast({
        title: "Success!",
        description: "Your project details have been submitted successfully.",
      });
      
      navigate('/success');
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // AI validation check
  const getFieldValidity = (fieldName: keyof FormValues): boolean => {
    const value = watch(fieldName) as string;
    if (!dirtyFields[fieldName] || !value) return true;
    
    if (fieldName === 'description' || fieldName === 'goals') {
      // More complex validation for text fields that need detailed content
      const words = value.trim().split(/\s+/);
      return words.length >= 7;
    }
    
    return !errors[fieldName];
  };
  
  // Render fields for each step
  const renderFields = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <ScaleIn>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  id="name"
                  className="form-input"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
                <AIFeedback 
                  fieldName="Name" 
                  value={watch('name')} 
                  rules={{ minLength: 2 }}
                  isValid={getFieldValidity('name')}
                />
              </div>
            </ScaleIn>
            
            <ScaleIn delay={100}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
                <AIFeedback 
                  fieldName="Email" 
                  value={watch('email')} 
                  rules={{ pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
                  isValid={getFieldValidity('email')}
                />
              </div>
            </ScaleIn>
            
            <ScaleIn delay={200}>
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-1">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('company')}
                  id="company"
                  className="form-input"
                  placeholder="Your Company Name"
                />
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
                )}
                <AIFeedback 
                  fieldName="Company Name" 
                  value={watch('company')} 
                  rules={{ minLength: 2 }}
                  isValid={getFieldValidity('company')}
                />
              </div>
            </ScaleIn>
            
            <ScaleIn delay={300}>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  {...register('phone')}
                  id="phone"
                  className="form-input"
                  placeholder="+1 (555) 123-4567"
                />
                <AIFeedback 
                  fieldName="Phone Number" 
                  value={watch('phone')} 
                  isValid={getFieldValidity('phone')}
                />
              </div>
            </ScaleIn>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <ScaleIn>
              <div>
                <label htmlFor="projectTitle" className="block text-sm font-medium mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('projectTitle')}
                  id="projectTitle"
                  className="form-input"
                  placeholder="E.g., E-commerce Website Redesign"
                />
                {errors.projectTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectTitle.message}</p>
                )}
                <AIFeedback 
                  fieldName="Project Title" 
                  value={watch('projectTitle')} 
                  rules={{ minLength: 5 }}
                  isValid={getFieldValidity('projectTitle')}
                />
              </div>
            </ScaleIn>
            
            <ScaleIn delay={100}>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Project Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  id="description"
                  rows={5}
                  className="form-input"
                  placeholder="Describe your project in detail. What problem are you trying to solve? What features do you need?"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
                <AIFeedback 
                  fieldName="Description" 
                  value={watch('description')} 
                  rules={{ minLength: 30 }}
                  isValid={getFieldValidity('description')}
                />
              </div>
            </ScaleIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScaleIn delay={200}>
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium mb-1">
                    Estimated Timeline <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('timeline')}
                    id="timeline"
                    className="form-input"
                  >
                    <option value="">Select Timeline</option>
                    <option value="ASAP">As soon as possible</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                    <option value="Not sure">Not sure yet</option>
                  </select>
                  {errors.timeline && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                  )}
                </div>
              </ScaleIn>
              
              <ScaleIn delay={300}>
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium mb-1">
                    Budget Range <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('budget')}
                    id="budget"
                    className="form-input"
                  >
                    <option value="">Select Budget</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                    <option value="Not sure">Not sure yet</option>
                  </select>
                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                  )}
                </div>
              </ScaleIn>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <ScaleIn>
              <div>
                <label htmlFor="goals" className="block text-sm font-medium mb-1">
                  Project Goals & Objectives <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('goals')}
                  id="goals"
                  rows={4}
                  className="form-input"
                  placeholder="What are you hoping to achieve with this project? E.g., increase sales, improve user engagement, etc."
                ></textarea>
                {errors.goals && (
                  <p className="text-red-500 text-sm mt-1">{errors.goals.message}</p>
                )}
                <AIFeedback 
                  fieldName="Goals" 
                  value={watch('goals')} 
                  rules={{ minLength: 15 }}
                  isValid={getFieldValidity('goals')}
                />
              </div>
            </ScaleIn>
            
            <ScaleIn delay={100}>
              <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium mb-1">
                  Target Audience <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  {...register('targetAudience')}
                  id="targetAudience"
                  rows={3}
                  className="form-input"
                  placeholder="Describe who will use your product or service"
                ></textarea>
                <AIFeedback 
                  fieldName="Target Audience" 
                  value={watch('targetAudience')} 
                  isValid={true}
                />
              </div>
            </ScaleIn>
            
            <ScaleIn delay={200}>
              <div>
                <label htmlFor="specialRequirements" className="block text-sm font-medium mb-1">
                  Special Requirements <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  {...register('specialRequirements')}
                  id="specialRequirements"
                  rows={3}
                  className="form-input"
                  placeholder="Any specific technologies, integrations, or requirements?"
                ></textarea>
              </div>
            </ScaleIn>
            
            <ScaleIn delay={300}>
              <div>
                <label className="block text-sm font-medium mb-3">
                  Project Files <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                  {uploadingFile ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">Uploading files...</p>
                    </div>
                  ) : (
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drag files here, or <span className="text-blue-500">browse</span> from your computer
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Wireframes, mockups, requirements docs (Max 10MB each)
                      </p>
                    </label>
                  )}
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                          <span className="text-sm truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScaleIn>
            
            <ScaleIn delay={400}>
              <div>
                <label htmlFor="referralSource" className="block text-sm font-medium mb-1">
                  How did you hear about us? <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <select
                  {...register('referralSource')}
                  id="referralSource"
                  className="form-input"
                >
                  <option value="">Select an option</option>
                  <option value="Google">Google Search</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral from a Friend/Colleague</option>
                  <option value="Blog">Blog or Article</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </ScaleIn>
          </div>
        );
      
      case 3:
        const formData = getValues();
        return (
          <ScaleIn>
            <div className="space-y-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Review Your Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Please review the information below before submitting your request. You can go back to make any changes if needed.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3">
                    Contact Information
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Name</dt>
                      <dd className="text-sm font-medium">{formData.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Email</dt>
                      <dd className="text-sm font-medium">{formData.email}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Company</dt>
                      <dd className="text-sm font-medium">{formData.company}</dd>
                    </div>
                    {formData.phone && (
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400">Phone</dt>
                        <dd className="text-sm font-medium">{formData.phone}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3">
                    Project Information
                  </h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Project Type</dt>
                      <dd className="text-sm font-medium capitalize">{formData.projectType.replace(/-/g, ' ')}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Project Title</dt>
                      <dd className="text-sm font-medium">{formData.projectTitle}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Timeline</dt>
                      <dd className="text-sm font-medium">{formData.timeline}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400">Budget</dt>
                      <dd className="text-sm font-medium">{formData.budget}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Project Description
                </h4>
                <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                  {formData.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Goals & Objectives
                </h4>
                <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                  {formData.goals}
                </p>
              </div>
              
              {formData.targetAudience && (
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Target Audience
                  </h4>
                  <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                    {formData.targetAudience}
                  </p>
                </div>
              )}
              
              {formData.specialRequirements && (
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Special Requirements
                  </h4>
                  <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                    {formData.specialRequirements}
                  </p>
                </div>
              )}
              
              {files.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Attached Files ({files.length})
                  </h4>
                  <ul className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-blue-500">📎</span>
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScaleIn>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <FormStepper steps={steps} currentStep={step} />
      
      <FadeIn>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">{steps[step]}</h2>
            
            {renderFields()}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="button-secondary flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              {step === 0 ? 'Back to Home' : 'Previous Step'}
            </button>
            
            {step === steps.length - 1 ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`button-primary flex items-center gap-2 ${!isStepValid() ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                Next Step
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </form>
      </FadeIn>
    </div>
  );
}
