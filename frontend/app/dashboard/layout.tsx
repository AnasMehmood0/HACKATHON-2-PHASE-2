// Dashboard layout - minimal wrapper to let page handle styling

import { ChatPanel } from "@/components/ChatPanel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Main content - page handles all styling */}
      {children}

      {/* AI Chat Panel - Phase III */}
      <ChatPanel />
    </>
  );
}
