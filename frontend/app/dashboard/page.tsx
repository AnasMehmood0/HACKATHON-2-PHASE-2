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
  Search,
  Calendar,
  BarChart3,
  Target,
  Zap,
  MoreHorizontal,
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
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({ title: "", description: "" });

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
      await fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/login";
  }

  async function handleToggleComplete(id: number, completed: boolean) {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await api.put<Task>(`/api/tasks/${id}`, {
        title: task.title,
        description: task.description || "",
        completed: !completed,
      });
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  async function handleUpdateTask(id: number, data: typeof formData) {
    try {
      await api.put<Task>(`/api/tasks/${id}`, data);
      await fetchTasks();
      setEditingId(null);
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  async function handleDeleteTask(id: number) {
    if (deletingIds.has(id)) return;
    if (window.confirm("Are you sure you want to delete this task?")) {
      setDeletingIds((prev) => new Set(prev).add(id));
      try {
        await api.delete(`/api/tasks/${id}`);
        await fetchTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setFormData({ title: task.title, description: task.description || "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({ title: "", description: "" });
  }

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get recent tasks
  const recentTasks = tasks.slice(0, 5);

  // Filter tasks for search
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  const searchBoxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid " + "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "0 16px",
    height: "42px",
  };

  const searchInputStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "14px",
    width: "200px",
  };

  const searchInputPlaceholderStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.5)",
  };

  const addButtonStyle: React.CSSProperties = {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#0a1628",
    backgroundColor: "#f59e0b",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const welcomeSectionStyle: React.CSSProperties = {
    marginBottom: "32px",
  };

  const welcomeTitleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0a1628",
    margin: "0 0 8px 0",
  };

  const welcomeSubtitleStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#64748b",
  };

  const statsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s",
  };

  const statHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  };

  const statIconStyle: React.CSSProperties = (bg: string, color: string) => ({
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const statLabelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: "36px",
    fontWeight: "700",
    color: "#0a1628",
    margin: "8px 0",
  };

  const statChangeStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "500",
  };

  const contentGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
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
    fontSize: "18px",
    fontWeight: "600",
    color: "#0a1628",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const cardBodyStyle: React.CSSProperties = {
    padding: "0",
  };

  const filterBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
  };

  const filterButtonStyle: React.CSSProperties = (isActive: boolean) => ({
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: isActive ? "#0a1628" : "#64748b",
    backgroundColor: isActive ? "#f59e0b" : "transparent",
    border: isActive ? "none" : "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const taskItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.2s",
  };

  const taskCheckboxStyle: React.CSSProperties = (checked: boolean) => ({
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    border: checked ? "none" : "2px solid #d1d5db",
    backgroundColor: checked ? "#10b981" : "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
  });

  const taskContentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const taskTitleStyle: React.CSSProperties = (completed: boolean) => ({
    fontSize: "15px",
    fontWeight: "500",
    color: completed ? "#94a3b8" : "#0a1628",
    textDecoration: completed ? "line-through" : "none",
    marginBottom: "4px",
  });

  const taskDescStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#64748b",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const taskActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: 0,
    transition: "opacity 0.2s",
  };

  const taskActionButtonStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "transparent",
    color: "#64748b",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  };

  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  };

  const modalHeaderStyle: React.CSSProperties = {
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const modalTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0a1628",
  };

  const modalBodyStyle: React.CSSProperties = {
    padding: "24px",
  };

  const modalFooterStyle: React.CSSProperties = {
    padding: "16px 24px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    padding: "0 16px",
    fontSize: "15px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    height: "120px",
    padding: "12px 16px",
    resize: "vertical",
    minHeight: "80px",
  };

  const inputLabelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    marginBottom: "8px",
  };

  const buttonStyle: React.CSSProperties = (variant: "primary" | "secondary") => ({
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    ...(variant === "primary"
      ? { backgroundColor: "#0a1628", color: "#ffffff" }
      : { backgroundColor: "#ffffff", color: "#0a1628", border: "1px solid #d1d5db" }),
  });

  const quickAddCardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%)",
    borderRadius: "16px",
    padding: "24px",
    color: "#ffffff",
  };

  const quickAddTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const quickAddDescStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "16px",
  };

  const emptyStateStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    textAlign: "center",
  };

  const emptyIconStyle: React.CSSProperties = {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <CheckSquare size={18} /> },
    { label: "Calendar", href: "/calendar", icon: <Calendar size={18} /> },
    { label: "Tasks", href: "/tasks", icon: <CheckSquare size={18} /> },
    { label: "Reports", href: "/reports", icon: <BarChart3 size={18} /> },
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
              <button style={item.label === "Dashboard" ? navButtonActiveStyle : navButtonStyle}>
                {item.icon}
                {item.label}
              </button>
            </Link>
          ))}
        </nav>

        <div style={headerActionsStyle}>
          <div style={searchBoxStyle}>
            <Search size={18} style={{ color: "rgba(255,255,255,0.5)", marginRight: "12px" }} />
            <input
              style={searchInputStyle}
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button onClick={() => setShowForm(true)} style={addButtonStyle}>
            <Plus size={18} />
            New Task
          </button>

          <button onClick={handleSignOut} style={signOutButtonStyle}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContentStyle}>
        {/* Welcome Section */}
        <div style={welcomeSectionStyle}>
          <h1 style={welcomeTitleStyle}>Welcome back!</h1>
          <p style={welcomeSubtitleStyle}>Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Grid */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={statIconStyle("#dbeafe", "#3b82f6")}>
                <CheckSquare size={24} style={{ color: "#3b82f6" }} />
              </div>
            </div>
            <div style={statLabelStyle}>Total Tasks</div>
            <div style={statValueStyle}>{totalTasks}</div>
            <div style={{ ...statChangeStyle, color: "#3b82f6" }}>
              <TrendingUp size={16} />
              All your tasks
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={statIconStyle("#dcfce7", "#10b981")}>
                <Check size={24} style={{ color: "#10b981" }} />
              </div>
            </div>
            <div style={statLabelStyle}>Completed</div>
            <div style={statValueStyle}>{completedTasks}</div>
            <div style={{ ...statChangeStyle, color: "#10b981" }}>
              <Check size={16} />
              {completionRate}% done
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={statIconStyle("#fef3c7", "#f59e0b")}>
                <Clock size={24} style={{ color: "#f59e0b" }} />
              </div>
            </div>
            <div style={statLabelStyle}>Pending</div>
            <div style={statValueStyle}>{pendingTasks}</div>
            <div style={{ ...statChangeStyle, color: "#f59e0b" }}>
              <Clock size={16} />
              Needs attention
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={statIconStyle("#fce7f3", "#ec4899")}>
                <Target size={24} style={{ color: "#ec4899" }} />
              </div>
            </div>
            <div style={statLabelStyle}>Progress</div>
            <div style={statValueStyle}>{completionRate}%</div>
            <div style={{ ...statChangeStyle, color: completionRate >= 50 ? "#10b981" : "#ef4444" }}>
              <Zap size={16} />
              {completionRate >= 50 ? "On track" : "Keep going"}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={contentGridStyle}>
          {/* Task List */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={cardTitleStyle}>
                <CheckSquare size={20} />
                Recent Tasks
              </div>
            </div>

            <div style={filterBarStyle}>
              {(["all", "pending", "completed"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={filterButtonStyle(filter === f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div style={cardBodyStyle}>
              {loading ? (
                <div style={emptyStateStyle}>
                  <div style={{ color: "#64748b" }}>Loading tasks...</div>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div style={emptyStateStyle}>
                  <div style={emptyIconStyle}>
                    <CheckSquare size={32} style={{ color: "#94a3b8" }} />
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "500", color: "#0a1628", marginBottom: "8px" }}>
                    No tasks found
                  </div>
                  <div style={{ fontSize: "14px", color: "#64748b" }}>
                    {searchQuery
                      ? "Try adjusting your search"
                      : filter === "completed"
                      ? "No completed tasks yet"
                      : filter === "pending"
                      ? "No pending tasks!"
                      : "Create your first task to get started"}
                  </div>
                </div>
              ) : (
                filteredTasks.slice(0, 8).map((task) => (
                  <div
                    key={task.id}
                    style={taskItemStyle}
                    onMouseEnter={(e) => {
                      const actions = e.currentTarget.querySelector('[data-task-actions]');
                      if (actions) (actions as HTMLElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      const actions = e.currentTarget.querySelector('[data-task-actions]');
                      if (actions) (actions as HTMLElement).style.opacity = "0";
                    }}
                  >
                    <div
                      onClick={() => handleToggleComplete(task.id, task.completed)}
                      style={taskCheckboxStyle(task.completed)}
                    >
                      {task.completed && <Check size={14} style={{ color: "#ffffff" }} />}
                    </div>

                    <div style={taskContentStyle}>
                      <div style={taskTitleStyle(task.completed)}>{task.title}</div>
                      {task.description && (
                        <div style={taskDescStyle}>{task.description}</div>
                      )}
                    </div>

                    <div data-task-actions style={taskActionsStyle}>
                      <button
                        onClick={() => startEdit(task)}
                        style={taskActionButtonStyle}
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ ...taskActionButtonStyle, color: "#ef4444" }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Quick Add Card */}
            <div style={quickAddCardStyle}>
              <div style={quickAddTitleStyle}>
                <Zap size={18} color="#f59e0b" />
                Quick Add
              </div>
              <div style={quickAddDescStyle}>
                Capture tasks quickly without leaving your flow
              </div>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0a1628",
                  backgroundColor: "#f59e0b",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>

            {/* Recent Activity Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={cardTitleStyle}>
                  <Clock size={18} />
                  Recent Activity
                </div>
              </div>
              <div style={cardBodyStyle}>
                {recentTasks.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center", color: "#64748b" }}>
                    No recent activity
                  </div>
                ) : (
                  recentTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 24px",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: task.completed ? "#10b981" : "#f59e0b",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            color: "#0a1628",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {task.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {new Date(task.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showForm && (
        <div style={modalOverlayStyle} onClick={() => setShowForm(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={modalTitleStyle}>Create New Task</div>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} style={{ color: "#64748b" }} />
              </button>
            </div>

            <div style={modalBodyStyle}>
              <div style={{ marginBottom: "16px" }}>
                <label style={inputLabelStyle}>Task Title</label>
                <input
                  style={inputStyle}
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div>
                <label style={inputLabelStyle}>Description (Optional)</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Add a description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button
                onClick={() => setShowForm(false)}
                style={buttonStyle("secondary")}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!formData.title.trim()}
                style={{
                  ...buttonStyle("primary"),
                  opacity: formData.title.trim() ? 1 : 0.5,
                  cursor: formData.title.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Plus size={16} />
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div style={modalOverlayStyle} onClick={cancelEdit}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div style={modalTitleStyle}>Edit Task</div>
              <button
                onClick={cancelEdit}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} style={{ color: "#64748b" }} />
              </button>
            </div>

            <div style={modalBodyStyle}>
              <div style={{ marginBottom: "16px" }}>
                <label style={inputLabelStyle}>Task Title</label>
                <input
                  style={inputStyle}
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div>
                <label style={inputLabelStyle}>Description (Optional)</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Add a description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button onClick={cancelEdit} style={buttonStyle("secondary")}>
                Cancel
              </button>
              <button
                onClick={() => editingId && handleUpdateTask(editingId, formData)}
                disabled={!formData.title.trim()}
                style={{
                  ...buttonStyle("primary"),
                  opacity: formData.title.trim() ? 1 : 0.5,
                  cursor: formData.title.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Check size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
