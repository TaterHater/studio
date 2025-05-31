"use client";

import { useState, useEffect } from 'react';
import type { Train } from '@/types/train';
import { initialTrainData, simulateTrainUpdates } from '@/lib/mock-train-data';
import TrainMap from '@/components/train-map';
import TrainList from '@/components/train-list';
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Client-side check for environment variable
    setGoogleMapsApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

    try {
      setTrains(initialTrainData);
      setLoading(false);
    } catch (e) {
      const err = e as Error;
      setError(`Failed to load initial train data: ${err.message}`);
      setLoading(false);
      console.error(e);
    }

    const intervalId = setInterval(() => {
      setTrains(prevTrains => simulateTrainUpdates(prevTrains));
    }, 10000); 

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen p-4 gap-4 bg-background">
        <header className="p-4 border-b flex items-center">
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary"><path d="M10 21V17"/><path d="M14 21V17"/><path d="M5 17H19V8.4C19 7.53108 18.8101 6.68071 18.4537 5.92101C18.0973 5.16131 17.5867 4.51592 16.9688 4.04439C16.3509 3.57286 15.6456 3.29291 14.902 3.23259C14.1583 3.17227 13.401 3.33443 12.7161 3.70289L5 8.4V17Z"/><path d="M5 8.4L7.68392 4.09711C8.36887 3.72865 9.12625 3.56649 9.86991 3.62681C10.6136 3.68713 11.3189 3.96708 11.9368 4.43861C12.5547 4.91015 13.0652 5.55554 13.4216 6.31524C13.778 7.07494 13.9679 7.9253 13.9679 8.79423V17"/></svg>
          <Skeleton className="h-8 w-48" />
        </header>
        <Skeleton className="flex-1 rounded-lg" />
        <Skeleton className="flex-1 rounded-lg" />
         <footer className="p-3 border-t text-center text-xs text-muted-foreground">
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </footer>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4 gap-4 bg-background text-destructive">
        <AlertCircle className="w-12 h-12" />
        <h2 className="text-2xl font-headline">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-headline text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary"><path d="M10 21V17"/><path d="M14 21V17"/><path d="M5 17H19V8.4C19 7.53108 18.8101 6.68071 18.4537 5.92101C18.0973 5.16131 17.5867 4.51592 16.9688 4.04439C16.3509 3.57286 15.6456 3.29291 14.902 3.23259C14.1583 3.17227 13.401 3.33443 12.7161 3.70289L5 8.4V17Z"/><path d="M5 8.4L7.68392 4.09711C8.36887 3.72865 9.12625 3.56649 9.86991 3.62681C10.6136 3.68713 11.3189 3.96708 11.9368 4.43861C12.5547 4.91015 13.0652 5.55554 13.4216 6.31524C13.778 7.07494 13.9679 7.9253 13.9679 8.79423V17"/></svg>
          Train Tracker
        </h1>
      </header>
      <div className="flex-grow flex flex-col overflow-hidden p-4 gap-4">
        <section aria-labelledby="map-view-heading" className="flex-1 min-h-0 flex flex-col">
          <h2 id="map-view-heading" className="sr-only">Map View</h2>
          <div className="flex-grow rounded-lg shadow-md overflow-hidden border border-border">
            <TrainMap trains={trains} apiKey={googleMapsApiKey} />
          </div>
        </section>
        <section aria-labelledby="list-view-heading" className="flex-1 min-h-0 flex flex-col">
          <h2 id="list-view-heading" className="sr-only">Train List View</h2>
          <div className="flex-grow overflow-hidden">
            <TrainList trains={trains} />
          </div>
        </section>
      </div>
      <footer className="p-3 border-t text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Train Tracker. All rights reserved. Map data &copy; Google.</p>
        {!googleMapsApiKey && <p className="text-destructive font-semibold mt-1">Warning: Google Maps API Key is not configured. Map functionality will be limited.</p>}
      </footer>
    </main>
  );
}
