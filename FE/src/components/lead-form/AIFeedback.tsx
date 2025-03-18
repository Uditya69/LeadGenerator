
import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIFeedbackProps {
  fieldName: string;
  value: string;
  rules?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
  isValid: boolean;
  validationTimeout?: number;
}

export function AIFeedback({ 
  fieldName, 
  value, 
  rules, 
  isValid,
  validationTimeout = 800 
}: AIFeedbackProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  useEffect(() => {
    if (!value) {
      setShowFeedback(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsValidating(true);
      
      // Simulate API call to validate field
      setTimeout(() => {
        let message = '';
        
        // Basic validation
        if (rules?.minLength && value.length < rules.minLength) {
          message = `${fieldName} should be at least ${rules.minLength} characters.`;
        } else if (rules?.maxLength && value.length > rules.maxLength) {
          message = `${fieldName} should be no more than ${rules.maxLength} characters.`;
        } else if (rules?.pattern && !rules.pattern.test(value)) {
          message = `Please provide a valid ${fieldName}.`;
        } else if (!isValid) {
          message = `Please provide more details for your ${fieldName.toLowerCase()}.`;
        } else {
          message = value.length > 20 
            ? `Great ${fieldName.toLowerCase()}! Clear and comprehensive.` 
            : `Your ${fieldName.toLowerCase()} looks good.`;
        }
        
        setFeedbackMessage(message);
        setIsValidating(false);
        setShowFeedback(true);
      }, 1000);
    }, validationTimeout);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, fieldName, rules, isValid, validationTimeout]);
  
  if (!showFeedback) return null;
  
  return (
    <div 
      className={cn(
        'mt-1 text-sm rounded-md flex items-start gap-2 p-2 transition-all duration-300',
        isValidating ? 'bg-gray-100 dark:bg-gray-800' : 
          isValid ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 
          'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
      )}
    >
      {isValidating ? (
        <Loader2 size={16} className="animate-spin mt-0.5" />
      ) : isValid ? (
        <CheckCircle2 size={16} className="mt-0.5" />
      ) : (
        <AlertCircle size={16} className="mt-0.5" />
      )}
      <span>{isValidating ? 'AI is analyzing your input...' : feedbackMessage}</span>
    </div>
  );
}
