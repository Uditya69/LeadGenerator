
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function FormStepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex items-center">
              {index > 0 && (
                <div 
                  className={cn(
                    'h-[2px] w-[50px] md:w-[100px]',
                    index <= currentStep 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  )}
                />
              )}
              
              <div 
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300',
                  index < currentStep 
                    ? 'bg-blue-500 text-white' 
                    : index === currentStep 
                      ? 'bg-blue-500 text-white ring-4 ring-blue-100 dark:ring-blue-900/30' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                )}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    'h-[2px] w-[50px] md:w-[100px]',
                    index < currentStep 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  )}
                />
              )}
            </div>
            
            <span 
              className={cn(
                'mt-2 text-xs md:text-sm text-center transition-colors duration-300',
                index <= currentStep 
                  ? 'text-gray-700 dark:text-gray-300 font-medium' 
                  : 'text-gray-400 dark:text-gray-500'
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
