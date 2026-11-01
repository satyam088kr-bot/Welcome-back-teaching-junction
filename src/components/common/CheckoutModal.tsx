import React, { useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle,
  Copy,
  CreditCard,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';

interface Props {
  course: Course;
  onClose: () => void;
}

export const CheckoutModal: React.FC<Props> = ({ course, onClose }) => {
  const { currentUser, submitPayment, setAuthModalOpen } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr_code' | 'bank_transfer'>('upi');
  const [transactionId, setTransactionId] = useState('');
  const [paymentApp, setPaymentApp] = useState('phonepe');
  const [notes, setNotes] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const upiId = 'teachingjunction@upi';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (!transactionId.trim() || transactionId.trim().length < 6) {
      setErrorMsg('Please enter a valid 12-digit UTR or UPI Transaction Reference Number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ok = submitPayment({
        courseId: course.id,
        courseTitle: course.title,
        amount: course.price,
        transactionId: transactionId.trim(),
        paymentMethod: paymentMethod,
        notes: `App: ${paymentApp} | Note: ${notes}`,
      });
      setIsSubmitting(false);
      if (ok) {
        setSubmittedSuccess(true);
      }
    }, 600);
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Student Sign In Required</h3>
          <p className="text-xs text-slate-600 mt-2 mb-5">
            Please log in or register a student account to enroll in <strong>{course.title}</strong>.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                onClose();
                setAuthModalOpen(true);
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Sign In / Register
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Course Enrollment & Checkout</h2>
              <div className="text-xs text-blue-200">Teaching Junction Coaching Payment Desk</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Payment Reference Submitted!</h3>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold mb-4">
              Status: Pending Admin Verification
            </span>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
              Thank you, <strong>{currentUser.name}</strong>. Your transaction reference{' '}
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{transactionId}</span> has been securely logged. The administration will verify the deposit within 1-2 hours and grant full course access.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs text-slate-600 mb-6 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Course:</span>
                <span className="font-semibold text-slate-800">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-bold text-blue-700">₹{course.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student Email:</span>
                <span className="font-mono text-slate-700">{currentUser.email}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
            >
              Done & Return to Courses
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {/* Course Summary Card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-blue-200"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  {course.classCategory} • {course.subject}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{course.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base sm:text-lg font-black text-blue-700">₹{course.price}</span>
                  {course.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                  )}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    One-time Fee
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Gateway Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs flex items-start gap-2.5 text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Transparent Payment Notice:</span> Automated card gateways remain in setup mode until official credentials are linked. All enrollments currently use our <strong>Admin-Verified Direct UPI / QR Workflow</strong>. No PINs or card details are requested.
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Step 1: Choose Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'upi'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>UPI ID / Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qr_code')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'qr_code'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Scan QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Bank NEFT/IMPS</span>
                </button>
              </div>
            </div>

            {/* Payment Instructions per Method */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 text-xs">
              {paymentMethod === 'upi' && (
                <div>
                  <div className="text-slate-600 mb-1">Pay <strong>₹{course.price}</strong> using any UPI app to:</div>
                  <div className="flex items-center justify-between bg-white border border-slate-300 rounded-lg px-3 py-2">
                    <span className="font-mono font-bold text-slate-900">{upiId}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(upiId)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'qr_code' && (
                <div className="flex items-center gap-4">
                  {/* Visual QR Code Box */}
                  <div className="w-24 h-24 bg-white border-2 border-slate-900 p-1.5 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-950 rounded">
                      <div className="bg-white rounded-xs col-span-2 row-span-2"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-white rounded-xs"></div>
                      <div className="bg-white rounded-xs col-span-2"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Scan via PhonePe, GPay or Paytm</div>
                    <div className="text-slate-500 mt-0.5">Amount to pay: <span className="font-bold text-blue-700">₹{course.price}</span></div>
                    <div className="text-[11px] text-slate-400 mt-1">UPI ID: {upiId}</div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="space-y-1 text-slate-700">
                  <div className="font-bold text-slate-900">Coaching Bank Account:</div>
                  <div>Bank: <strong>State Bank of India (SBI)</strong></div>
                  <div>Account Name: <strong>Teaching Junction Coaching</strong></div>
                  <div>Account No: <strong className="font-mono">389201948210</strong></div>
                  <div>IFSC Code: <strong className="font-mono">SBIN0001234</strong></div>
                </div>
              )}
            </div>

            {/* Step 2: Enter Transaction Reference */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Step 2: Enter 12-Digit UPI Ref / UTR Number
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Payment App Used:</span>
                  <select
                    value={paymentApp}
                    onChange={(e) => setPaymentApp(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="phonepe">PhonePe UPI</option>
                    <option value="gpay">Google Pay (GPay)</option>
                    <option value="paytm">Paytm UPI</option>
                    <option value="bhim">BHIM UPI</option>
                    <option value="bank">Direct Bank Transfer (IMPS/NEFT)</option>
                  </select>
                </div>

                <div>
                  <span className="block text-[11px] text-slate-500 mb-1">Transaction Ref / UTR No:</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 430192837492"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[11px] text-slate-500 mb-1">Remarks or Student Note (Optional):</span>
                <input
                  type="text"
                  placeholder="e.g. Paid from father's account (Rajesh Sharma)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Direct Enrollment</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  {isSubmitting ? 'Recording...' : 'Submit Payment For Verification'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
