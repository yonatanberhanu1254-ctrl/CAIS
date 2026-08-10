import React from 'react';

/**
 * Global Error Boundary
 * Catches unhandled React rendering errors and displays a user-friendly
 * fallback instead of a blank white page.
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
    console.error('[CAIS ErrorBoundary]', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#e2e8f0',
          padding: '2rem',
        }}>
          <div style={{
            maxWidth: '480px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: '#f8fafc',
            }}>
              Something went wrong
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: '#94a3b8',
              marginBottom: '1.5rem',
              lineHeight: 1.6,
            }}>
              The CAIS application encountered an unexpected error.
              Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                padding: '0.65rem 1.75rem',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.04)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '0.8rem' }}>
                  Error Details
                </summary>
                <pre style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  background: '#0f172a',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  color: '#f87171',
                  overflow: 'auto',
                  maxHeight: '200px',
                }}>
                  {this.state.error.toString()}
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

export default ErrorBoundary;
