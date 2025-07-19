import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Footer } from '@/components/Footer';
import { Wheat } from 'lucide-react';

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-full">
                    <Wheat className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-primary">🌾 AgroPredictor</h1>
                    <p className="text-sm text-muted-foreground">Smart Farming Assistant - Crop, Fertilizer & Weather</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}