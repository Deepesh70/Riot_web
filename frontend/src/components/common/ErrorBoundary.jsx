import React, { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught component error in ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-lg w-full bg-dark-800 border border-accent-primary/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/10 text-accent-primary mb-6 border border-accent-primary/20">
              <FiAlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold tracking-wider uppercase font-riot mb-2 text-white">
              System Anomaly Detected
            </h1>
            <p className="text-white/60 text-sm mb-6 leading-relaxed">
              An unexpected glitch occurred while rendering this interface. Our technicians have been notified.
            </p>

            {Boolean(import.meta.env?.DEV) && this.state.error && (
              <div className="text-left bg-black/60 rounded-lg p-3 mb-6 border border-white/10 text-xs font-mono text-accent-primary overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-blue-400 text-black font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-accent-primary/20 active:scale-95 cursor-pointer"
              >
                <FiRefreshCw className="w-4 h-4" />
                Reload Protocol
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 border border-white/10 active:scale-95 cursor-pointer"
              >
                <FiHome className="w-4 h-4" />
                Return to Hub
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
