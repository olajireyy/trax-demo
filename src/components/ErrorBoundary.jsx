import React from 'react';

/**
 * React Error Boundary — catches render errors in child components
 * and shows a fallback UI instead of crashing the entire app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    // TODO: Send to Sentry when integrated
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
          color: '#a0a0b0',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}>
            🎵
          </div>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#e0e0f0',
            marginBottom: '0.5rem',
          }}>
            Something went wrong
          </h2>
          <p style={{
            fontSize: '0.875rem',
            maxWidth: '400px',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
          }}>
            Trax hit an unexpected error. Try refreshing the page or going back.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: '#a0a0b0',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
