"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  User,
  Bell,
  Shield,
  Database,
  Info,
  LogOut,
  Mail,
  Key,
  Globe,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Check,
  X,
  Camera,
  Palette,
} from "lucide-react";
import { api } from "@/lib/api";

type SettingsTab = "profile" | "account" | "preferences" | "notifications" | "security" | "data";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "",
    avatar: "",
  });

  const [accountForm, setAccountForm] = useState({
    username: "johndoe",
    timezone: "America/New_York",
    language: "en",
  });

  const [preferencesForm, setPreferencesForm] = useState({
    theme: "system",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    defaultView: "dashboard",
    weekStartsOn: "sunday",
  });

  const [notificationsForm, setNotificationsForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyDigest: true,
    taskUpdates: true,
    securityAlerts: true,
    reminderTime: "09:00",
    digestDay: "monday",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/login";
  }

  async function handleSave(section: string) {
    setSaving(true);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSaving(false);
    setSaveSuccess(true);

    setTimeout(() => setSaveSuccess(false), 3000);
  }

  // Styles
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#fafafa",
    padding: "0",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: "#0a1628",
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const logoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "700",
  };

  const logoIconStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    backgroundColor: "#f59e0b",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0a1628",
  };

  const navContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const navButtonStyle: React.CSSProperties = {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#94a3b8",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const navButtonActiveStyle: React.CSSProperties = {
    ...navButtonStyle,
    color: "#0a1628",
    backgroundColor: "#f59e0b",
  };

  const headerActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const signOutButtonStyle: React.CSSProperties = {
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const mainContentStyle: React.CSSProperties = {
    display: "flex",
    minHeight: "calc(100vh - 84px)",
  };

  const sidebarStyle: React.CSSProperties = {
    width: "280px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: "32px 24px",
    flexShrink: 0,
  };

  const sidebarTitleStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "16px",
  };

  const sidebarSectionStyle: React.CSSProperties = {
    marginBottom: "32px",
  };

  const sidebarItemStyle: React.CSSProperties = (isActive: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: isActive ? "#0a1628" : "#64748b",
    backgroundColor: isActive ? "#f59e0b" : "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    marginBottom: "4px",
  });

  const sidebarDividerStyle: React.CSSProperties = {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "16px 0",
  };

  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    padding: "32px 48px",
    overflowY: "auto",
  };

  const contentHeaderStyle: React.CSSProperties = {
    marginBottom: "32px",
  };

  const contentTitleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0a1628",
    margin: "0 0 8px 0",
  };

  const contentSubtitleStyle: React.CSSProperties = {
    fontSize: "15px",
    color: "#64748b",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    marginBottom: "24px",
    overflow: "hidden",
  };

  const cardHeaderStyle: React.CSSProperties = {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0a1628",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: "24px",
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "24px",
  };

  const formLabelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    marginBottom: "8px",
  };

  const formInputStyle: React.CSSProperties = {
    width: "100%",
    height: "46px",
    padding: "0 16px",
    fontSize: "14px",
    color: "#0a1628",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  };

  const formTextareaStyle: React.CSSProperties = {
    ...formInputStyle,
    height: "100px",
    padding: "12px 16px",
    resize: "vertical",
    minHeight: "80px",
  };

  const formSelectStyle: React.CSSProperties = {
    ...formInputStyle,
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 16px center",
    paddingRight: "48px",
  };

  const inputGroupStyle: React.CSSProperties = {
    position: "relative",
  };

  const inputIconStyle: React.CSSProperties = {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    cursor: "pointer",
  };

  const formRowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  };

  const buttonStyle: React.CSSProperties = (variant: "primary" | "secondary" | "danger") => ({
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    ...(variant === "primary"
      ? { backgroundColor: "#0a1628", color: "#ffffff" }
      : variant === "danger"
      ? { backgroundColor: "#ef4444", color: "#ffffff" }
      : { backgroundColor: "#ffffff", color: "#0a1628", border: "1px solid #d1d5db" }),
  });

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    paddingTop: "24px",
    borderTop: "1px solid #e2e8f0",
    marginTop: "24px",
  };

  const switchContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #f1f5f9",
  };

  const switchStyle: React.CSSProperties = (checked: boolean) => ({
    width: "48px",
    height: "28px",
    backgroundColor: checked ? "#10b981" : "#d1d5db",
    borderRadius: "9999px",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const switchThumbStyle: React.CSSProperties = (checked: boolean) => ({
    position: "absolute",
    top: "2px",
    left: checked ? "24px" : "2px",
    width: "24px",
    height: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "50%",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s",
  });

  const avatarSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "32px",
  };

  const avatarStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "700",
    color: "#0a1628",
  };

  const avatarUploadStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const avatarButtonStyle: React.CSSProperties = {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#0a1628",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  };

  const dangerZoneStyle: React.CSSProperties = {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "20px",
  };

  const dangerTitleStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: "8px",
  };

  const dangerTextStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#7f1d1d",
    marginBottom: "16px",
    lineHeight: "1.5",
  };

  const themeOptionStyle: React.CSSProperties = (isActive: boolean) => ({
    padding: "16px",
    border: "2px solid",
    borderColor: isActive ? "#f59e0b" : "#e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: isActive ? "#fffbeb" : "#ffffff",
  });

  const radioStyle: React.CSSProperties = (checked: boolean) => ({
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid",
    borderColor: checked ? "#0a1628" : "#d1d5db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const radioDotStyle: React.CSSProperties = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#0a1628",
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <CheckSquare size={18} /> },
    { label: "Calendar", href: "/calendar", icon: <Mail size={18} /> },
    { label: "Tasks", href: "/tasks", icon: <CheckSquare size={18} /> },
    { label: "Reports", href: "/reports", icon: <Database size={18} /> },
    { label: "Settings", href: "/settings", icon: <Shield size={18} /> },
  ];

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: User },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data", icon: Database },
  ];

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={logoStyle}>
          <div style={logoIconStyle}>
            <CheckSquare size={20} style={{ color: "#0a1628" }} />
          </div>
          TaskFlow
        </div>

        <nav style={navContainerStyle}>
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <button style={item.label === "Settings" ? navButtonActiveStyle : navButtonStyle}>
                {item.icon}
                {item.label}
              </button>
            </Link>
          ))}
        </nav>

        <div style={headerActionsStyle}>
          <button onClick={handleSignOut} style={signOutButtonStyle}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContentStyle}>
        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <div style={sidebarTitleStyle}>Settings</div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <div key={tab.id} style={sidebarSectionStyle}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  style={sidebarItemStyle(activeTab === tab.id)}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              </div>
            );
          })}

          <div style={sidebarDividerStyle} />

          <div style={sidebarSectionStyle}>
            <div style={sidebarTitleStyle}>About</div>
            <div style={{ ...sidebarItemStyle(false), cursor: "default" }}>
              <Info size={18} />
              <span>TaskFlow v1.0.0</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div style={contentAreaStyle}>
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <>
              <div style={contentHeaderStyle}>
                <h1 style={contentTitleStyle}>Profile Settings</h1>
                <p style={contentSubtitleStyle}>Manage your personal information and appearance</p>
              </div>

              <div style={cardStyle}>
                <div style={cardBodyStyle}>
                  <div style={avatarSectionStyle}>
                    <div style={avatarStyle}>JD</div>
                    <div style={avatarUploadStyle}>
                      <button style={avatarButtonStyle}>
                        <Camera size={16} />
                        Change Photo
                      </button>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        JPG, PNG or GIF. Max 5MB.
                      </div>
                    </div>
                  </div>

                  <div style={formRowStyle}>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Full Name</label>
                      <input
                        style={formInputStyle}
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Email Address</label>
                      <input
                        style={formInputStyle}
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                  </div>

                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Bio</label>
                    <textarea
                      style={formTextareaStyle}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>

                  <div style={buttonGroupStyle}>
                    <button
                      onClick={() => handleSave("profile")}
                      disabled={saving}
                      style={buttonStyle("primary")}
                    >
                      {saving ? "Saving..." : saveSuccess ? <Check size={16} /> : "Save Changes"}
                      {saveSuccess && " Saved!"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <>
              <div style={contentHeaderStyle}>
                <h1 style={contentTitleStyle}>Account Settings</h1>
                <p style={contentSubtitleStyle}>Manage your account details and preferences</p>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <User size={18} />
                    Account Information
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Username</label>
                    <input
                      style={formInputStyle}
                      value={accountForm.username}
                      onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                      placeholder="Choose a username"
                    />
                  </div>

                  <div style={formRowStyle}>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Timezone</label>
                      <select
                        style={formSelectStyle}
                        value={accountForm.timezone}
                        onChange={(e) => setAccountForm({ ...accountForm, timezone: e.target.value })}
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>

                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Language</label>
                      <select
                        style={formSelectStyle}
                        value={accountForm.language}
                        onChange={(e) => setAccountForm({ ...accountForm, language: e.target.value })}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>

                  <div style={buttonGroupStyle}>
                    <button
                      onClick={() => handleSave("account")}
                      disabled={saving}
                      style={buttonStyle("primary")}
                    >
                      {saving ? "Saving..." : saveSuccess ? <Check size={16} /> : "Save Changes"}
                      {saveSuccess && " Saved!"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <>
              <div style={contentHeaderStyle}>
                <h1 style={contentTitleStyle}>Preferences</h1>
                <p style={contentSubtitleStyle}>Customize your TaskFlow experience</p>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <Palette size={18} />
                    Appearance
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={formLabelStyle}>Theme</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      <div
                        onClick={() => setPreferencesForm({ ...preferencesForm, theme: "light" })}
                        style={themeOptionStyle(preferencesForm.theme === "light")}
                      >
                        <div style={radioStyle(preferencesForm.theme === "light")}>
                          {preferencesForm.theme === "light" && <div style={radioDotStyle} />}
                        </div>
                        <Sun size={20} color="#f59e0b" />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>Light</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>Clean and bright</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setPreferencesForm({ ...preferencesForm, theme: "dark" })}
                        style={themeOptionStyle(preferencesForm.theme === "dark")}
                      >
                        <div style={radioStyle(preferencesForm.theme === "dark")}>
                          {preferencesForm.theme === "dark" && <div style={radioDotStyle} />}
                        </div>
                        <Moon size={20} color="#0a1628" />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>Dark</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>Easy on the eyes</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setPreferencesForm({ ...preferencesForm, theme: "system" })}
                        style={themeOptionStyle(preferencesForm.theme === "system")}
                      >
                        <div style={radioStyle(preferencesForm.theme === "system")}>
                          {preferencesForm.theme === "system" && <div style={radioDotStyle} />}
                        </div>
                        <Monitor size={20} color="#64748b" />
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>System</div>
                          <div style={{ fontSize: "12px", color: "#64748b" }}>Follows OS</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={formRowStyle}>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Date Format</label>
                      <select
                        style={formSelectStyle}
                        value={preferencesForm.dateFormat}
                        onChange={(e) =>
                          setPreferencesForm({ ...preferencesForm, dateFormat: e.target.value })
                        }
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Time Format</label>
                      <select
                        style={formSelectStyle}
                        value={preferencesForm.timeFormat}
                        onChange={(e) =>
                          setPreferencesForm({ ...preferencesForm, timeFormat: e.target.value })
                        }
                      >
                        <option value="12h">12 Hour (AM/PM)</option>
                        <option value="24h">24 Hour</option>
                      </select>
                    </div>
                  </div>

                  <div style={formRowStyle}>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Default View</label>
                      <select
                        style={formSelectStyle}
                        value={preferencesForm.defaultView}
                        onChange={(e) =>
                          setPreferencesForm({ ...preferencesForm, defaultView: e.target.value })
                        }
                      >
                        <option value="dashboard">Dashboard</option>
                        <option value="calendar">Calendar</option>
                        <option value="tasks">Tasks</option>
                      </select>
                    </div>

                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Week Starts On</label>
                      <select
                        style={formSelectStyle}
                        value={preferencesForm.weekStartsOn}
                        onChange={(e) =>
                          setPreferencesForm({ ...preferencesForm, weekStartsOn: e.target.value })
                        }
                      >
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                      </select>
                    </div>
                  </div>

                  <div style={buttonGroupStyle}>
                    <button
                      onClick={() => handleSave("preferences")}
                      disabled={saving}
                      style={buttonStyle("primary")}
                    >
                      {saving ? "Saving..." : saveSuccess ? <Check size={16} /> : "Save Changes"}
                      {saveSuccess && " Saved!"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <>
              <div style={contentHeaderStyle}>
                <h1 style={contentTitleStyle}>Notification Settings</h1>
                <p style={contentSubtitleStyle}>Control how and when you receive notifications</p>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <Bell size={18} />
                    Email Notifications
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div style={switchContainerStyle}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>
                        Email Notifications
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Receive task updates and reminders via email
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setNotificationsForm({
                          ...notificationsForm,
                          emailNotifications: !notificationsForm.emailNotifications,
                        })
                      }
                      style={switchStyle(notificationsForm.emailNotifications)}
                    >
                      <div style={switchThumbStyle(notificationsForm.emailNotifications)} />
                    </div>
                  </div>

                  <div style={switchContainerStyle}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>
                        Task Reminders
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Get reminded about upcoming and overdue tasks
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setNotificationsForm({
                          ...notificationsForm,
                          taskReminders: !notificationsForm.taskReminders,
                        })
                      }
                      style={switchStyle(notificationsForm.taskReminders)}
                    >
                      <div style={switchThumbStyle(notificationsForm.taskReminders)} />
                    </div>
                  </div>

                  <div style={switchContainerStyle}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>
                        Weekly Digest
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Receive a weekly summary of your activity
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setNotificationsForm({
                          ...notificationsForm,
                          weeklyDigest: !notificationsForm.weeklyDigest,
                        })
                      }
                      style={switchStyle(notificationsForm.weeklyDigest)}
                    >
                      <div style={switchThumbStyle(notificationsForm.weeklyDigest)} />
                    </div>
                  </div>

                  {notificationsForm.weeklyDigest && (
                    <div style={{ ...formRowStyle, marginTop: "16px" }}>
                      <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Digest Day</label>
                        <select
                          style={formSelectStyle}
                          value={notificationsForm.digestDay}
                          onChange={(e) =>
                            setNotificationsForm({ ...notificationsForm, digestDay: e.target.value })
                          }
                        >
                          <option value="monday">Monday</option>
                          <option value="tuesday">Tuesday</option>
                          <option value="wednesday">Wednesday</option>
                          <option value="thursday">Thursday</option>
                          <option value="friday">Friday</option>
                          <option value="saturday">Saturday</option>
                          <option value="sunday">Sunday</option>
                        </select>
                      </div>

                      <div style={formGroupStyle}>
                        <label style={formLabelStyle}>Reminder Time</label>
                        <input
                          style={formInputStyle}
                          type="time"
                          value={notificationsForm.reminderTime}
                          onChange={(e) =>
                            setNotificationsForm({ ...notificationsForm, reminderTime: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div style={switchContainerStyle}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>
                        Task Updates
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Notifications when tasks are created or modified
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setNotificationsForm({
                          ...notificationsForm,
                          taskUpdates: !notificationsForm.taskUpdates,
                        })
                      }
                      style={switchStyle(notificationsForm.taskUpdates)}
                    >
                      <div style={switchThumbStyle(notificationsForm.taskUpdates)} />
                    </div>
                  </div>

                  <div style={switchContainerStyle}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>
                        Security Alerts
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Get notified about account security events
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setNotificationsForm({
                          ...notificationsForm,
                          securityAlerts: !notificationsForm.securityAlerts,
                        })
                      }
                      style={switchStyle(notificationsForm.securityAlerts)}
                    >
                      <div style={switchThumbStyle(notificationsForm.securityAlerts)} />
                    </div>
                  </div>

                  <div style={buttonGroupStyle}>
                    <button
                      onClick={() => handleSave("notifications")}
                      disabled={saving}
                      style={buttonStyle("primary")}
                    >
                      {saving ? "Saving..." : saveSuccess ? <Check size={16} /> : "Save Changes"}
                      {saveSuccess && " Saved!"}
                    </button>
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <Bell size={18} />
                    Push Notifications
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div style={switchContainerStyle} style={{ borderBottom: "none" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>
                        Browser Notifications
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>
                        Receive notifications in your browser
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setNotificationsForm({
                          ...notificationsForm,
                          pushNotifications: !notificationsForm.pushNotifications,
                        })
                      }
                      style={switchStyle(notificationsForm.pushNotifications)}
                    >
                      <div style={switchThumbStyle(notificationsForm.pushNotifications)} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <>
              <div style={contentHeaderStyle}>
                <h1 style={contentTitleStyle}>Security Settings</h1>
                <p style={contentSubtitleStyle}>Keep your account secure and protected</p>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <Key size={18} />
                    Change Password
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div style={formGroupStyle}>
                    <label style={formLabelStyle}>Current Password</label>
                    <div style={inputGroupStyle}>
                      <input
                        style={formInputStyle}
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                        }
                        placeholder="Enter current password"
                      />
                      <div
                        style={inputIconStyle}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </div>
                    </div>
                  </div>

                  <div style={formRowStyle}>
                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>New Password</label>
                      <div style={inputGroupStyle}>
                        <input
                          style={formInputStyle}
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          placeholder="Enter new password"
                        />
                        <div
                          style={inputIconStyle}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                      </div>
                    </div>

                    <div style={formGroupStyle}>
                      <label style={formLabelStyle}>Confirm New Password</label>
                      <input
                        style={formInputStyle}
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
                    Password must be at least 8 characters and include uppercase, lowercase, and a
                    number.
                  </div>

                  <div style={buttonGroupStyle}>
                    <button style={buttonStyle("secondary")}>Cancel</button>
                    <button style={buttonStyle("primary")}>Update Password</button>
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <Shield size={18} />
                    Two-Factor Authentication
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628", marginBottom: "8px" }}>
                      Add an extra layer of security to your account
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      When enabled, you'll need to enter a verification code from your mobile device
                      when signing in.
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #86efac",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: "#22c55e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={20} style={{ color: "#ffffff" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "500", color: "#166534" }}>
                        2FA is not enabled
                      </div>
                      <div style={{ fontSize: "12px", color: "#15803d" }}>
                        You can enable two-factor authentication for enhanced security
                      </div>
                    </div>
                    <button style={buttonStyle("primary")}>Enable</button>
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <Globe size={18} />
                    Active Sessions
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div
                    style={{
                      padding: "16px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#dbeafe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Monitor size={20} style={{ color: "#3b82f6" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628" }}>
                          Current Session
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          Windows • Chrome • United States
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 12px",
                        fontSize: "12px",
                        fontWeight: "500",
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        borderRadius: "9999px",
                      }}
                    >
                      Active Now
                    </span>
                  </div>

                  <div style={{ marginTop: "16px", textAlign: "right" }}>
                    <button style={buttonStyle("danger")}>Sign Out All Other Sessions</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Data Management */}
          {activeTab === "data" && (
            <>
              <div style={contentHeaderStyle}>
                <h1 style={contentTitleStyle}>Data Management</h1>
                <p style={contentSubtitleStyle}>Export or delete your account data</p>
              </div>

              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={cardTitleStyle}>
                    <Download size={18} />
                    Export Data
                  </div>
                </div>
                <div style={cardBodyStyle}>
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628", marginBottom: "8px" }}>
                      Download all your data
                    </div>
                    <div style={{ fontSize: "13px", color: "#64748b" }}>
                      Get a copy of all your tasks, settings, and personal information in a
                      machine-readable format.
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button style={buttonStyle("primary")}>
                      <Download size={16} />
                      Export All Data
                    </button>
                    <button style={buttonStyle("secondary")}>
                      <Download size={16} />
                      Export Tasks Only
                    </button>
                  </div>
                </div>
              </div>

              <div style={dangerZoneStyle}>
                <div style={dangerTitleStyle}>
                  <Trash2 size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />
                  Delete Account
                </div>
                <div style={dangerTextStyle}>
                  Once you delete your account, there is no going back. Please be certain. All your
                  tasks, settings, and personal information will be permanently removed.
                </div>
                <button style={buttonStyle("danger")}>
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
