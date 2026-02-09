"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Check,
  X,
  Edit3,
  Trash2,
  LogOut,
  Search,
  Filter,
  Calendar,
  BarChart3,
  ChevronDown,
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
  const [showSortMenu, setShowSortMenu] = useState(false);
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

  function toggleSort() {
    setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

  const pageHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  };

  const pageHeaderLeftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const pageTitleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0a1628",
    margin: "0",
  };

  const pageSubtitleStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#64748b",
    marginTop: "4px",
  };

  const searchBoxStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "0 16px",
    height: "48px",
    width: "320px",
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#0a1628",
    backgroundColor: "transparent",
  };

  const addButtonStyle: React.CSSProperties = {
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#0a1628",
    backgroundColor: "#f59e0b",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const statsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
    marginBottom: "8px",
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0a1628",
  };

  const contentCardStyle: React.CSSProperties = {
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

  const filterBarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    flexWrap: "wrap",
  };

  const filterSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const filterLabelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
    marginRight: "4px",
  };

  const filterButtonStyle = (isActive: boolean): React.CSSProperties => ({
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

  const sortButtonStyle: React.CSSProperties = {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
    backgroundColor: "transparent",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const taskListStyle: React.CSSProperties = {
    maxHeight: "600px",
    overflowY: "auto",
  };

  const taskItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.2s",
  };

  const taskCheckboxStyle = (checked: boolean): React.CSSProperties => ({
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

  const taskTitleStyle = (completed: boolean): React.CSSProperties => ({
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

  const taskMetaStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
  };

  const taskActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
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

  const emptyStateStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
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
    marginBottom: "20px",
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

  const buttonStyle = (variant: "primary" | "secondary"): React.CSSProperties => ({
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
              <button style={item.label === "Tasks" ? navButtonActiveStyle : navButtonStyle}>
                {item.icon}
                {item.label}
              </button>
            </Link>
          ))}
        </nav>

        <div>
          <button onClick={handleSignOut} style={signOutButtonStyle}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={mainContentStyle}>
        {/* Page Header */}
        <div style={pageHeaderStyle}>
          <div style={pageHeaderLeftStyle}>
            <div>
              <h1 style={pageTitleStyle}>Tasks</h1>
              <p style={pageSubtitleStyle}>Manage and track all your tasks</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <div style={searchBoxStyle}>
              <Search size={18} style={{ color: "#94a3b8", marginRight: "12px" }} />
              <input
                style={searchInputStyle}
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button onClick={() => setShowForm(true)} style={addButtonStyle}>
              <Plus size={18} />
              Add Task
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statLabelStyle}>Total Tasks</div>
            <div style={statValueStyle}>{totalTasks}</div>
          </div>

          <div style={statCardStyle}>
            <div style={statLabelStyle}>Completed</div>
            <div style={{ ...statValueStyle, color: "#10b981" }}>{completedTasks}</div>
          </div>

          <div style={statCardStyle}>
            <div style={statLabelStyle}>Pending</div>
            <div style={{ ...statValueStyle, color: "#f59e0b" }}>{pendingTasks}</div>
          </div>

          <div style={statCardStyle}>
            <div style={statLabelStyle}>Progress</div>
            <div style={statValueStyle}>{completionRate}%</div>
          </div>
        </div>

        {/* Task List Card */}
        <div style={contentCardStyle}>
          <div style={cardHeaderStyle}>
            <div style={cardTitleStyle}>
              <CheckSquare size={20} />
              All Tasks
            </div>
          </div>

          <div style={filterBarStyle}>
            <div style={filterSectionStyle}>
              <span style={filterLabelStyle}>Filter:</span>
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

            <div style={{ width: "1px", height: "24px", backgroundColor: "#e2e8f0" }} />

            <div style={filterSectionStyle}>
              <span style={filterLabelStyle}>Sort by:</span>
              <button
                onClick={() => setSortBy("created")}
                style={filterButtonStyle(sortBy === "created")}
              >
                Date Created
              </button>
              <button
                onClick={() => setSortBy("title")}
                style={filterButtonStyle(sortBy === "title")}
              >
                Title
              </button>
              <button
                onClick={toggleSort}
                style={sortButtonStyle}
              >
                {order === "asc" ? "Oldest" : "Newest"} First
                <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div style={taskListStyle}>
            {loading ? (
              <div style={emptyStateStyle}>
                <div style={{ color: "#64748b" }}>Loading tasks...</div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={emptyIconStyle}>
                  <CheckSquare size={32} style={{ color: "#94a3b8" }} />
                </div>
                <div
                  style={{ fontSize: "18px", fontWeight: "600", color: "#0a1628", marginBottom: "8px" }}
                >
                  No tasks found
                </div>
                <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px" }}>
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : filter === "completed"
                    ? "No completed tasks yet"
                    : filter === "pending"
                    ? "No pending tasks!"
                    : "Create your first task to get started"}
                </div>
                {!searchQuery && filter === "all" && (
                  <button
                    onClick={() => setShowForm(true)}
                    style={addButtonStyle}
                  >
                    <Plus size={16} />
                    Create Task
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => (
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
                    <div style={taskMetaStyle}>
                      Created {new Date(task.created_at).toLocaleDateString()}
                    </div>
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
      </main>

      {/* Create Modal */}
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
              <button onClick={() => setShowForm(false)} style={buttonStyle("secondary")}>
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
