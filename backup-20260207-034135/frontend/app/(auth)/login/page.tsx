"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckSquare, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.detail || "Sign in failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    backgroundColor: "#fafafa",
  };

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "448px",
  };

  const logoContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "40px",
  };

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const iconBoxStyle: React.CSSProperties = {
    width: "44px",
    height: "44px",
    backgroundColor: "#0a1628",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.025em",
  };

  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "32px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "12px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "15px",
    color: "#64748b",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const cardContentStyle: React.CSSProperties = {
    padding: "32px",
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "20px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    marginBottom: "10px",
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: "relative",
  };

  const inputIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    color: "#94a3b8",
    pointerEvents: "none",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "46px",
    paddingLeft: "52px",
    paddingRight: "16px",
    fontSize: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  };

  const passwordInputStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: "48px",
  };

  const eyeButtonStyle: React.CSSProperties = {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: "0",
    display: "flex",
    alignItems: "center",
  };

  const passwordHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  };

  const forgotLinkStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#0a1628",
    textDecoration: "none",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    height: "46px",
    backgroundColor: "#0a1628",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "24px",
    marginBottom: "8px",
    transition: "all 0.2s",
  };

  const dividerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    margin: "32px 0",
  };

  const dividerLineStyle: React.CSSProperties = {
    flex: 1,
    height: "1px",
    backgroundColor: "#e2e8f0",
  };

  const dividerTextStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#94a3b8",
  };

  const socialButtonStyle: React.CSSProperties = {
    width: "100%",
    height: "46px",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#334155",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "12px",
    transition: "all 0.2s",
  };

  const signUpTextStyle: React.CSSProperties = {
    marginTop: "32px",
    textAlign: "center",
    fontSize: "14px",
    color: "#475569",
  };

  const linkStyle: React.CSSProperties = {
    fontWeight: "600",
    color: "#0a1628",
    textDecoration: "none",
  };

  const errorStyle: React.CSSProperties = {
    marginBottom: "24px",
    padding: "16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#dc2626",
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        {/* Logo */}
        <div style={logoContainerStyle}>
          <div style={logoStyle}>
            <div style={iconBoxStyle}>
              <CheckSquare size={22} color="white" strokeWidth={2.5} />
            </div>
            <span style={logoTextStyle}>Workspace</span>
          </div>
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>Welcome back</h1>
          <p style={subtitleStyle}>Enter your credentials to access your workspace</p>
        </div>

        {/* Form Card */}
        <div style={cardStyle}>
          <div style={cardContentStyle}>
            {error && (
              <div style={errorStyle}>
                <p style={errorTextStyle}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={formGroupStyle}>
                <label htmlFor="email" style={labelStyle}>
                  Email address
                </label>
                <div style={inputWrapperStyle}>
                  <Mail style={inputIconStyle} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={formGroupStyle}>
                <div style={passwordHeaderStyle}>
                  <label htmlFor="password" style={labelStyle}>
                    Password
                  </label>
                  <Link href="/forgot-password" style={forgotLinkStyle}>
                    Forgot?
                  </Link>
                </div>
                <div style={inputWrapperStyle}>
                  <Lock style={inputIconStyle} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={passwordInputStyle}
                    placeholder="•••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeButtonStyle}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? (
                  <>
                    <div style={{ width: "20px", height: "20px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={dividerStyle}>
              <div style={dividerLineStyle} />
              <span style={dividerTextStyle}>or continue with</span>
              <div style={dividerLineStyle} />
            </div>

            {/* Social Login */}
            <button style={socialButtonStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button style={{ ...socialButtonStyle, marginBottom: 0 }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p style={signUpTextStyle}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={linkStyle}>
            Sign up
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #0a1628 !important;
          box-shadow: 0 0 0 3px rgba(10, 22, 40, 0.1) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
