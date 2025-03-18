import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Loader2, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getLeads, sendEmail, sendCustomEmail } from '@/lib/api';
import { Lead } from '@/lib/types';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function Leads() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [showCustomEmailForm, setShowCustomEmailForm] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads({
        page: currentPage,
        limit: pagination.limit,
        search: searchQuery,
        status: statusFilter
      });

      if (response.success && response.data) {
        setLeads(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch leads');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch leads',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentPage, searchQuery, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    const leadsData = leads.map(lead => `
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
`).join('\n\n');

    const blob = new Blob([leadsData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Exported",
      description: "All leads have been exported successfully.",
    });
  };

  const handleEmailClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEmailDialog(true);
  };

  const handleSendEmail = async (type: 'acknowledgment' | 'custom') => {
    if (!selectedLead) return;
    
    setSendingEmail(true);
    try {
      let response;
      if (type === 'acknowledgment') {
        response = await sendEmail({
          to: selectedLead.email,
          templateId: 'welcome',
          variables: {
            name: selectedLead.name,
            company: selectedLead.company
          }
        });
      } else {
        response = await sendCustomEmail(selectedLead.id, {
          subject: emailSubject,
          content: emailContent
        });
      }
      
      if (response.success) {
        toast({
          title: "Email Sent",
          description: `Email has been sent successfully to ${selectedLead.name}`,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <FileDown size={16} />
          Export
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  AI Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {lead.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {lead.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {lead.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {lead.projectType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      lead.status === 'NEW' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {lead.aiScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEmailClick(lead)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/leads/${lead.id}`)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Choose how you want to send an email to {selectedLead?.name} at {selectedLead?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleSendEmail('acknowledgment')}
                disabled={sendingEmail}
              >
                Send Welcome Email
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomEmailForm(true)}
                disabled={sendingEmail}
              >
                Send Custom Email
              </Button>
            </div>
            
            {showCustomEmailForm && (
              <>
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
                <Button
                  onClick={() => handleSendEmail('custom')}
                  disabled={sendingEmail || !emailSubject || !emailContent}
                  className="w-full"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Custom Email'
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 