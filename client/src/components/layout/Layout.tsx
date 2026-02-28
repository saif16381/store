import React from "react";
import { Navbar } from "./Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-foreground text-background py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <span className="font-display font-bold text-xl">ArtisanMarket</span>
            </div>
            <p className="text-background/60 text-sm text-balance">
              Your global marketplace for unique and creative goods.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Shop</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#" className="hover:text-primary transition-colors">Gift Cards</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sitemap</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Artisan Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">Sell</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#" className="hover:text-primary transition-colors">Sell on ArtisanMarket</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Teams</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Forums</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-primary-foreground">About</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#" className="hover:text-primary transition-colors">Policies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
