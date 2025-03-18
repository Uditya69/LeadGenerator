
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScaleIn } from '../ui/motion';
import { cn } from '@/lib/utils';
import { projectTypes } from '@/lib/data';

export function ProjectTypeSelector() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSelect = (id: string) => {
    setSelectedType(id);
  };
  
  const handleContinue = () => {
    if (!selectedType) {
      toast({
        title: "Select a project type",
        description: "Please select a project type to continue",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/form?type=${selectedType}`);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <ScaleIn>
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full text-sm font-medium mb-3">
            Project Selection
          </span>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What type of project are you looking to build?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Select the option that best describes your project. This helps us tailor the next steps specifically for your needs.
          </p>
        </div>
      </ScaleIn>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectTypes.map((type, index) => (
          <div
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={cn(
              'glass rounded-xl p-6 cursor-pointer transition-all duration-300',
              'hover:shadow-md border',
              selectedType === type.id 
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            )}
            style={{ 
              animationDelay: `${200 + (index * 70)}ms`,
              opacity: 0,
              animation: 'fadeIn 0.5s forwards',
              // animationDelay: `${200 + (index * 70)}ms`
              
            }}
          >
            <div className="text-4xl mb-4">{type.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{type.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{type.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <button
          onClick={handleContinue}
          className={cn(
            'button-primary inline-flex items-center gap-2 px-8',
            'transition-all duration-300',
            !selectedType && 'opacity-70 cursor-not-allowed'
          )}
          disabled={!selectedType}
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
