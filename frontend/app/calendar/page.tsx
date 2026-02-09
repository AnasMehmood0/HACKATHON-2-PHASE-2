"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Check,
  Clock,
  LogOut,
  Search,
  BarChart3,
  MoreHorizontal,
  Edit3,
  Trash2,
  X,
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

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    try {
      const response = await api.get<Task[]>("/api/tasks");
      setTasks(response);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
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

  async function handleCreateTask() {
    if (!formData.title.trim()) return;
    try {
      await api.post<Task>("/api/tasks", {
        title: formData.title,
        description: formData.description,
      });
      await fetchTasks();
      setShowForm(false);
      setFormData({ title: "", description: "", dueDate: "" });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  async function handleUpdateTask(id: number, data: typeof formData) {
    try {
      await api.put<Task>(`/api/tasks/${id}`, {
        title: data.title,
        description: data.description,
      });
      await fetchTasks();
      setEditingId(null);
      setFormData({ title: "", description: "", dueDate: "" });
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
    setFormData({ title: task.title, description: task.description || "", dueDate: "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({ title: "", description: "", dueDate: "" });
  }

  function getMonthData(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Date[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, -startDay + i + 1));
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }

  function getTasksForDate(date: Date) {
    return tasks.filter((t) => {
      const taskDate = new Date(t.created_at);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  }

  function navigateMonth(direction: "prev" | "next") {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const monthData = getMonthData(currentDate);
  const today = new Date();
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];

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
    maxWidth: "1600px",
    margin: "0 auto",
  };

  const pageHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
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

  const calendarNavStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

  const calendarNavButtonStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  };

  const todayButtonStyle: React.CSSProperties = {
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#0a1628",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const monthTitleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0a1628",
    minWidth: "200px",
    textAlign: "center",
  };

  const contentGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "24px",
  };

  const calendarCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  };

  const calendarHeaderStyle: React.CSSProperties = {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const calendarTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0a1628",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const calendarBodyStyle: React.CSSProperties = {
    padding: "24px",
  };

  const weekdaysStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "8px",
  };

  const weekdayStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    padding: "12px 0",
  };

  const daysGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
  };

  const dayCellStyle = (
    isCurrentMonth: boolean,
    isToday: boolean,
    isSelected: boolean
  ): React.CSSProperties => ({
    aspectRatio: "1",
    borderRadius: "12px",
    border: isToday ? "2px solid #f59e0b" : isSelected ? "2px solid #0a1628" : "1px solid #e2e8f0",
    backgroundColor: isSelected ? "#f59e0b" : isToday ? "#fffbeb" : "transparent",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "8px 10px",
    transition: "all 0.2s",
    position: "relative",
    opacity: isCurrentMonth ? 1 : 0.4,
  });

  const dayNumberStyle = (isSelected: boolean): React.CSSProperties => ({
    fontSize: "14px",
    fontWeight: "600",
    color: isSelected ? "#0a1628" : "#0a1628",
    marginBottom: "4px",
  });

  const taskDotsStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "3px",
  };

  const taskDotStyle = (completed: boolean): React.CSSProperties => ({
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: completed ? "#10b981" : "#0a1628",
  });

  const sidePanelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const sideCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  };

  const sideCardHeaderStyle: React.CSSProperties = {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const sideCardTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0a1628",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const sideCardBodyStyle: React.CSSProperties = {
    padding: "0",
    maxHeight: "500px",
    overflowY: "auto",
  };

  const taskItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.2s",
  };

  const taskCheckboxStyle = (checked: boolean): React.CSSProperties => ({
    width: "20px",
    height: "20px",
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
    fontSize: "14px",
    fontWeight: "500",
    color: completed ? "#94a3b8" : "#0a1628",
    textDecoration: completed ? "line-through" : "none",
  });

  const taskActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  const taskActionButtonStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
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
    padding: "48px 24px",
    textAlign: "center",
  };

  const emptyIconStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
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
    { label: "Calendar", href: "/calendar", icon: <CalendarIcon size={18} /> },
    { label: "Tasks", href: "/tasks", icon: <CheckSquare size={18} /> },
    { label: "Reports", href: "/reports", icon: <BarChart3 size={18} /> },
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
              <button style={item.label === "Calendar" ? navButtonActiveStyle : navButtonStyle}>
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
          <div>
            <h1 style={pageTitleStyle}>Calendar</h1>
            <p style={pageSubtitleStyle}>View and manage your tasks by date</p>
          </div>

          <div style={calendarNavStyle}>
            <button
              onClick={() => navigateMonth("prev")}
              style={calendarNavButtonStyle}
              title="Previous month"
            >
              <ChevronLeft size={20} style={{ color: "#64748b" }} />
            </button>

            <div style={monthTitleStyle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>

            <button
              onClick={() => navigateMonth("next")}
              style={calendarNavButtonStyle}
              title="Next month"
            >
              <ChevronRight size={20} style={{ color: "#64748b" }} />
            </button>

            <button onClick={goToToday} style={todayButtonStyle}>
              Today
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div style={contentGridStyle}>
          {/* Calendar */}
          <div style={calendarCardStyle}>
            <div style={calendarHeaderStyle}>
              <div style={calendarTitleStyle}>
                <CalendarIcon size={20} />
                Monthly View
              </div>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: "10px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#0a1628",
                  backgroundColor: "#f59e0b",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>

            <div style={calendarBodyStyle}>
              <div style={weekdaysStyle}>
                {weekdays.map((day) => (
                  <div key={day} style={weekdayStyle}>
                    {day}
                  </div>
                ))}
              </div>

              <div style={daysGridStyle}>
                {monthData.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday =
                    date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
                  const isSelected =
                    selectedDate &&
                    date.getDate() === selectedDate.getDate() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getFullYear() === selectedDate.getFullYear();
                  const dayTasks = getTasksForDate(date);

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      style={dayCellStyle(isCurrentMonth, isToday, isSelected || false)}
                    >
                      <div style={dayNumberStyle(isSelected || false)}>
                        {date.getDate()}
                      </div>
                      {dayTasks.length > 0 && (
                        <div style={taskDotsStyle}>
                          {dayTasks.slice(0, 6).map((task) => (
                            <div
                              key={task.id}
                              style={taskDotStyle(task.completed)}
                              title={task.title}
                            />
                          ))}
                          {dayTasks.length > 6 && (
                            <div
                              style={{
                                fontSize: "10px",
                                fontWeight: "600",
                                color: "#64748b",
                              }}
                            >
                              +{dayTasks.length - 6}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div style={sidePanelStyle}>
            {/* Selected Date Tasks */}
            <div style={sideCardStyle}>
              <div style={sideCardHeaderStyle}>
                <div style={sideCardTitleStyle}>
                  <CalendarIcon size={18} />
                  {selectedDate
                    ? `${weekdays[selectedDate.getDay()]}, ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`
                    : "Select a Date"}
                </div>
              </div>

              <div style={sideCardBodyStyle}>
                {selectedTasks.length === 0 ? (
                  <div style={emptyStateStyle}>
                    <div style={emptyIconStyle}>
                      <CalendarIcon size={24} style={{ color: "#94a3b8" }} />
                    </div>
                    <div
                      style={{ fontSize: "14px", fontWeight: "500", color: "#0a1628", marginBottom: "4px" }}
                    >
                      {selectedDate ? "No tasks this day" : "Select a date to view tasks"}
                    </div>
                  </div>
                ) : (
                  selectedTasks.map((task) => (
                    <div key={task.id} style={taskItemStyle}>
                      <div
                        onClick={() => handleToggleComplete(task.id, task.completed)}
                        style={taskCheckboxStyle(task.completed)}
                      >
                        {task.completed && <Check size={12} style={{ color: "#ffffff" }} />}
                      </div>

                      <div style={taskContentStyle}>
                        <div style={taskTitleStyle(task.completed)}>{task.title}</div>
                      </div>

                      <div style={taskActionsStyle}>
                        <button
                          onClick={() => startEdit(task)}
                          style={taskActionButtonStyle}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          style={{ ...taskActionButtonStyle, color: "#ef4444" }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div style={sideCardStyle}>
              <div style={sideCardHeaderStyle}>
                <div style={sideCardTitleStyle}>
                  <Clock size={18} />
                  This Month
                </div>
              </div>

              <div style={{ padding: "20px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: "12px", fontWeight: "500", color: "#64748b", marginBottom: "4px" }}
                    >
                      Total Tasks
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#0a1628" }}>
                      {tasks.filter(
                        (t) => new Date(t.created_at).getMonth() === currentDate.getMonth()
                      ).length}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: "12px", fontWeight: "500", color: "#64748b", marginBottom: "4px" }}
                    >
                      Completed
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: "#10b981" }}>
                      {
                        tasks.filter(
                          (t) =>
                            new Date(t.created_at).getMonth() === currentDate.getMonth() &&
                            t.completed
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
