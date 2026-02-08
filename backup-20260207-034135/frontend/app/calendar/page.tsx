"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Clock, Check, LogOut, CheckSquare, Search } from "lucide-react";
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

  async function handleCreateTask() {
    if (!formData.title.trim()) return;
    try {
      await api.post<Task>("/api/tasks", {
        title: formData.title,
        description: formData.description || null,
      });
      await fetchTasks();
      setShowForm(false);
      setFormData({ title: "", description: "", dueDate: "" });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/login";
  }

  async function handleToggleComplete(id: number) {
    try {
      await api.patch<Task>(`/api/tasks/${id}/complete`);
      await fetchTasks();
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  }

  async function handleDeleteTask(id: number) {
    if (window.confirm("Delete this task?")) {
      try {
        await api.delete(`/api/tasks/${id}`);
        await fetchTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const offset = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    return { daysInMonth, offset };
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.created_at);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const { daysInMonth, offset } = getDaysInMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const completedCount = selectedDateTasks.filter(t => t.completed).length;

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

  const calendarContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "24px",
  };

  const calendarCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const calendarHeaderStyle: React.CSSProperties = {
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const monthNavStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const monthTitleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
    minWidth: "160px",
    textAlign: "center",
  };

  const navButtonSmallStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  };

  const todayButtonStyle: React.CSSProperties = {
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: "500",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const calendarGridStyle: React.CSSProperties = {
    padding: "20px",
  };

  const weekDaysStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    marginBottom: "8px",
  };

  const weekDayLabelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
    padding: "8px 0",
  };

  const daysGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
  };

  const dayCellStyle: React.CSSProperties = {
    aspectRatio: "1",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "8px",
    transition: "all 0.2s",
    position: "relative",
  };

  const dayCellOtherMonthStyle: React.CSSProperties = {
    ...dayCellStyle,
    backgroundColor: "#f8fafc",
    color: "#94a3b8",
  };

  const dayCellTodayStyle: React.CSSProperties = {
    ...dayCellStyle,
    borderColor: "#0a1628",
    borderWidth: "2px",
  };

  const dayCellSelectedStyle: React.CSSProperties = {
    ...dayCellStyle,
    backgroundColor: "#0a1628",
    color: "#ffffff",
  };

  const dayNumberStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
  };

  const taskIndicatorStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "2px",
    marginTop: "4px",
  };

  const taskDotStyle: React.CSSProperties = {
    width: "6px",
    height: "6px",
    borderRadius: "9999px",
    backgroundColor: "#0a1628",
  };

  const taskDotCompletedStyle: React.CSSProperties = {
    ...taskDotStyle,
    backgroundColor: "#10b981",
  };

  const sidePanelStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  };

  const sidePanelHeaderStyle: React.CSSProperties = {
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
  };

  const sidePanelTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
  };

  const sidePanelSubtitleStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  };

  const sidePanelContentStyle: React.CSSProperties = {
    padding: "16px",
  };

  const taskItemStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    marginBottom: "8px",
    transition: "all 0.2s",
  };

  const taskItemCompletedStyle: React.CSSProperties = {
    ...taskItemStyle,
    opacity: 0.6,
  };

  const taskTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#0f172a",
  };

  const taskTitleCompletedStyle: React.CSSProperties = {
    ...taskTitleStyle,
    textDecoration: "line-through",
    color: "#94a3b8",
  };

  const taskDescStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "4px",
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "40px 16px",
    fontSize: "14px",
    color: "#94a3b8",
  };

  const addButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#0a1628",
    color: "#ffffff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginBottom: "16px",
    transition: "all 0.2s",
  };

  const checkboxStyle: React.CSSProperties = {
    width: "18px",
    height: "18px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    backgroundColor: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const checkboxCheckedStyle: React.CSSProperties = {
    ...checkboxStyle,
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  };

  const taskHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  };

  const deleteButtonStyle: React.CSSProperties = {
    padding: "4px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
                  style={item.label === "Calendar" ? navButtonActiveStyle : navButtonStyle}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div style={rightSectionStyle}>
            <button style={addButtonStyle} onClick={() => setShowForm(true)}>
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
            <h2 style={titleStyle}>Calendar</h2>
            <p style={subtitleStyle}>View and manage your tasks by date</p>
          </div>

          {/* Calendar Container */}
          <div style={calendarContainerStyle}>
            {/* Calendar */}
            <div style={calendarCardStyle}>
              {/* Calendar Header */}
              <div style={calendarHeaderStyle}>
                <div style={monthNavStyle}>
                  <button style={navButtonSmallStyle} onClick={goToPreviousMonth}>
                    <ChevronLeft size={16} />
                  </button>
                  <div style={monthTitleStyle}>
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </div>
                  <button style={navButtonSmallStyle} onClick={goToNextMonth}>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <button style={todayButtonStyle} onClick={goToToday}>
                  Today
                </button>
              </div>

              {/* Calendar Grid */}
              <div style={calendarGridStyle}>
                {/* Week Day Labels */}
                <div style={weekDaysStyle}>
                  {dayNames.map((day) => (
                    <div key={day} style={weekDayLabelStyle}>{day}</div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div style={daysGridStyle}>
                  {/* Empty cells for offset */}
                  {Array.from({ length: offset }).map((_, i) => (
                    <div key={`empty-${i}`} style={dayCellOtherMonthStyle} />
                  ))}

                  {/* Days of month */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
                    const isToday = isCurrentMonth && date.getDate() === today.getDate();
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    const dayTasks = getTasksForDate(date);
                    const completedCount = dayTasks.filter(t => t.completed).length;

                    let cellStyle = dayCellStyle;
                    if (isSelected) cellStyle = dayCellSelectedStyle;
                    else if (isToday) cellStyle = dayCellTodayStyle;

                    return (
                      <div
                        key={i}
                        style={cellStyle}
                        onClick={() => selectDate(date)}
                      >
                        <span style={{
                          ...dayNumberStyle,
                          color: isSelected ? "#ffffff" : isToday ? "#0a1628" : "#334155"
                        }}>
                          {i + 1}
                        </span>
                        {dayTasks.length > 0 && (
                          <div style={taskIndicatorStyle}>
                            {Array.from({ length: Math.min(dayTasks.length, 5) }).map((_, j) => (
                              <div
                                key={j}
                                style={j < completedCount ? taskDotCompletedStyle : taskDotStyle}
                              />
                            ))}
                            {dayTasks.length > 5 && (
                              <span style={{ fontSize: "10px", color: isSelected ? "#ffffff" : "#64748b" }}>
                                +{dayTasks.length - 5}
                              </span>
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
              {selectedDate ? (
                <>
                  <div style={sidePanelHeaderStyle}>
                    <h3 style={sidePanelTitleStyle}>
                      {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </h3>
                    <p style={sidePanelSubtitleStyle}>
                      {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? "s" : ""} • {completedCount} completed
                    </p>
                  </div>
                  <div style={sidePanelContentStyle}>
                    {selectedDateTasks.length === 0 ? (
                      <div style={emptyStateStyle}>No tasks for this day</div>
                    ) : (
                      selectedDateTasks.map((task) => (
                        <div
                          key={task.id}
                          style={task.completed ? taskItemCompletedStyle : taskItemStyle}
                        >
                          <div style={taskHeaderStyle}>
                            <button
                              style={task.completed ? checkboxCheckedStyle : checkboxStyle}
                              onClick={() => handleToggleComplete(task.id)}
                            >
                              {task.completed && <Check size={12} color="white" />}
                            </button>
                            <div style={{ flex: 1 }}>
                              <p style={task.completed ? taskTitleCompletedStyle : taskTitleStyle}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p style={taskDescStyle}>{task.description}</p>
                              )}
                            </div>
                            <button
                              style={deleteButtonStyle}
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Plus size={14} style={{ transform: "rotate(45deg)" }} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div style={sidePanelHeaderStyle}>
                    <h3 style={sidePanelTitleStyle}>Select a Date</h3>
                    <p style={sidePanelSubtitleStyle}>Click on any date to view tasks</p>
                  </div>
                  <div style={sidePanelContentStyle}>
                    <div style={emptyStateStyle}>
                      Select a date from the calendar to view or manage tasks for that day
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .day-cell:hover {
          background-color: #f8fafc !important;
        }
        .nav-button-small:hover {
          background-color: #f8fafc !important;
        }
        .today-button:hover {
          background-color: #f8fafc !important;
        }
        .task-item:hover {
          background-color: #f8fafc !important;
        }
        @media (max-width: 1024px) {
          .calendar-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
