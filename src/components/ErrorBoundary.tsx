import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f1d] text-[#FFF7E6] flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#111c35] border-2 border-[#F5B942] text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F43F5E]/20 border-2 border-[#F43F5E] flex items-center justify-center text-[#F43F5E]">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-cinzel font-black text-retro-gold">
              DAD PROTOCOL PAUSED
            </h2>
            <p className="text-sm text-zinc-300 font-sans">
              "Something took an unexpected detour, like Dad's shortcut through the industrial estate."
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-xl bg-[#F5B942] hover:bg-[#ffc85a] text-neutral-950 font-arcade text-xs uppercase tracking-wider font-black flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RESTART EXPERIENCE</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

