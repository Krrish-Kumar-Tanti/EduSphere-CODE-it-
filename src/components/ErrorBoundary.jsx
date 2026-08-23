import React from 'react';
import { RefreshCw, AlertOctagon, LogOut, Sparkles } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EduSphere Component Crash caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    localStorage.removeItem('edusphere_auth_user');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto ring-2 ring-rose-500/30">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white">EduSphere Safe Mode Recovery</h2>
              <p className="text-xs text-slate-400 mt-1">
                A rendering exception occurred in your session. Don't worry, your data in SQLite is safe!
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 text-left font-mono text-[11px] text-rose-300 max-h-36 overflow-y-auto break-all">
              {this.state.error?.toString() || 'Unknown runtime error'}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Reset Local Session</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
