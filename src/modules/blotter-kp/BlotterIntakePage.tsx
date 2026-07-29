import { AlertTriangle, Save } from 'lucide-react';
import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { INCIDENT_TYPES } from '@/data/mockReferenceData';

export function BlotterIntakePage() {
  const [formData, setFormData] = useState({
    incidentDate: '',
    incidentTime: '',
    location: '',
    incidentType: '',
    complainantName: '',
    complainantAddress: '',
    respondentName: '',
    respondentAddress: '',
    narrativeSummary: '',
    actionTaken: '',
    isConfidential: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to the backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const isComplete = formData.incidentDate && formData.incidentTime && formData.location &&
                      formData.incidentType && formData.complainantName && formData.respondentName &&
                      formData.narrativeSummary;

  return (
    <PageScaffold
      title="New Blotter Incident Entry"
      subtitle="Record a new incident in the barangay blotter"
      breadcrumbs={[{ label: 'Blotter & KP' }, { label: 'New Incident' }]}
      moduleTag="Blotter"
      priorityTag="P0"
    >
      {/* VAWC/BCPC Notice */}
      <Card className="mb-6 bg-red-50 border-red-200">
        <div className="p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 text-sm">IMPORTANT: VAWC/BCPC Cases</p>
            <p className="text-sm text-red-800 mt-1">
              Violence Against Women and Children (VAWC) and Barangay Council for the Protection of Children (BCPC) cases are handled through a separate protocol.
              Do not record those incidents here. Please refer them to the appropriate officer.
            </p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <Card className="mb-6">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Incident Details</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Incident Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Incident Date" required>
              <input
                type="date"
                value={formData.incidentDate}
                onChange={(e) => handleChange('incidentDate', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </FormField>

            <FormField label="Incident Time" required>
              <input
                type="time"
                value={formData.incidentTime}
                onChange={(e) => handleChange('incidentTime', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </FormField>
          </div>

          {/* Location */}
          <FormField label="Location" required>
            <Input
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., Purok 1 - Riverside, near barangay hall"
            />
          </FormField>

          {/* Incident Type */}
          <FormField label="Incident Type" required>
            <Select
              value={formData.incidentType}
              onChange={(e) => handleChange('incidentType', e.target.value)}
            >
              <option value="">Select incident type...</option>
              {INCIDENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormField>

          {/* Complainant */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 text-sm">Complainant Information</h4>
            <div className="space-y-4">
              <FormField label="Complainant Name" required>
                <Input
                  value={formData.complainantName}
                  onChange={(e) => handleChange('complainantName', e.target.value)}
                  placeholder="Full name of complainant"
                />
              </FormField>

              <FormField label="Complainant Address">
                <Textarea
                  value={formData.complainantAddress}
                  onChange={(e) => handleChange('complainantAddress', e.target.value)}
                  placeholder="Address or contact details"
                  rows={2}
                />
              </FormField>
            </div>
          </div>

          {/* Respondent */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4 text-sm">Respondent Information</h4>
            <div className="space-y-4">
              <FormField label="Respondent Name" required>
                <Input
                  value={formData.respondentName}
                  onChange={(e) => handleChange('respondentName', e.target.value)}
                  placeholder="Full name of respondent"
                />
              </FormField>

              <FormField label="Respondent Address">
                <Textarea
                  value={formData.respondentAddress}
                  onChange={(e) => handleChange('respondentAddress', e.target.value)}
                  placeholder="Address or contact details"
                  rows={2}
                />
              </FormField>
            </div>
          </div>

          {/* Narrative and Action */}
          <div className="pt-4 border-t border-slate-200">
            <div className="space-y-4">
              <FormField label="Narrative Summary" required>
                <Textarea
                  value={formData.narrativeSummary}
                  onChange={(e) => handleChange('narrativeSummary', e.target.value)}
                  placeholder="Describe what happened, who was involved, and any witnesses..."
                  rows={4}
                />
              </FormField>

              <FormField label="Action Taken">
                <Textarea
                  value={formData.actionTaken}
                  onChange={(e) => handleChange('actionTaken', e.target.value)}
                  placeholder="What action was taken to address the incident?"
                  rows={3}
                />
              </FormField>
            </div>
          </div>

          {/* Confidentiality */}
          <div className="pt-4 border-t border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isConfidential}
                onChange={(e) => handleChange('isConfidential', e.target.checked)}
                className="w-4 h-4 text-forest rounded"
              />
              <span className="text-sm font-medium text-slate-700">
                Mark this incident as confidential
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-2 ml-7">
              Check this box if sensitive information requires restricted access
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200 flex gap-3">
            <Button
              type="submit"
              disabled={!isComplete}
              className={`flex items-center gap-2 ${
                isComplete
                  ? 'bg-forest hover:bg-forest-dark text-white'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Save size={18} />
              Submit Incident
            </Button>

            {submitted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-grass-50 border border-grass-200 rounded-lg">
                <div className="w-2 h-2 bg-grass rounded-full"></div>
                <span className="text-sm font-medium text-grass-800">Incident submitted successfully</span>
              </div>
            )}
          </div>
        </form>
      </Card>

      {/* Instructions */}
      <Card className="bg-slate-50 border-slate-200">
        <div className="p-4">
          <p className="text-xs text-slate-600 font-semibold mb-2">NOTES:</p>
          <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
            <li>All required fields must be filled before submitting</li>
            <li>The narrative summary should be clear and factual</li>
            <li>If the incident involves minors, be cautious about identifying details</li>
            <li>Mark as confidential if the case involves sensitive issues</li>
          </ul>
        </div>
      </Card>
    </PageScaffold>
  );
}
