import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Mail, 
  Check, 
  Clock, 
  AlertTriangle,
  Loader2,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FadeIn, ScaleIn } from '../ui/motion';
import { cn } from '@/lib/utils';
import { getLeads } from '@/lib/api';
import { Lead } from '@/lib/types';

type SortField = 'name' | 'company' | 'aiScore' | 'createdAt' | 'status';
type SortOrder = 'asc' | 'desc';

export function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLeads();
        if (response.success) {
          setLeads(response.data);
          setFilteredLeads(response.data);
        } else {
          setError('Failed to fetch leads data');
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        setError('Failed to fetch leads data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...leads];

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(lead => lead.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply project type filter
    if (projectFilter !== 'all') {
      result = result.filter(lead => lead.projectType.toLowerCase() === projectFilter.toLowerCase());
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareA, compareB;

      switch (sortField) {
        case 'name':
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case 'company':
          compareA = a.company.toLowerCase();
          compareB = b.company.toLowerCase();
          break;
        case 'aiScore':
          compareA = a.aiScore || 0;
          compareB = b.aiScore || 0;
          break;
        case 'status':
          // Prioritize qualified leads
          if (a.status.toLowerCase() === 'qualified' && b.status.toLowerCase() !== 'qualified') return -1;
          if (a.status.toLowerCase() !== 'qualified' && b.status.toLowerCase() === 'qualified') return 1;
          compareA = a.status.toLowerCase();
          compareB = b.status.toLowerCase();
          break;
        case 'createdAt':
        default:
          compareA = new Date(a.createdAt).getTime();
          compareB = new Date(b.createdAt).getTime();
      }

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredLeads(result);
  }, [leads, search, statusFilter, projectFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleViewLead = (id: string) => {
    navigate(`/admin/leads/${id}`);
  };

  const handleSendEmail = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          leadId: id,
          templateId: 'follow-up',
          variables: {
            name: leads.find(l => l.id === id)?.name || '',
            company: leads.find(l => l.id === id)?.company || ''
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Email sent",
          description: "Follow-up email has been sent to the lead.",
        });
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send email',
        variant: "destructive",
      });
    }
  };

  // Get unique project types for filter
  const projectTypes = ['all', ...new Set(leads.map(lead => lead.projectType))];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case 'new':
        return <Clock size={14} />;
      case 'contacted':
        return <Mail size={14} />;
      case 'qualified':
        return <Check size={14} />;
      case 'disqualified':
        return <AlertTriangle size={14} />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center">
          <AlertTriangle size={48} className="text-red-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScaleIn>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Leads Management</h1>
          
          <div className="flex gap-2">
            <button className="button-secondary flex items-center gap-2 text-sm py-2">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </ScaleIn>
      
      <FadeIn delay={100}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="disqualified">Disqualified</option>
                </select>
              </div>
              
              <div className="w-48">
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="all">All Project Types</option>
                  {projectTypes.filter(type => type !== 'all').map(type => (
                    <option key={type} value={type}>{type.replace(/-/g, ' ')}</option>
                  ))}
                </select>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Filter size={18} />
                <span className="hidden md:inline">More Filters</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-left">
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Name
                      {sortField === 'name' && (
                        <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleSort('company')}
                      className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Company
                      {sortField === 'company' && (
                        <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Project Type
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleSort('aiScore')}
                      className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      AI Score
                      {sortField === 'aiScore' && (
                        <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Status
                      {sortField === 'status' && (
                        <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Date
                      {sortField === 'createdAt' && (
                        <ArrowUpDown size={14} className={sortOrder === 'desc' ? 'rotate-180' : ''} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{lead.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{lead.company}</td>
                      <td className="px-4 py-4 capitalize">{lead.projectType.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-4">
                        <div className={cn("font-medium", getScoreColor(lead.aiScore || 0))}>
                          {lead.aiScore?.toFixed(1) || '0'}%
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                          getStatusColor(lead.status)
                        )}>
                          {getStatusIcon(lead.status)}
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSendEmail(lead.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            title="Send Email"
                          >
                            <Mail size={18} />
                          </button>
                          <button
                            onClick={() => handleViewLead(lead.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center">
                        <AlertTriangle size={36} className="mb-2 text-gray-400" />
                        <p>No leads found matching your filters.</p>
                        <button
                          onClick={() => {
                            setSearch('');
                            setStatusFilter('all');
                            setProjectFilter('all');
                          }}
                          className="mt-2 text-blue-500 hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div>Showing {filteredLeads.length} of {leads.length} leads</div>
            <div className="flex gap-1">
              <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700">Previous</button>
              <button className="px-3 py-1 rounded-md bg-blue-500 text-white">1</button>
              <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700">2</button>
              <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700">3</button>
              <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700">Next</button>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
