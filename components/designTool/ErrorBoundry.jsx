import { Component } from 'react';
import { SERVER_URL } from './constants';

export class GlobalError extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined
    };
  }

  // Lifecycle method to catch errors in child components
  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo: errorInfo?.componentStack || ''
    });

    // Post error data to your server
    this.postErrorToServer(error, errorInfo);
  }

  // Function to send error data to your server
  async postErrorToServer(error, errorInfo) {
    try {
      await fetch(`${SERVER_URL}/logging/app/error`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error_message: error.message,
          error_stack: error.stack,
          component_stack: errorInfo?.componentStack || '',
          error_timestamp: new Date().toISOString(),
          domain: window.location.origin,
          page: window.location.pathname,
          metadata: {
            userAgent: navigator.userAgent,
            appVersion: navigator.appVersion,
            platform: navigator.platform
          }
        })
      });
    } catch (serverError) {
      console.error('Failed to send error data to server:', serverError);
    }
  }

  render() {
    if (this.state.hasError) {
      // Display fallback UI
      return (
        <div style={{ padding: '20px', background: '#fdd', color: '#900' }}>
          <h1>Something went wrong.</h1>
          <p>
            An unexpected error has occurred. Our team has been notified. Please refresh the page or
            try again later.
          </p>
        </div>
      );
    }

    // Render child components normally
    return this.props.children;
  }
}
