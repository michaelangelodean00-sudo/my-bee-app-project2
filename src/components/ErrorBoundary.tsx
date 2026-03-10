import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log error to external service in production
    if (!import.meta.env.DEV) {
      // Here you would typically send to error tracking service
      console.error('Production error logged:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  private handleRefresh = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4 p-3 bg-muted rounded-lg text-xs">
                  <summary className="cursor-pointer font-medium mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="whitespace-pre-wrap text-destructive">
                    {this.state.error.message}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 whitespace-pre-wrap text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={this.handleRefresh}
                  variant="outline"
                  className="flex-1"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  className="flex-1"
                  size="sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;