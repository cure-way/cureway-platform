import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ===================================================================
// ERROR BOUNDARY
// ===================================================================

interface Props   { children: ReactNode; fallback?: ReactNode; onReset?: () => void; }
interface State   { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error-light flex items-center justify-center">
              <AlertTriangle size={40} className="text-error" />
            </div>
            <h2 className="text-t-21 font-bold text-foreground mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-t-14 text-muted-foreground mb-6">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <button
              onClick={this.handleReset}
              className="btn btn-lg btn-primary w-full flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              <span>Try Again</span>
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-t-12 text-muted-foreground hover:text-foreground">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-neutral-light rounded-lg text-t-10 overflow-auto max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
