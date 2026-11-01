import React, { useState } from 'react';
import {
  Clock,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactView: React.FC = () => {
  const { contactInfo, addToast } = useApp();

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryClass, setInquiryClass] = useState('Class 10th');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please provide student name and contact phone number.',
      });
      return;
    }

    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Inquiry Submitted',
      message: `Thank you ${inquiryName}! Our academic counselor will call you at ${inquiryPhone} shortly.`,
    });
  };

  // Format phone for tel: and whatsapp:
  const rawPhone = contactInfo.phone.replace(/[^0-9]/g, '');
  const rawWhatsApp = contactInfo.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admission & Counseling Desk</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black">
            Contact Teaching Junction Coaching
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Have questions regarding batch admissions, fees, test series, or offline classrooms? Get in touch directly with our Director and counseling staff.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Cards */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Official Details Box */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Teaching Junction Coaching</h2>
                <div className="text-xs text-blue-700 font-semibold">{contactInfo.directorName}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Card */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Phone Call</span>
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">{contactInfo.phone}</div>
                <a
                  href={`tel:${rawPhone}`}
                  className="inline-block text-xs font-bold text-blue-700 hover:underline pt-1"
                >
                  Call Now &rarr;
                </a>
              </div>

              {/* WhatsApp Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Helpline</span>
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">{contactInfo.whatsapp}</div>
                <a
                  href={`https://wa.me/${rawWhatsApp}?text=Hello%20Teaching%20Junction%20Coaching%2C%20I%20have%20an%20admission%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-emerald-700 hover:underline pt-1"
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                <div className="flex items-center gap-2 text-purple-700">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Official Email</span>
                </div>
                <div className="text-xs font-bold text-slate-900 font-mono truncate">{contactInfo.email}</div>
                <a
                  href={`mailto:${contactInfo.email}?subject=Admission%20Inquiry%20-%20Teaching%20Junction%20Coaching`}
                  className="inline-block text-xs font-bold text-purple-700 hover:underline pt-1"
                >
                  Send Email &rarr;
                </a>
              </div>

              {/* Website Card */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                <div className="flex items-center gap-2 text-amber-800">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Official Website</span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate font-mono">{contactInfo.website}</div>
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-amber-800 hover:underline pt-1"
                >
                  Visit Portal &rarr;
                </a>
              </div>
            </div>

            {/* Address & Timings */}
            <div className="pt-2 border-t border-slate-100 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Coaching Centre Address:</span>
                  <span>{contactInfo.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Office & Counseling Hours:</span>
                  <span>{contactInfo.officeHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Instant Student Inquiry Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Request Admission Counseling</h3>
              <p className="text-xs text-slate-500">
                Leave your details and our senior faculty will get back to you with syllabus and batch timings.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Inquiry Received!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you, <strong>{inquiryName}</strong>. Our counselors will call you at <strong>{inquiryPhone}</strong>. You can also chat directly on WhatsApp.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student / Parent Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class / Exam</label>
                  <select
                    value={inquiryClass}
                    onChange={(e) => setInquiryClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Class 10th">Class 10th Board</option>
                    <option value="Class 12th">Class 12th Board</option>
                    <option value="Class 9th">Class 9th Foundation</option>
                    <option value="Class 8th">Class 8th</option>
                    <option value="Class 7th">Class 7th</option>
                    <option value="Class 6th">Class 6th</option>
                    <option value="Competitive Exams">Competitive Exams (UPSC / SSC / Railways / Police)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Question or Note (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Inquiring about Sunday offline test batches and Science notes..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Admission Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
