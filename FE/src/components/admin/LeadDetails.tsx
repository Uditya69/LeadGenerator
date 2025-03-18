import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  FileText, 
  DollarSign,
  Target,
  Check,
  Clock,
  AlertTriangle,
  Send,
  Loader2,
  Download,
  Trash2,
  FileDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FadeIn, ScaleIn, SlideUp } from '../ui/motion';
import { cn } from '@/lib/utils';
import { getLead, updateLeadStatus, deleteLead, sendCustomEmail } from '@/lib/api';
import { LeadDetails as LeadDetailsType } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type LeadStatus = 'new' | 'contacted' | 'qualified' | 'disqualified';

const formatAIAnalysis = (analysis: string) => {
  // Replace markdown-style bold with HTML
  let formatted = analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Replace markdown-style lists with HTML lists
  formatted = formatted.replace(/^\* (.*)$/gm, '<li>$1</li>');
  
  // Wrap list items in ul tags
  if (formatted.includes('<li>')) {
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  }
  
  return formatted;
};

export function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<LeadDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>('new');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Fetch lead data
  useEffect(() => {
    const fetchLead = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Invalid lead ID",
          variant: "destructive",
        });
        navigate('/admin/leads');
        return;
      }
      
      try {
        setLoading(true);
        const response = await getLead(id);
        
        if (response.success && response.data) {
          setLead(response.data);
          setCurrentStatus(response.data.status as LeadStatus);
        } else {
          throw new Error(response.error || 'Failed to fetch lead details');
        }
      } catch (error) {
        console.error('Error fetching lead:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to fetch lead details',
          variant: "destructive",
        });
        navigate('/admin/leads');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLead();
  }, [id, toast, navigate]);
  
  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (currentStatus === newStatus || !lead) return;
    
    setUpdating(true);
    
    try {
      const response = await updateLeadStatus(lead.id, newStatus);
      
      if (response.success) {
        setCurrentStatus(newStatus);
        toast({
          title: "Status Updated",
          description: `Lead status changed to "${newStatus}"`,
        });
      } else {
        throw new Error(response.error || 'Failed to update status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handleDeleteLead = async () => {
    if (!lead) return;
    
    setDeleting(true);
    try {
      const response = await deleteLead(lead.id);
      
      if (response.success) {
        toast({
          title: "Lead Deleted",
          description: "The lead has been deleted successfully.",
        });
        navigate('/admin/leads');
      } else {
        throw new Error(response.error || 'Failed to delete lead');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete lead',
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSendCustomEmail = async () => {
    if (!lead || !emailSubject || !emailContent) return;
    
    setSendingEmail(true);
    try {
      const response = await sendCustomEmail(lead.id, {
        subject: emailSubject,
        content: emailContent
      });
      
      if (response.success) {
        toast({
          title: "Email Sent",
          description: "Custom email has been sent successfully.",
        });
        setShowEmailDialog(false);
        setEmailSubject('');
        setEmailContent('');
      } else {
        throw new Error(response.error || 'Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send email',
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!lead) return;
    
    // Create a formatted string with lead details
    const leadDetails = `
Lead Details
============
Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company}
Phone: ${lead.phone || 'Not provided'}
Project Type: ${lead.projectType}
Project Title: ${lead.projectTitle}
Status: ${lead.status}
AI Score: ${lead.aiScore}%
Created: ${new Date(lead.createdAt).toLocaleDateString()}

Project Details
==============
Description: ${lead.description}
Timeline: ${lead.timeline}
Budget: ${lead.budget}
Goals: ${lead.goals}
Target Audience: ${lead.targetAudience || 'Not specified'}
Special Requirements: ${lead.specialRequirements || 'None'}

AI Analysis
==========
${lead.aiInsights?.recommendation || 'No AI analysis available'}
`;

    // Create a blob and download it
    const blob = new Blob([leadDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lead-${lead.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Downloaded",
      description: "Lead details have been downloaded successfully.",
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'disqualified':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock size={16} />;
      case 'contacted':
        return <Mail size={16} />;
      case 'qualified':
        return <Check size={16} />;
      case 'disqualified':
        return <AlertTriangle size={16} />;
      default:
        return null;
    }
  };
  
  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Lead Not Found</h2>
        <p className="text-muted-foreground mb-4">The lead you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/admin/leads')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <ScaleIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/leads')}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold">Lead Details</h1>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowEmailDialog(true)}
              className="button-secondary flex items-center gap-2 text-sm py-2"
            >
              <Send size={16} />
              Send Email
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="button-primary flex items-center gap-2 text-sm py-2"
            >
              <FileDown size={16} />
              Export
            </button>
          </div>
        </div>
      </ScaleIn>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FadeIn delay={100} className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold">{lead.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{lead.email}</p>
              </div>
              <span className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize",
                getStatusColor(currentStatus)
              )}>
                {getStatusIcon(currentStatus)}
                {currentStatus}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                    <p className="font-medium">{lead.company}</p>
                  </div>
                </div>
                
                {lead.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium">{lead.phone}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Calendar className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submitted On</p>
                    <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Project Type</p>
                    <p className="font-medium capitalize">{lead.projectType.replace(/-/g, ' ')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <DollarSign className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="font-medium">{lead.budget}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Target className="text-gray-400 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">AI Score</p>
                    <p className={cn("font-medium", getAIScoreColor(lead.aiScore))}>
                      {lead.aiScore}% {lead.aiScore >= 80 ? '(High quality lead)' : 
                                       lead.aiScore >= 60 ? '(Good potential)' : 
                                       lead.aiScore >= 40 ? '(Needs qualification)' : 
                                       '(Low potential)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Project Details</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-medium mb-1">{lead.projectTitle}</h4>
                <p className="text-gray-600 dark:text-gray-300">{lead.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Goals & Objectives</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-300">{lead.goals}</p>
                </div>
              </div>
              
              {lead.targetAudience && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Target Audience</h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-gray-600 dark:text-gray-300">{lead.targetAudience}</p>
                  </div>
                </div>
              )}
            </div>
            
            {lead.specialRequirements && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Special Requirements</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-600 dark:text-gray-300">{lead.specialRequirements}</p>
                </div>
              </div>
            )}
            
            {lead.files && lead.files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Attached Files</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-3">
                  {lead.files.map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" />
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500">({file.size})</span>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </FadeIn>
        
        <SlideUp delay={200}>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Update Status</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleStatusChange('new')}
                  className={cn(
                    "flex items-center gap-2 w-full p-3 rounded-lg border transition-all",
                    currentStatus === 'new' 
                      ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300" 
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  )}
                  disabled={updating}
                >
                  <Clock size={18} />
                  <span>New Lead</span>
                </button>
                
                <button
                  onClick={() => handleStatusChange('contacted')}
                  className={cn(
                    "flex items-center gap-2 w-full p-3 rounded-lg border transition-all",
                    currentStatus === 'contacted' 
                      ? "bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300" 
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  )}
                  disabled={updating}
                >
                  <Mail size={18} />
                  <span>Contacted</span>
                </button>
                
                <button
                  onClick={() => handleStatusChange('qualified')}
                  className={cn(
                    "flex items-center gap-2 w-full p-3 rounded-lg border transition-all",
                    currentStatus === 'qualified' 
                      ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300" 
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  )}
                  disabled={updating}
                >
                  <Check size={18} />
                  <span>Qualified</span>
                </button>
                
                <button
                  onClick={() => handleStatusChange('disqualified')}
                  className={cn(
                    "flex items-center gap-2 w-full p-3 rounded-lg border transition-all",
                    currentStatus === 'disqualified' 
                      ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300" 
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  )}
                  disabled={updating}
                >
                  <AlertTriangle size={18} />
                  <span>Disqualified</span>
                </button>
                
                {updating && (
                  <div className="flex justify-center my-2">
                    <Loader2 size={20} className="animate-spin text-blue-500" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Lead Quality Score</span>
                  <span className={cn("text-sm font-medium", getAIScoreColor(lead.aiScore))}>
                    {lead.aiScore}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full",
                      lead.aiScore >= 80 ? "bg-green-500" : 
                      lead.aiScore >= 60 ? "bg-blue-500" : 
                      lead.aiScore >= 40 ? "bg-yellow-500" : 
                      "bg-red-500"
                    )}
                    style={{ width: `${lead.aiScore}%` }}
                  ></div>
                </div>
              </div>
              
              {lead.aiAnalysis ? (
                <div className="prose dark:prose-invert max-w-none">
                  <div 
                    className="text-sm text-gray-600 dark:text-gray-400"
                    dangerouslySetInnerHTML={{ __html: formatAIAnalysis(lead.aiAnalysis) }}
                  />
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      lead.aiInsights?.budget === "good" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}>
                      {lead.aiInsights?.budget === "good" ? <Check size={12} /> : <AlertTriangle size={12} />}
                    </div>
                    <div>
                      <span className="font-medium">Budget</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lead.aiInsights?.budgetReason || 'No budget analysis available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      lead.aiInsights?.timeline === "good" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}>
                      {lead.aiInsights?.timeline === "good" ? <Check size={12} /> : <AlertTriangle size={12} />}
                    </div>
                    <div>
                      <span className="font-medium">Timeline</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lead.aiInsights?.timelineReason || 'No timeline analysis available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      lead.aiInsights?.scope === "good" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}>
                      {lead.aiInsights?.scope === "good" ? <Check size={12} /> : <AlertTriangle size={12} />}
                    </div>
                    <div>
                      <span className="font-medium">Project Scope</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lead.aiInsights?.scopeReason || 'No scope analysis available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      lead.aiInsights?.requirements === "good" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    )}>
                      {lead.aiInsights?.requirements === "good" ? <Check size={12} /> : <AlertTriangle size={12} />}
                    </div>
                    <div>
                      <span className="font-medium">Requirements Clarity</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lead.aiInsights?.requirementsReason || 'No requirements analysis available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {lead.aiInsights?.recommendation && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-2">AI Recommendation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lead.aiInsights.recommendation}
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Actions</h3>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowEmailDialog(true)}
                  className="flex items-center gap-2 w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                >
                  <Send size={18} className="text-blue-500" />
                  <span>Send Custom Email</span>
                </button>
                
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                >
                  <FileDown size={18} className="text-green-500" />
                  <span>Download as PDF</span>
                </button>
                
                <button 
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 w-full p-3 rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <Trash2 size={18} />
                  <span>Delete Lead</span>
                </button>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteLead}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Custom Email</DialogTitle>
            <DialogDescription>
              Send a custom email to {lead?.name} at {lead?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Enter email content"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendCustomEmail}
              disabled={sendingEmail || !emailSubject || !emailContent}
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Email'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
