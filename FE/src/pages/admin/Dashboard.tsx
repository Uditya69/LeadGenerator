import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FadeIn, ScaleIn, SlideUp } from '@/components/ui/motion';
import { getLeads } from '@/lib/api';
import { Lead } from '@/lib/types';
import { 
  Users, 
  UserCheck, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Loader2,
  FileSpreadsheet,
  Brain
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getLeads();
        if (response.success) {
          setLeads(response.data);
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
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <Loader2 size={48} className="animate-spin text-blue-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  // Calculate stats
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'QUALIFIED').length;
  const disqualifiedLeads = leads.filter(lead => lead.status === 'DISQUALIFIED').length;
  const newLeads = leads.filter(lead => lead.status === 'NEW').length;
  const averageScore = totalLeads > 0 
    ? leads.reduce((sum, lead) => sum + (lead.aiScore || 0), 0) / totalLeads 
    : 0;
  
  // Data for charts
  const statusData = [
    { name: 'New', value: newLeads, color: '#3B82F6' },
    { name: 'Contacted', value: leads.filter(lead => lead.status === 'CONTACTED').length, color: '#FBBF24' },
    { name: 'Qualified', value: qualifiedLeads, color: '#10B981' },
    { name: 'Disqualified', value: disqualifiedLeads, color: '#EF4444' },
  ];
  
  const projectTypeData = [
    { name: 'E-Commerce', value: leads.filter(lead => lead.projectType === 'e-commerce').length },
    { name: 'SaaS', value: leads.filter(lead => lead.projectType === 'saas').length },
    { name: 'Mobile App', value: leads.filter(lead => lead.projectType === 'mobile-app').length },
    { name: 'Web App', value: leads.filter(lead => lead.projectType === 'web-app').length },
    { name: 'Portfolio', value: leads.filter(lead => lead.projectType === 'portfolio').length },
    { name: 'AI Integration', value: leads.filter(lead => lead.projectType === 'ai-integration').length },
  ].sort((a, b) => b.value - a.value);
  
  // Calculate trend data from actual leads
  const trendData = leads.reduce((acc: any[], lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short' });
    const existingMonth = acc.find(item => item.date === date);
    
    if (existingMonth) {
      existingMonth.leads++;
      if (lead.status === 'QUALIFIED') {
        existingMonth.qualified++;
      }
    } else {
      acc.push({
        date,
        leads: 1,
        qualified: lead.status === 'QUALIFIED' ? 1 : 0
      });
    }
    
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <ScaleIn>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button className="button-secondary flex items-center gap-2 text-sm py-2">
              <FileSpreadsheet size={16} />
              Export Report
            </button>
          </div>
        </ScaleIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FadeIn delay={100}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Leads</p>
                  <h3 className="text-3xl font-bold">{totalLeads}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={150}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Qualified Leads</p>
                  <h3 className="text-3xl font-bold">{qualifiedLeads}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <UserCheck size={20} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">New Leads</p>
                  <h3 className="text-3xl font-bold">{newLeads}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={250}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average AI Score</p>
                  <h3 className="text-3xl font-bold">{averageScore.toFixed(1)}%</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Brain size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SlideUp delay={300} className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Lead Trends</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#3B82F6" activeDot={{ r: 8 }} name="Total Leads" />
                    <Line type="monotone" dataKey="qualified" stroke="#10B981" name="Qualified Leads" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </SlideUp>
          
          <SlideUp delay={350}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Lead Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {statusData.map((status) => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{status.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </SlideUp>
        </div>
        
        <SlideUp delay={400}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Projects by Type</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="value" name="Number of Leads" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SlideUp>

        <SlideUp delay={450}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Leads</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{lead.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{lead.projectTitle}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{lead.projectType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          lead.status === 'DISQUALIFIED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{lead.aiScore?.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">AI Score</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SlideUp>
      </div>

      {/* AI Analysis Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">AI Analysis</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Lead Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-sm font-medium">{selectedLead.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                      <p className="text-sm font-medium">{selectedLead.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Project</p>
                      <p className="text-sm font-medium">{selectedLead.projectTitle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">AI Score</p>
                      <p className="text-sm font-medium">{selectedLead.aiScore?.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Analysis</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm whitespace-pre-wrap">{selectedLead.aiAnalysis || 'No AI analysis available.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
