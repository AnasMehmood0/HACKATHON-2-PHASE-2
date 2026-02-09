"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Clock,
  Check,
  X,
  Edit3,
  Trash2,
  LogOut,
  Search,
  Filter,
  Calendar,
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
type SortType = "created" | "title" | "due";
type OrderType = "asc" | "desc";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("created");
  const [order, setOrder] = useState<OrderType>("desc");
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchTasks();
  }, [filter, sortBy, order]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.append("status", filter);
      params.append("sort", sortBy);
      params.append("order", order);

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
      await api.post<Task>("/api/tasks", formData);
      await fetchTasks();
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
        fetchTasks();
      } finally {
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }
  }

  async function handleToggleComplete(id: number) {
    if (deletingIds.has(id)) return;
    setTasks((prev) => prev.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    try {
      await api.patch<Task>(`/api/tasks/${id}/complete`);
      await fetchTasks();
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
  };

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
    maxWidth: "1024px",
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

  const controlsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  };

  const searchWrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "280px",
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
    height: "40px",
    paddingLeft: "36px",
    paddingRight: "12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
  };

  const filtersContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const filterSelectStyle: React.CSSProperties = {
    height: "40px",
    padding: "0 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    outline: "none",
  };

  const buttonStyle: React.CSSProperties = {
    height: "40px",
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

  const tasksListStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const taskItemStyle: React.CSSProperties = {
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    transition: "background-color 0.2s",
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

  const taskContentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const taskTitleStyle: React.CSSProperties = {
    fontSize: "15px",
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
    marginTop: "4px",
  };

  const taskDescCompletedStyle: React.CSSProperties = {
    ...taskDescStyle,
    textDecoration: "line-through",
    color: "#94a3b8",
  };

  const taskMetaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
    flexWrap: "wrap",
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

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "4px",
  };

  const actionButtonStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
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
    maxWidth: "480px",
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
  };

  const textareaStyle: React.CSSProperties = {
    ...modalInputStyle,
    minHeight: "100px",
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
    width: "48px",
    height: "48px",
    borderRadius: "9999px",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "8px",
  };

  const emptyDescStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "20px",
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
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
                  style={item.label === "Tasks" ? navButtonActiveStyle : navButtonStyle}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div style={rightSectionStyle}>
            <button style={primaryButtonStyle} onClick={() => setShowForm(true)}>
              <Plus size={16} />
              New Task
            </button>
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
            <h2 style={titleStyle}>Tasks</h2>
            <p style={subtitleStyle}>
              Manage all your tasks in one place • {stats.total} total • {stats.completed} completed • {stats.pending} pending
            </p>
          </div>

          {/* Controls */}
          <div style={controlsStyle}>
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

            {/* Filters */}
            <div style={filtersContainerStyle}>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                style={filterSelectStyle}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                style={filterSelectStyle}
              >
                <option value="created">Date Created</option>
                <option value="title">Title</option>
              </select>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as OrderType)}
                style={filterSelectStyle}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div style={tasksListStyle}>
            {loading ? (
              <div style={loadingStyle}>Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={emptyIconStyle}>
                  <CheckSquare size={24} style={{ color: "#94a3b8" }} />
                </div>
                <p style={emptyTitleStyle}>No tasks found</p>
                <p style={emptyDescStyle}>
                  {searchQuery ? "Try a different search term" : "Create your first task to get started"}
                </p>
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
                >
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    style={task.completed ? checkboxCheckedStyle : checkboxStyle}
                  >
                    {task.completed && <Check size={14} color="white" />}
                  </button>

                  <div style={taskContentStyle}>
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
                        {new Date(task.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                  <div style={actionsStyle}>
                    <button
                      style={actionButtonStyle}
                      onClick={() => {
                        setEditingId(task.id);
                        setFormData({
                          title: task.title,
                          description: task.description || "",
                        });
                        setShowForm(true);
                      }}
                      title="Edit"
                    >
                      <Edit3 size={14} style={{ color: "#64748b" }} />
                    </button>
                    <button
                      style={actionButtonStyle}
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete"
                      disabled={deletingIds.has(task.id)}
                    >
                      <Trash2 size={14} style={{ color: deletingIds.has(task.id) ? "#94a3b8" : "#dc2626" }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Task Modal */}
      {showForm ? (
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
                {editingId ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
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
        select:hover {
          border-color: #0a1628 !important;
        }
      `}</style>
    </div>
  );
}
