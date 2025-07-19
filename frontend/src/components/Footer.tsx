import { ThemeToggle } from '@/components/ThemeToggle';
import { Wheat } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-full">
              <Wheat className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">🌾 AgroPredictor</p>
              <p className="text-xs text-muted-foreground">Smart Farming Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} AgroPredictor. All rights reserved.
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}