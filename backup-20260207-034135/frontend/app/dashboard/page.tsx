"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Clock,
  TrendingUp,
  Check,
  X,
  Edit3,
  Trash2,
  LogOut,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

type FilterType = "all" | "pending" | "completed";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [isMobile, setIsMobile] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      params.append("sort", "created");
      params.append("order", "desc");

      const response = await api.get<Task[]>(`/api/tasks?${params.toString()}`);
      setTasks(response);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask() {
    if (!formData.title.trim()) return;
    try {
      const newTask = await api.post<Task>("/api/tasks", formData);
      setTasks((prev) => [newTask, ...prev]);
      setShowForm(false);
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/login";
  }

  async function handleUpdateTask(id: number, data: typeof formData) {
    try {
      const updated = await api.put<Task>(`/api/tasks/${id}`, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setEditingId(null);
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  async function handleDeleteTask(id: number) {
    if (deletingIds.has(id)) return;
    setDeletingIds((prev) => new Set(prev).add(id));
    try {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await api.delete(`/api/tasks/${id}`);
    } catch (error) {
      console.error("Failed to delete task:", error);
      fetchTasks();
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  async function handleToggleComplete(id: number) {
    if (deletingIds.has(id)) return;
    setTasks((prev) => prev.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    try {
      const updated = await api.patch<Task>(`/api/tasks/${id}/complete`);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Failed to toggle task:", error);
      setTasks((prev) => prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0,
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  const dayOffset = currentDay === 0 ? 6 : currentDay - 1;
  monday.setDate(today.getDate() - dayOffset);
  monday.setHours(0, 0, 0, 0);

  const weeklyActivity = weekDays.map((day, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const dayTasks = tasks.filter(t => {
      const taskDate = new Date(t.created_at);
      return taskDate.toDateString() === dayDate.toDateString();
    }).length;
    return { day, tasks: dayTasks };
  });

  const maxTasks = Math.max(5, ...weeklyActivity.map(d => d.tasks));

  // Styles
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  };

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  };

  const headerInnerStyle: React.CSSProperties = {
    display: "flex",
    height: "64px",
    alignItems: "center",
  };

  const logoSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 24px",
    borderRight: "1px solid #e5e7eb",
  };

  const iconBoxStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    backgroundColor: "#0a1628",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    letterSpacing: "-0.025em",
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "0 16px",
  };

  const navButtonStyle: React.CSSProperties = {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#475569",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const navButtonActiveStyle: React.CSSProperties = {
    ...navButtonStyle,
    backgroundColor: "#0a1628",
    color: "#ffffff",
  };

  const rightSectionStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "0 24px",
  };

  const searchWrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "256px",
  };

  const searchIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "16px",
    color: "#94a3b8",
    pointerEvents: "none",
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    height: "36px",
    paddingLeft: "36px",
    paddingRight: "12px",
    fontSize: "14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
  };

  const buttonStyle: React.CSSProperties = {
    height: "36px",
    padding: "0 16px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#0a1628",
    color: "#ffffff",
  };

  const accentButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#f59e0b",
    color: "#ffffff",
  };

  const userButtonStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    padding: 0,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const mainStyle: React.CSSProperties = {
    padding: "24px",
  };

  const mainContentStyle: React.CSSProperties = {
    maxWidth: "1280px",
    margin: "0 auto",
  };

  const headerSectionStyle: React.CSSProperties = {
    marginBottom: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "2px",
  };

  const statsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const cardContentStyle: React.CSSProperties = {
    padding: "20px",
  };

  const statsCardInnerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const statsLabelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
  };

  const statsValueStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "4px",
  };

  const statsIconStyle: React.CSSProperties = {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const contentGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
  };

  const cardHeaderStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  };

  const filterContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "4px",
  };

  const filterButtonStyle: React.CSSProperties = {
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "500",
    borderRadius: "6px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const filterButtonActiveStyle: React.CSSProperties = {
    ...filterButtonStyle,
    backgroundColor: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  };

  const taskItemStyle: React.CSSProperties = {
    padding: "14px 20px",
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s",
  };

  const taskItemInnerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  };

  const checkboxStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
    transition: "all 0.2s",
  };

  const checkboxCheckedStyle: React.CSSProperties = {
    ...checkboxStyle,
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  };

  const taskTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
  };

  const taskTitleCompletedStyle: React.CSSProperties = {
    ...taskTitleStyle,
    textDecoration: "line-through",
    color: "#94a3b8",
  };

  const taskDescStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "2px",
  };

  const taskDescCompletedStyle: React.CSSProperties = {
    ...taskDescStyle,
    textDecoration: "line-through",
    color: "#94a3b8",
  };

  const taskMetaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "8px",
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: "12px",
    padding: "2px 8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    color: "#475569",
    borderRadius: "6px",
  };

  const dateStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const moreButtonStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "all 0.2s",
  };

  const weeklyItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  };

  const weeklyLabelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "500",
    width: "32px",
    color: "#64748b",
  };

  const weeklyBarStyle: React.CSSProperties = {
    flex: 1,
    height: "28px",
    backgroundColor: "#f1f5f9",
    borderRadius: "9999px",
    overflow: "hidden",
  };

  const weeklyCountStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "500",
    width: "24px",
    textAlign: "right",
    color: "#64748b",
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "448px",
  };

  const modalHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
  };

  const closeButtonStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalBodyStyle: React.CSSProperties = {
    padding: "24px",
  };

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "20px",
  };

  const formLabelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    marginBottom: "8px",
  };

  const modalInputStyle: React.CSSProperties = {
    width: "100%",
    height: "42px",
    padding: "0 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    outline: "none",
    boxSizing: "border-box",
    marginTop: "8px",
  };

  const textareaStyle: React.CSSProperties = {
    ...modalInputStyle,
    minHeight: "80px",
    paddingTop: "10px",
    resize: "none",
    fontFamily: "inherit",
  };

  const modalFooterStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f8fafc",
    borderRadius: "0 0 16px 16px",
  };

  const cancelButtonStyle: React.CSSProperties = {
    flex: 1,
    height: "40px",
    padding: "0 16px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    backgroundColor: "transparent",
    color: "#334155",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const submitButtonStyle: React.CSSProperties = {
    flex: 1,
    height: "40px",
    padding: "0 16px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#0a1628",
    color: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const emptyStateStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 16px",
  };

  const emptyIconStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    marginBottom: "4px",
  };

  const emptyDescStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "16px",
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 16px",
    fontSize: "14px",
    color: "#64748b",
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Calendar", href: "/calendar" },
    { label: "Tasks", href: "/tasks" },
    { label: "Reports", href: "/reports" },
    { label: "Settings", href: "/settings" },
  ];

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          {/* Logo */}
          <div style={logoSectionStyle}>
            <div style={iconBoxStyle}>
              <CheckSquare size={18} color="white" strokeWidth={2} />
            </div>
            <div style={logoTextStyle}>Workspace</div>
          </div>

          {/* Navigation */}
          <nav style={navStyle}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ textDecoration: "none", display: "inline-block" }}
              >
                <button
                  style={item.label === "Dashboard" ? navButtonActiveStyle : navButtonStyle}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div style={rightSectionStyle}>
            {/* Search */}
            <div style={searchWrapperStyle}>
              <Search style={searchIconStyle} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            {/* New Task Button */}
            <button style={accentButtonStyle} onClick={() => setShowForm(true)}>
              <Plus size={16} />
              New Task
            </button>

            {/* User Menu */}
            <button style={userButtonStyle} onClick={handleSignOut}>
              <LogOut size={16} style={{ color: "#dc2626" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        <div style={mainContentStyle}>
          {/* Page Header */}
          <div style={headerSectionStyle}>
            <h2 style={titleStyle}>Dashboard</h2>
            <p style={subtitleStyle}>Overview of your tasks and activity</p>
          </div>

          {/* Stats Grid */}
          <div style={statsGridStyle}>
            <div style={cardStyle}>
              <div style={cardContentStyle}>
                <div style={statsCardInnerStyle}>
                  <div>
                    <p style={statsLabelStyle}>Total Tasks</p>
                    <p style={statsValueStyle}>{stats.total}</p>
                  </div>
                  <div style={{...statsIconStyle, backgroundColor: "#f1f5f9"}}>
                    <CheckSquare size={20} style={{ color: "#334155" }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardContentStyle}>
                <div style={statsCardInnerStyle}>
                  <div>
                    <p style={statsLabelStyle}>Completed</p>
                    <p style={{...statsValueStyle, color: "#10b981"}}>{stats.completed}</p>
                  </div>
                  <div style={{...statsIconStyle, backgroundColor: "#ecfdf5"}}>
                    <Check size={20} style={{ color: "#10b981" }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardContentStyle}>
                <div style={statsCardInnerStyle}>
                  <div>
                    <p style={statsLabelStyle}>Pending</p>
                    <p style={{...statsValueStyle, color: "#f59e0b"}}>{stats.pending}</p>
                  </div>
                  <div style={{...statsIconStyle, backgroundColor: "#fef3c7"}}>
                    <Clock size={20} style={{ color: "#d97706" }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={cardContentStyle}>
                <div style={statsCardInnerStyle}>
                  <div>
                    <p style={statsLabelStyle}>Progress</p>
                    <p style={{...statsValueStyle, color: "#0a1628"}}>{stats.completionRate}%</p>
                  </div>
                  <div style={{...statsIconStyle, backgroundColor: "rgba(10, 22, 40, 0.1)"}}>
                    <TrendingUp size={20} style={{ color: "#0a1628" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div style={contentGridStyle}>
            {/* Tasks Section */}
            <div style={{ flex: 1 }}>
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h3 style={cardTitleStyle}>Tasks</h3>
                  <div style={filterContainerStyle}>
                    {(["all", "pending", "completed"] as FilterType[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={filter === f ? filterButtonActiveStyle : filterButtonStyle}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  {loading ? (
                    <div style={loadingStyle}>Loading tasks...</div>
                  ) : filteredTasks.length === 0 ? (
                    <div style={emptyStateStyle}>
                      <div style={emptyIconStyle}>
                        <CheckSquare size={24} style={{ color: "#94a3b8" }} />
                      </div>
                      <p style={emptyTitleStyle}>No tasks yet</p>
                      <p style={emptyDescStyle}>Create your first task to get started</p>
                      <button style={primaryButtonStyle} onClick={() => setShowForm(true)}>
                        <Plus size={16} />
                        Create Task
                      </button>
                    </div>
                  ) : (
                    filteredTasks.map((task, index) => (
                      <div
                        key={task.id}
                        style={{
                          ...taskItemStyle,
                          backgroundColor: index % 2 === 0 ? "transparent" : "#f8fafc",
                          opacity: task.completed ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                          const btn = e.currentTarget.querySelector('.more-btn');
                          if (btn) (btn as HTMLElement).style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          const btn = e.currentTarget.querySelector('.more-btn');
                          if (btn) (btn as HTMLElement).style.opacity = "0";
                        }}
                      >
                        <div style={taskItemInnerStyle}>
                          <button
                            onClick={() => handleToggleComplete(task.id)}
                            style={task.completed ? checkboxCheckedStyle : checkboxStyle}
                          >
                            {task.completed && <Check size={14} color="white" />}
                          </button>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={task.completed ? taskTitleCompletedStyle : taskTitleStyle}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p style={task.completed ? taskDescCompletedStyle : taskDescStyle}>
                                {task.description}
                              </p>
                            )}
                            <div style={taskMetaStyle}>
                              <span style={badgeStyle}>Task</span>
                              <span style={dateStyle}>
                                <Clock size={12} />
                                {new Date(task.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            className="more-btn"
                            style={{...moreButtonStyle, opacity: 0}}
                            onClick={() => {
                              if (window.confirm("Delete this task?")) {
                                handleDeleteTask(task.id);
                              }
                            }}
                          >
                            <Trash2 size={16} style={{ color: "#dc2626" }} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Activity */}
            <div style={{ width: "100%" }}>
              <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <h3 style={cardTitleStyle}>Weekly Activity</h3>
                </div>
                <div style={cardContentStyle}>
                  {weeklyActivity.map((item, index) => {
                    const isToday = index === (currentDay === 0 ? 6 : currentDay - 1);
                    const percentage = maxTasks > 0 ? (item.tasks / maxTasks) * 100 : 0;
                    return (
                      <div key={item.day} style={weeklyItemStyle}>
                        <span style={{...weeklyLabelStyle, color: isToday ? "#f59e0b" : "#64748b"}}>
                          {item.day}
                        </span>
                        <div style={weeklyBarStyle}>
                          <div
                            style={{
                              height: "100%",
                              backgroundColor: isToday ? "#f59e0b" : "#cbd5e1",
                              borderRadius: "9999px",
                              width: `${Math.max(percentage, 5)}%`,
                              transition: "all 0.5s",
                            }}
                          />
                        </div>
                        <span style={{...weeklyCountStyle, color: isToday ? "#f59e0b" : "#64748b", fontWeight: isToday ? "600" : "400"}}>
                          {item.tasks}
                        </span>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>This week</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                        {weeklyActivity.reduce((sum, d) => sum + d.tasks, 0)} tasks
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {showForm || editingId !== null ? (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>
                {editingId ? "Edit Task" : "New Task"}
              </h2>
              <button
                style={closeButtonStyle}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: "", description: "" });
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={modalBodyStyle}>
              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Title</label>
                <input
                  style={modalInputStyle}
                  placeholder="Task title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div style={formGroupStyle}>
                <label style={formLabelStyle}>Description</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Add details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button
                style={cancelButtonStyle}
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: "", description: "" });
                }}
              >
                Cancel
              </button>
              <button
                style={submitButtonStyle}
                onClick={() => {
                  if (editingId) {
                    handleUpdateTask(editingId, formData);
                  } else {
                    handleCreateTask();
                  }
                }}
                disabled={!formData.title.trim()}
              >
                {editingId ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .content-grid { grid-template-columns: 2fr 1fr !important; }
        }
        input:focus {
          border-color: #0a1628 !important;
          box-shadow: 0 0 0 3px rgba(10, 22, 40, 0.1) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .task-item:hover {
          background-color: #f8fafc !important;
        }
      `}</style>
    </div>
  );
}
