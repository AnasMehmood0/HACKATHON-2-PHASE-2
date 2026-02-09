"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Flame,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  LogOut,
  Filter,
  Download,
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

interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  tasksThisWeek: number;
  tasksThisMonth: number;
  averageTasksPerDay: number;
  mostProductiveDay: string;
  peakHours: { hour: number; count: number }[];
  completionByDay: { day: string; completed: number; created: number }[];
  weeklyTrend: { week: string; completed: number; created: number }[];
}

type DateRangeType = "7d" | "30d" | "90d" | "all";

export default function ReportsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangeType>("30d");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      calculateAnalytics();
    }
  }, [tasks, dateRange]);

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

  function calculateAnalytics() {
    const now = new Date();
    let startDate = new Date(0);

    switch (dateRange) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
    }

    const filteredTasks = tasks.filter((t) => new Date(t.created_at) >= startDate);

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate streaks
    const completionDates = filteredTasks
      .filter((t) => t.completed && t.updated_at)
      .map((t) => new Date(t.updated_at).toDateString())
      .filter((d, i, arr) => arr.indexOf(d) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (completionDates.length > 0) {
      const checkDate = new Date();
      if (completionDates[0] === today || completionDates[0] === yesterday) {
        currentStreak = 1;
        for (let i = 1; i < completionDates.length; i++) {
          const prev = new Date(completionDates[i - 1]);
          const curr = new Date(completionDates[i]);
          const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (24 * 60 * 60 * 1000));
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    let longestStreak = 0;
    let tempStreak = 1;
    for (let i = 1; i < completionDates.length; i++) {
      const prev = new Date(completionDates[i - 1]);
      const curr = new Date(completionDates[i]);
      const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Tasks this week and month
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const tasksThisWeek = filteredTasks.filter((t) => new Date(t.created_at) >= weekAgo).length;
    const tasksThisMonth = filteredTasks.filter((t) => new Date(t.created_at) >= monthAgo).length;

    // Average tasks per day
    const daysInRange = Math.max(1, Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
    const averageTasksPerDay = totalTasks / daysInRange;

    // Most productive day
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const tasksByDay = dayNames.map((day) => ({
      day,
      count: filteredTasks.filter((t) => dayNames[new Date(t.created_at).getDay()] === day && t.completed).length,
    }));
    const mostProductiveDay = tasksByDay.sort((a, b) => b.count - a.count)[0].day;

    // Peak hours
    const hourCounts = new Array(24).fill(0);
    filteredTasks.forEach((t) => {
      const hour = new Date(t.created_at).getHours();
      hourCounts[hour]++;
    });
    const peakHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter((h) => h.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Completion by day of week
    const completionByDay = dayNames.map((day) => ({
      day: day.substring(0, 3),
      completed: filteredTasks.filter((t) => dayNames[new Date(t.created_at).getDay()] === day && t.completed).length,
      created: filteredTasks.filter((t) => dayNames[new Date(t.created_at).getDay()] === day).length,
    }));

    // Weekly trend
    const weeks = Math.ceil(daysInRange / 7);
    const weeklyTrend = Array.from({ length: weeks }, (_, i) => {
      const weekStart = new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weekTasks = filteredTasks.filter(
        (t) => new Date(t.created_at) >= weekStart && new Date(t.created_at) < weekEnd
      );
      return {
        week: `W${i + 1}`,
        created: weekTasks.length,
        completed: weekTasks.filter((t) => t.completed).length,
      };
    });

    setAnalytics({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      currentStreak,
      longestStreak,
      tasksThisWeek,
      tasksThisMonth,
      averageTasksPerDay,
      mostProductiveDay,
      peakHours,
      completionByDay,
      weeklyTrend,
    });
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.href = "/login";
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

  const pageTitleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0a1628",
    margin: "0",
  };

  const pageSubtitleStyle: React.CSSProperties = {
    fontSize: "15px",
    color: "#64748b",
    marginTop: "4px",
  };

  const filterBarStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
  };

  const filterButtonStyle: React.CSSProperties = (isActive: boolean) => ({
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: isActive ? "#0a1628" : "#64748b",
    backgroundColor: isActive ? "#f59e0b" : "transparent",
    border: isActive ? "none" : "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const statsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #f1f5f9",
    transition: "all 0.2s",
  };

  const statHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  };

  const statIconStyle: React.CSSProperties = (bg: string) => ({
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  const statLabelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0a1628",
    margin: "4px 0",
  };

  const statChangeStyle: React.CSSProperties = (positive: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    fontWeight: "500",
    color: positive ? "#10b981" : "#ef4444",
  });

  const chartsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  };

  const chartCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #f1f5f9",
  };

  const chartHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
  };

  const chartTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0a1628",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const productivityGaugeStyle: React.CSSProperties = {
    position: "relative",
    width: "200px",
    height: "100px",
    margin: "20px auto",
  };

  const gaugeArcStyle: React.CSSProperties = (percentage: number) => ({
    position: "absolute",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: `conic-gradient(
      ${percentage >= 75 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444"} ${percentage * 3.6}deg,
      #f1f5f9 ${percentage * 3.6}deg 360deg
    )`,
    clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
  });

  const gaugeInnerStyle: React.CSSProperties = {
    position: "absolute",
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    top: "20px",
    left: "20px",
    clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
  };

  const gaugeValueStyle: React.CSSProperties = {
    position: "absolute",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "36px",
    fontWeight: "700",
    color: "#0a1628",
  };

  const gaugeLabelStyle: React.CSSProperties = {
    position: "absolute",
    top: "100px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "12px",
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
  };

  const streakCardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    borderRadius: "16px",
    padding: "24px",
    color: "#ffffff",
  };

  const streakValueStyle: React.CSSProperties = {
    fontSize: "48px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "8px 0",
  };

  const barChartStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "180px",
    gap: "8px",
    paddingTop: "20px",
  };

  const barColumnStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  };

  const barStyle: React.CSSProperties = (height: number, color: string) => ({
    width: "100%",
    height: `${height}%`,
    backgroundColor: color,
    borderRadius: "6px 6px 0 0",
    transition: "all 0.3s",
    position: "relative",
  });

  const barLabelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: "500",
    color: "#64748b",
  };

  const insightsGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  };

  const insightCardStyle: React.CSSProperties = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #f1f5f9",
  };

  const insightTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0a1628",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const insightContentStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.6",
  };

  const peakHourItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f1f5f9",
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    fontSize: "16px",
    color: "#64748b",
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <CheckSquare size={18} /> },
    { label: "Calendar", href: "/calendar", icon: <Calendar size={18} /> },
    { label: "Tasks", href: "/tasks", icon: <CheckSquare size={18} /> },
    { label: "Reports", href: "/reports", icon: <BarChart3 size={18} /> },
    { label: "Settings", href: "/settings", icon: <Activity size={18} /> },
  ];

  if (loading) {
    return <div style={loadingStyle}>Loading analytics...</div>;
  }

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
              <button style={item.label === "Reports" ? navButtonActiveStyle : navButtonStyle}>
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
        {/* Page Header */}
        <div style={pageHeaderStyle}>
          <div>
            <h1 style={pageTitleStyle}>Analytics & Reports</h1>
            <p style={pageSubtitleStyle}>Track your productivity and gain insights</p>
          </div>
          <div style={filterBarStyle}>
            {(["7d", "30d", "90d", "all"] as DateRangeType[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                style={filterButtonStyle(dateRange === range)}
              >
                {range === "all" ? "All Time" : range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
            <button style={{ ...filterButtonStyle(false), display: "flex", alignItems: "center", gap: "6px" }}>
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {analytics && (
          <>
            {/* Top Stats Grid */}
            <div style={statsGridStyle}>
              {/* Total Tasks */}
              <div style={statCardStyle}>
                <div style={statHeaderStyle}>
                  <div style={{ ...statIconStyle("#dbeafe"), color: "#3b82f6" }}>
                    <CheckSquare size={20} />
                  </div>
                </div>
                <div style={statLabelStyle}>Total Tasks</div>
                <div style={statValueStyle}>{analytics.totalTasks}</div>
                <div style={statChangeStyle(true)}>
                  <ArrowUp size={14} />
                  {analytics.tasksThisWeek} this week
                </div>
              </div>

              {/* Completion Rate */}
              <div style={statCardStyle}>
                <div style={statHeaderStyle}>
                  <div style={{ ...statIconStyle("#dcfce7"), color: "#10b981" }}>
                    <Target size={20} />
                  </div>
                </div>
                <div style={statLabelStyle}>Completion Rate</div>
                <div style={statValueStyle}>{analytics.completionRate.toFixed(0)}%</div>
                <div style={statChangeStyle(analytics.completionRate >= 50)}>
                  {analytics.completionRate >= 50 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {analytics.completedTasks} completed
                </div>
              </div>

              {/* Current Streak */}
              <div style={streakCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", opacity: 0.9 }}>
                  <Flame size={18} />
                  Current Streak
                </div>
                <div style={streakValueStyle}>{analytics.currentStreak}</div>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>
                  {analytics.currentStreak > 0 ? "days in a row" : "Start completing tasks!"}
                </div>
                <div style={{ marginTop: "12px", fontSize: "12px", opacity: 0.7 }}>
                  Best: {analytics.longestStreak} days
                </div>
              </div>

              {/* Avg Tasks/Day */}
              <div style={statCardStyle}>
                <div style={statHeaderStyle}>
                  <div style={{ ...statIconStyle("#fef3c7"), color: "#f59e0b" }}>
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div style={statLabelStyle}>Avg Tasks/Day</div>
                <div style={statValueStyle}>{analytics.averageTasksPerDay.toFixed(1)}</div>
                <div style={statChangeStyle(true)}>
                  <Calendar size={14} />
                  {analytics.tasksThisMonth} this month
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div style={chartsGridStyle}>
              {/* Productivity Score */}
              <div style={chartCardStyle}>
                <div style={chartHeaderStyle}>
                  <div style={chartTitleStyle}>
                    <Zap size={18} color="#f59e0b" />
                    Productivity Score
                  </div>
                </div>
                <div style={productivityGaugeStyle}>
                  <div style={gaugeArcStyle(analytics.completionRate)} />
                  <div style={gaugeInnerStyle} />
                  <div style={gaugeValueStyle}>{analytics.completionRate.toFixed(0)}</div>
                  <div style={gaugeLabelStyle}>Score</div>
                </div>
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    {analytics.completionRate >= 75
                      ? "Excellent! You're on fire! 🔥"
                      : analytics.completionRate >= 50
                      ? "Good progress! Keep it up!"
                      : "Room for improvement. Stay focused!"}
                  </div>
                </div>
              </div>

              {/* Weekly Trend */}
              <div style={chartCardStyle}>
                <div style={chartHeaderStyle}>
                  <div style={chartTitleStyle}>
                    <Activity size={18} color="#3b82f6" />
                    Weekly Trend
                  </div>
                </div>
                <div style={barChartStyle}>
                  {analytics.weeklyTrend.slice(-6).map((week) => {
                    const maxCount = Math.max(...analytics.weeklyTrend.map((w) => w.created), 1);
                    const createdHeight = (week.created / maxCount) * 100;
                    const completedHeight = (week.completed / maxCount) * 100;
                    return (
                      <div key={week.week} style={barColumnStyle}>
                        <div style={{ position: "relative", width: "100%", display: "flex", gap: "2px" }}>
                          <div
                            style={barStyle(completedHeight, "#10b981")}
                            title={`Completed: ${week.completed}`}
                          />
                          <div style={barStyle(createdHeight, "#3b82f6")} title={`Created: ${week.created}`} />
                        </div>
                        <div style={barLabelStyle}>{week.week}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#10b981", borderRadius: "2px" }} />
                    Completed
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#3b82f6", borderRadius: "2px" }} />
                    Created
                  </div>
                </div>
              </div>

              {/* Completion by Day */}
              <div style={chartCardStyle}>
                <div style={chartHeaderStyle}>
                  <div style={chartTitleStyle}>
                    <PieChart size={18} color="#8b5cf6" />
                    By Day of Week
                  </div>
                </div>
                <div style={barChartStyle}>
                  {analytics.completionByDay.map((day) => {
                    const maxCount = Math.max(...analytics.completionByDay.map((d) => d.created), 1);
                    const completedHeight = (day.completed / maxCount) * 100;
                    const createdHeight = ((day.created - day.completed) / maxCount) * 100;
                    return (
                      <div key={day.day} style={barColumnStyle}>
                        <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", gap: "0" }}>
                          <div style={barStyle(completedHeight, "#10b981")} title={`Completed: ${day.completed}`} />
                          <div style={barStyle(createdHeight, "#e2e8f0")} title={`Pending: ${day.created - day.completed}`} />
                        </div>
                        <div style={barLabelStyle}>{day.day}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#10b981", borderRadius: "2px" }} />
                    Completed
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#64748b" }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#e2e8f0", borderRadius: "2px" }} />
                    Pending
                  </div>
                </div>
              </div>

              {/* Peak Hours */}
              <div style={chartCardStyle}>
                <div style={chartHeaderStyle}>
                  <div style={chartTitleStyle}>
                    <Clock size={18} color="#f59e0b" />
                    Peak Productivity Hours
                  </div>
                </div>
                <div>
                  {analytics.peakHours.length > 0 ? (
                    analytics.peakHours.map((item, index) => (
                      <div key={item.hour} style={peakHourItemStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              backgroundColor: index === 0 ? "#f59e0b" : "#f1f5f9",
                              color: index === 0 ? "#ffffff" : "#64748b",
                              fontSize: "11px",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {index + 1}
                          </div>
                          <span style={{ fontSize: "14px", color: "#0a1628" }}>
                            {item.hour === 0
                              ? "12 AM"
                              : item.hour < 12
                              ? `${item.hour} AM`
                              : item.hour === 12
                              ? "12 PM"
                              : `${item.hour - 12} PM`}
                          </span>
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0a1628" }}>
                          {item.count} tasks
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      Not enough data yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Insights Grid */}
            <div style={insightsGridStyle}>
              {/* Most Productive Day */}
              <div style={insightCardStyle}>
                <div style={insightTitleStyle}>
                  <Award size={16} color="#f59e0b" />
                  Most Productive Day
                </div>
                <div style={insightContentStyle}>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#0a1628", marginBottom: "8px" }}>
                    {analytics.mostProductiveDay}
                  </div>
                  <div>You complete the most tasks on this day. Consider scheduling your most important work accordingly.</div>
                </div>
              </div>

              {/* Streak Insight */}
              <div style={insightCardStyle}>
                <div style={insightTitleStyle}>
                  <Flame size={16} color="#f97316" />
                  Streak Analysis
                </div>
                <div style={insightContentStyle}>
                  <div style={{ display: "flex", gap: "24px", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#0a1628" }}>
                        {analytics.currentStreak}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Current</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#0a1628" }}>
                        {analytics.longestStreak}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>Best</div>
                    </div>
                  </div>
                  <div>
                    {analytics.currentStreak === analytics.longestStreak && analytics.currentStreak > 0
                      ? "🔥 You're at your personal best! Keep it going!"
                      : analytics.currentStreak > 0
                      ? `${analytics.longestStreak - analytics.currentStreak} days to beat your record!`
                      : "Complete tasks today to start your streak!"}
                  </div>
                </div>
              </div>

              {/* Productivity Tip */}
              <div style={insightCardStyle}>
                <div style={insightTitleStyle}>
                  <Zap size={16} color="#8b5cf6" />
                  Productivity Tip
                </div>
                <div style={insightContentStyle}>
                  {analytics.completionRate >= 75
                    ? "You're highly productive! Consider mentoring others or taking on more challenging projects to continue growing."
                    : analytics.completionRate >= 50
                    ? "You're making good progress. Try breaking larger tasks into smaller, more manageable chunks to boost completion rates."
                    : "Focus on completing one task at a time. The sense of accomplishment will help build momentum."}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
