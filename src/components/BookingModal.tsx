import { X, User, Phone, Calendar, FileText } from 'lucide-react';
import { useState } from 'react';
import { HospitalWithBeds } from '../lib/supabase';
import { saveBookingToGoogleSheets, sendBookingToPabblyWebhook } from '../lib/googleSheets';

type BookingModalProps = {
  hospital: HospitalWithBeds | null;
  onClose: () => void;
};

export default function BookingModal({ hospital, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    phone: '',
    bedType: '',
    symptoms: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!hospital) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const bookingData = {
      patientName: formData.patientName,
      age: formData.age,
      phone: formData.phone,
      hospitalName: hospital!.name,
      bedType: formData.bedType,
      symptoms: formData.symptoms,
    };

    // Save to Google Sheets
    const savedToSheets = await saveBookingToGoogleSheets(bookingData);

    // Send to Pabbly webhook for automations (SMS, email, CRM, etc.)
    const sentToPabbly = await sendBookingToPabblyWebhook(bookingData);

    // Consider success if at least one destination worked
    const success = savedToSheets || sentToPabbly;

    if (!success) {
      setError('Failed to process booking. Please check your internet connection and try again.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFormData({ patientName: '', age: '', phone: '', bedType: '', symptoms: '' });
      setError(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Book Bed</h2>
            <p className="text-sm text-slate-400 mt-1">{hospital.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
            <p className="text-slate-400">Credentials saved. The hospital will contact you shortly</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Patient Name
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Age
                </label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Phone"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bed Type Required
              </label>
              <select
                required
                value={formData.bedType}
                onChange={(e) => setFormData({ ...formData, bedType: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select bed type</option>
                {hospital.bed_availability.map((bed) => (
                  <option key={bed.id} value={bed.bed_type}>
                    {bed.bed_type} ({bed.available_beds} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Symptoms / Notes
              </label>
              <textarea
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Brief description of symptoms or requirements"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
