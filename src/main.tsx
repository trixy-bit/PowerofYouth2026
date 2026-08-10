import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import { HashRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import AdminPortal from "./app/AdminPortal.tsx";
import "./styles/index.css";

// ─── Global Error Boundary ────────────────────────────────────────────────────
interface EBState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("💥 App crashed:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #07090f 0%, #0d1020 50%, #07090f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Inter', sans-serif",
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "24px",
              padding: "48px 40px",
              textAlign: "center",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "32px",
              }}
            >
              ✝
            </div>

            {/* Heading */}
            <h1
              style={{
                color: "#ffffff",
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "12px",
                letterSpacing: "-0.3px",
              }}
            >
              Something went wrong
            </h1>

            {/* Message */}
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                lineHeight: "1.6",
                marginBottom: "8px",
              }}
            >
              The page encountered an unexpected error. Your registration data
              is safe — this is a display issue only.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "12px",
                marginBottom: "32px",
              }}
            >
              Power of Youth 2026 · 15 August
            </p>

            {/* Error detail (collapsed) */}
            {this.state.error && (
              <details
                style={{
                  marginBottom: "28px",
                  textAlign: "left",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <summary
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "11px",
                    cursor: "pointer",
                    userSelect: "none",
                    letterSpacing: "0.5px",
                  }}
                >
                  Error details
                </summary>
                <pre
                  style={{
                    color: "rgba(255,100,100,0.8)",
                    fontSize: "11px",
                    marginTop: "8px",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: "1.5",
                  }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Reload button */}
            <button
              onClick={this.handleReload}
              style={{
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #c9a84c, #d4b55f)",
                color: "#07090f",
                fontWeight: "700",
                fontSize: "14px",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                letterSpacing: "0.3px",
                boxShadow: "0 0 24px rgba(201,168,76,0.25)",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              ↺ &nbsp;Reload Page
            </button>

            <p
              style={{
                marginTop: "16px",
                color: "rgba(255,255,255,0.2)",
                fontSize: "11px",
              }}
            >
              If the issue persists, please contact the event team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Mount ────────────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </HashRouter>
  </ErrorBoundary>
);