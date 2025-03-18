const handleExport = () => {
  // Create a formatted string with all leads
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

  // Create a blob and download it
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