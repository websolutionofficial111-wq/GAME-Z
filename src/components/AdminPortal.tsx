import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileText,
  UploadCloud,
  Phone,
  Eye,
  LogOut,
  Users,
  Trophy,
  Filter,
  Lock,
  ArrowLeft,
  X,
  FileImage,
} from 'lucide-react';
import { EnrolmentRequest, Tournament } from '../types';

interface AdminPortalProps {
  enrolments: EnrolmentRequest[];
  tournaments: Tournament[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  onAddEnrolment: (req: EnrolmentRequest) => void;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  enrolments,
  tournaments,
  onUpdateStatus,
  onAddEnrolment,
  onClose,
}) => {
  // Authentication state for Admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Filters & State
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [tournamentFilter, setTournamentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewFile, setPreviewFile] = useState<{ name: string; url?: string } | null>(null);

  // Admin file upload state
  const [adminUploadTitle, setAdminUploadTitle] = useState('');
  const [adminUploadedFile, setAdminUploadedFile] = useState<{ name: string; size: string } | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    // Secret credentials check (GAMAMALE / 123456789)
    if (adminUsername.trim() === 'GAMAMALE' && adminPassword === '123456789') {
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid Admin credentials. Access denied.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdminUploadedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
    }
  };

  const filteredEnrolments = enrolments.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (tournamentFilter !== 'all' && req.tournamentId !== tournamentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchApplicant = req.applicantName.toLowerCase().includes(q);
      const matchIgn = req.ign.toLowerCase().includes(q);
      const matchTeam = req.teamName.toLowerCase().includes(q);
      const matchTourney = req.tournamentTitle.toLowerCase().includes(q);
      if (!matchApplicant && !matchIgn && !matchTeam && !matchTourney) return false;
    }
    return true;
  });

  const pendingCount = enrolments.filter((e) => e.status === 'pending').length;
  const approvedCount = enrolments.filter((e) => e.status === 'approved').length;
  const rejectedCount = enrolments.filter((e) => e.status === 'rejected').length;

  // Gate screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080C14] text-white">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#0E1422] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
              RESTRICTED ACCESS
            </span>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              GAME/Z Admin Gateway
            </h2>
            <p className="text-xs text-slate-400">
              Tournament Director & Enrolment Operations Console
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
                placeholder="Enter admin ID"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
                placeholder="•••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-600/20"
            >
              Unlock Admin Portal
            </button>
          </form>

          {/* Lower Bottom Contact Info */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <p className="flex items-center justify-center gap-1.5 text-cyan-400 font-mono font-medium">
              <Phone className="w-3.5 h-3.5" />
              <span>Admin Assistance: 9083641195</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="h-16 px-6 bg-[#0B0F1A] border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
            title="Return to Public App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black font-display text-white">
                GAME/Z <span className="text-rose-500">ADMIN OPERATIONS</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                ACTIVE OPERATOR: GAMAMALE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Tournament Enrolments & Applicant Verification Desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:9083641195"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 flex items-center gap-1.5 hover:border-cyan-500/40"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">9083641195</span>
          </a>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Log Out of Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Viewport */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0E1422] border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-400">Total Enrolments</span>
            <p className="text-2xl font-black font-mono text-white mt-1">{enrolments.length}</p>
            <span className="text-[10px] text-slate-400">Across all tournaments</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1422] border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Pending Review
            </span>
            <p className="text-2xl font-black font-mono text-amber-400 mt-1">{pendingCount}</p>
            <span className="text-[10px] text-slate-400">Requires slot action</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1422] border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Approved Entries
            </span>
            <p className="text-2xl font-black font-mono text-emerald-400 mt-1">{approvedCount}</p>
            <span className="text-[10px] text-slate-400">Seeded into bracket</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1422] border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-rose-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Rejected
            </span>
            <p className="text-2xl font-black font-mono text-rose-400 mt-1">{rejectedCount}</p>
            <span className="text-[10px] text-slate-400">Ineligible or fake proof</span>
          </div>
        </div>

        {/* Netlify One-Click Deployment Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1524] via-[#0E1B33] to-[#0A111F] border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-cyan-500/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>Netlify Deployment Package Ready</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  gamez-netlify-build.zip
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Your production build is packaged with <span className="font-mono text-cyan-300">netlify.toml</span> and SPA redirects. Download the package and drop it directly onto Netlify Drop.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="/gamez-netlify-build.zip"
              download="gamez-netlify-build.zip"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Download Deploy ZIP</span>
            </a>

            <a
              href="https://app.netlify.com/drop"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              <span>Open Netlify Drop ↗</span>
            </a>
          </div>
        </div>

        {/* Admin File Upload Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0E1422] to-[#121B2F] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-display">
                Admin Tournament File & Rule Sheet Uploader
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Upload official rulebooks, match schedules, or custom bracket seeds (PDF, PNG, JPG).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors shadow-md shadow-cyan-500/20">
              <UploadCloud className="w-4 h-4" />
              <span>Choose & Upload File</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
            {adminUploadedFile && (
              <span className="text-xs font-mono text-emerald-400 truncate max-w-[200px]">
                Uploaded: {adminUploadedFile.name} ({adminUploadedFile.size})
              </span>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-[#0E1422] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({enrolments.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'pending' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'approved' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Approved ({approvedCount})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  statusFilter === 'rejected' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rejected ({rejectedCount})
              </button>
            </div>

            {/* Tournament Selector */}
            <select
              value={tournamentFilter}
              onChange={(e) => setTournamentFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Tournaments</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applicant, IGN, team..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Enrolment Requests Table */}
        <div className="rounded-2xl bg-[#0E1422] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F1A] border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Applicant & IGN</th>
                  <th className="py-3 px-4">Tournament</th>
                  <th className="py-3 px-4">Team / Mode</th>
                  <th className="py-3 px-4">Contact / Discord</th>
                  <th className="py-3 px-4">File Proof</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEnrolments.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-850/50 transition-colors">
                    {/* Applicant & IGN */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-white">{req.applicantName}</p>
                        <p className="font-mono text-[11px] text-cyan-400">{req.ign}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{req.submittedAt}</span>
                      </div>
                    </td>

                    {/* Tournament */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-200 block truncate max-w-[180px]">
                        {req.tournamentTitle}
                      </span>
                    </td>

                    {/* Team & Mode */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-white block">{req.teamName}</span>
                        <span className="text-[10px] font-mono uppercase text-slate-400">
                          {req.mode === 'squad' ? 'Squad Entry' : 'Solo Entry'}
                        </span>
                      </div>
                    </td>

                    {/* Discord & Contact */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                      <div>
                        <p>{req.discordTag}</p>
                        {req.contactNumber && (
                          <p className="text-slate-400 text-[10px]">{req.contactNumber}</p>
                        )}
                      </div>
                    </td>

                    {/* Uploaded File Proof */}
                    <td className="py-3.5 px-4">
                      {req.fileProofName || req.fileProofUrl ? (
                        <button
                          onClick={() =>
                            setPreviewFile({
                              name: req.fileProofName || 'proof_document.png',
                              url: req.fileProofUrl,
                            })
                          }
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium transition-colors"
                        >
                          <FileImage className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="truncate max-w-[110px]">{req.fileProofName || 'Inspect Proof'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">No file</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4">
                      {req.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : req.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Action Controls */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status !== 'approved' && (
                          <button
                            onClick={() => onUpdateStatus(req.id, 'approved')}
                            className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {req.status !== 'rejected' && (
                          <button
                            onClick={() => onUpdateStatus(req.id, 'rejected')}
                            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lower Bottom Support Bar with the exact contact number requested */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 mt-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold">Admin Helpline & Difficulties Support:</span>
              <span className="ml-2 font-mono text-cyan-400 font-bold text-sm">9083641195</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:9083641195"
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Direct Dial: 9083641195
            </a>
            <a
              href="https://wa.me/919083641195"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </main>

      {/* File Lightbox Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="p-6 rounded-2xl bg-[#0A0E17] border border-slate-800 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  Uploaded Verification Proof
                </h4>
                <p className="text-xs text-slate-400 font-mono">{previewFile.name}</p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
              {previewFile.url ? (
                <img
                  src={previewFile.url}
                  alt="Applicant Proof"
                  className="max-h-72 object-contain rounded-lg shadow-lg"
                />
              ) : (
                <>
                  <FileText className="w-12 h-12 text-cyan-400 animate-pulse" />
                  <p className="text-xs text-slate-300 font-medium">
                    {previewFile.name}
                  </p>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    File integrity verified by system
                  </span>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
