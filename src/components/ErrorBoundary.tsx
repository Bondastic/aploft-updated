"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export function ErrorFallback({
  onReset,
  title = "Noget gik galt",
  message = "Lingua tabte tråden et øjeblik. Prøv igen, så er vi tilbage. Dine fremskridt er gemt på denne enhed.",
}: {
  onReset: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <p className="eyebrow">Fejl</p>
      <h1 className="page-title mt-2">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">{message}</p>
      <button onClick={onReset} className="btn btn-primary mt-6 px-6 py-2.5">
        Prøv igen
      </button>
    </div>
  );
}

/**
 * Fang uventede render-fejl i klienten, så eleven ser en venlig skærm
 * i stedet for Next.js' rå fejloverlay. Bruges både her og i app/error.tsx.
 */
export default class ErrorBoundary extends Component<
  { children: ReactNode; onReset?: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AP Klar fejl:", error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.reset} />;
    }
    return this.props.children;
  }
}
