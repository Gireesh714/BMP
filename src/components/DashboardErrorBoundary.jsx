import { Component } from 'react';

export default class DashboardErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error instanceof Error ? error.message : 'Unknown dashboard error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="loading-card error">
          <h1>Dashboard rendering issue</h1>
          <p>{this.state.message}</p>
          <p>The workbook loaded, but one of the visual components failed to render.</p>
        </section>
      );
    }

    return this.props.children;
  }
}
