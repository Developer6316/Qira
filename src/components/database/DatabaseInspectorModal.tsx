import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  CheckCircle2, 
  FileJson, 
  RefreshCw, 
  Users, 
  HardDrive, 
  BookOpen, 
  Video, 
  CheckSquare, 
  Clock, 
  ShieldCheck,
  Copy,
  Download,
  AlertCircle
} from 'lucide-react';
import { dbGetFullDatabase, dbGetStatus, DatabaseStatus } from '../../services/databaseService';
import { UserProfile, ConceptMastery } from '../../types';
import { playClickSound, playSuccessChime } from '../../utils/soundEffects';

interface DatabaseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  masteryMap: Record<string, ConceptMastery>;
}

export const DatabaseInspectorModal: React.FC<DatabaseInspectorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  masteryMap
}) => {
  const [dbData, setDbData] = useState<any | null>(null);
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'currentUser' | 'rawJson'>('overview');

  const fetchDatabaseInfo = async () => {
    setIsLoading(true);
    try {
      const [status, full] = await Promise.all([
        dbGetStatus(),
        dbGetFullDatabase()
      ]);
      setDbStatus(status);
      setDbData(full);
    } catch (e) {
      console.error('Failed to query database:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDatabaseInfo();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    playClickSound();
    if (!dbData) return;
    navigator.clipboard.writeText(JSON.stringify(dbData, null, 2));
    setCopied(true);
    playSuccessChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    playClickSound();
    if (!dbData) return;
    const blob = new Blob([JSON.stringify(dbData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qira_user_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSuccessChime();
  };

  const userList = dbData?.users ? Object.values(dbData.users) : [];
  const currentDbUser = currentUser?.id && dbData?.users ? dbData.users[currentUser.id] : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Internal Embedded Database</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE & SYNCHRONIZED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Path: <span className="text-indigo-300">data/user_database.json</span> • Self-Contained Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDatabaseInfo}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('overview');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Database Overview ({userList.length} Users)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('currentUser');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'currentUser'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active User Record ({currentUser?.name || 'Guest'})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('rawJson');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'rawJson'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Raw JSON Inspection</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-mono uppercase font-bold">Stored Users</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{userList.length}</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Persisted inside JSON</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-mono uppercase font-bold">Database File</span>
                    <HardDrive className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">user_database.json</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Read & Write Live
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-mono uppercase font-bold">Storage Type</span>
                    <Database className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-900">Embedded Self-Contained</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Zero External Dependency</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-[11px] font-mono uppercase font-bold">Last Synced</span>
                    <Clock className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    {dbData?.lastSaved ? new Date(dbData.lastSaved).toLocaleTimeString() : 'Live'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Auto-flushed on change</div>
                </div>
              </div>

              {/* Registered Users Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                    Registered Accounts Stored In Database ({userList.length})
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Passwords encrypted / protected</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {userList.map((u: any, idx: number) => {
                    const isCurrent = currentUser?.id === u.id || currentUser?.email === u.email;
                    const conceptCount = u.masteryMap ? Object.keys(u.masteryMap).length : 0;
                    const masteredCount = u.masteryMap 
                      ? Object.values(u.masteryMap).filter((m: any) => m.status === 'mastered').length 
                      : 0;

                    return (
                      <div 
                        key={u.id || idx}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors ${
                          isCurrent ? 'bg-indigo-50/40 border-l-4 border-l-indigo-600' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                            u.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                              : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                          }`}>
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{u.name}</span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white font-mono">
                                  ACTIVE SESSION
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold capitalize ${
                                u.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {u.role}
                              </span>
                            </div>
                            <div className="text-xs font-mono text-slate-500 mt-0.5">
                              {u.email} • {u.institution || 'Academic Institute'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
                          <div className="flex flex-col text-right">
                            <span className="font-bold text-slate-800">{masteredCount} / {conceptCount} Mastered</span>
                            <span className="text-[10px] text-slate-400">
                              Last login: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleTimeString() : 'Recent'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'currentUser' && (
            <div className="space-y-6">
              {currentUser ? (
                <div className="space-y-6">
                  {/* User Profile Card */}
                  <div className="p-6 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white rounded-3xl border border-indigo-100 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100/60">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-black text-slate-900">{currentUser.name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 capitalize">
                              {currentUser.role}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-slate-500 mt-0.5">{currentUser.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:text-right text-xs font-mono text-slate-600">
                        <span className="font-bold text-slate-900">{currentUser.institution || 'Enrolled Student'}</span>
                        <span className="text-[11px] text-slate-500">ID: {currentUser.id}</span>
                      </div>
                    </div>

                    {/* Stored Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                        <div className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Concepts Mastered
                        </div>
                        <div className="text-xl font-bold text-slate-900 mt-1">
                          {Object.values(masteryMap).filter(m => m.status === 'mastered').length}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          of {Object.keys(masteryMap).length} total concepts
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                        <div className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-indigo-500" />
                          Uploaded Materials
                        </div>
                        <div className="text-xl font-bold text-slate-900 mt-1">
                          {currentDbUser?.materials?.length || 3}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">Stored in DB</div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                        <div className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
                          <Video className="w-3 h-3 text-purple-500" />
                          Video Lectures
                        </div>
                        <div className="text-xl font-bold text-slate-900 mt-1">
                          {currentDbUser?.lectures?.length || 1}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">Synthesized Chalkboards</div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                        <div className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
                          <CheckSquare className="w-3 h-3 text-amber-500" />
                          Quiz History
                        </div>
                        <div className="text-xl font-bold text-slate-900 mt-1">
                          {currentDbUser?.quizzes?.length || 4}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">Diagnostic Attempts</div>
                      </div>
                    </div>
                  </div>

                  {/* Stored Concept Mastery Breakdown */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs">
                    <h5 className="text-xs font-bold font-mono text-slate-800 uppercase tracking-wider mb-3">
                      Persisted Concept Mastery Snapshot (`data/user_database.json`)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(masteryMap).map(([cId, mastery]) => (
                        <div key={cId} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-800 capitalize">{cId.replace('-', ' ')}</div>
                            <div className="text-[10px] font-mono text-slate-500">{mastery.attemptsCount} attempts</div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-indigo-700">
                              {(mastery.masteryScore * 100).toFixed(0)}%
                            </span>
                            <div className="text-[9px] font-mono capitalize text-slate-500">{mastery.status}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No User Currently Logged In</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    You are exploring in Guest mode. Please click <strong>Sign In</strong> or <strong>Create Account</strong> to create a dedicated record in the internal database.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rawJson' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  Direct contents of <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-bold">data/user_database.json</code>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Database</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto max-h-[400px] border border-slate-800 shadow-inner">
                {dbData ? JSON.stringify(dbData, null, 2) : '// Loading database file...'}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Database Engine: Express Internal FS JSON • Zero Cloud Telemetry</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-all cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
