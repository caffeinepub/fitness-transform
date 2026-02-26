import React, { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.componentName || 'Unknown Component';
    
    console.error('=== Error Boundary Caught Error ===');
    console.error('Component:', componentName);
    console.error('Error:', error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Timestamp:', new Date().toISOString());
    console.error('===================================');

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const componentName = this.props.componentName || 'Component';
      
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full border-destructive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <CardTitle className="text-2xl">Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Component: <span className="text-foreground">{componentName}</span>
                </p>
                {this.state.error && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Error:</p>
                    <p className="text-sm text-destructive font-mono bg-muted p-3 rounded-md">
                      {this.state.error.message}
                    </p>
                  </div>
                )}
                {this.state.error?.stack && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View stack trace
                    </summary>
                    <pre className="mt-2 p-3 bg-muted rounded-md overflow-auto max-h-64 text-xs">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button onClick={this.handleReset} variant="default">
                  Try Again
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline">
                  Go Home
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Check the browser console for more details.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
