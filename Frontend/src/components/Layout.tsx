import { MentalHealthSidebar } from "@/components/MentalHealthSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background">
      <MentalHealthSidebar />
      {children}
    </div>
  );
}