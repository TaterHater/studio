"use client";

import type { FC } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import type { Train } from '@/types/train';
import { TrainFront, AlertTriangle, Clock3, CheckCircle, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TrainMapProps {
  trains: Train[];
  apiKey: string | undefined;
}

const TrainMap: FC<TrainMapProps> = ({ trains, apiKey }) => {
  const [selectedTrainId, setSelectedTrainId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.7392, lng: -104.9903 }); // Default to Denver

  useEffect(() => {
    // Optional: Adjust map center if trains are loaded and map isn't interacted with
    // For simplicity, we keep initial center, user can pan/zoom.
    // Example: if (trains.length > 0 && !selectedTrainId) {
    //   setMapCenter({ lat: trains[0].lat, lng: trains[0].lng });
    // }
  }, [trains, selectedTrainId]);

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground p-4 text-center rounded-lg">
        Google Maps API Key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file.
      </div>
    );
  }

  const getStatusIcon = (status: Train['tripStatus']) => {
    switch (status) {
      case 'SCHEDULED': return <Clock3 className="h-4 w-4 mr-1" />;
      case 'IN_TRANSIT_TO': return <Play className="h-4 w-4 mr-1 fill-current" />;
      case 'STOPPED_AT': return <TrainFront className="h-4 w-4 mr-1" />;
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'DELAYED': return <AlertTriangle className="h-4 w-4 mr-1 text-destructive" />;
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4 mr-1 text-destructive" />; // Added for completeness
      default: return <TrainFront className="h-4 w-4 mr-1" />;
    }
  };
  
  const selectedTrain = trains.find(t => t.id === selectedTrainId);

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        mapId="train-tracker-map"
        center={mapCenter}
        // zoom={10}
        // gestureHandling="greedy"
        disableDefaultUI={false}
        className="w-full h-full"
        
        style={{ borderRadius: 'inherit' }} // Ensure map respects parent border radius
      >
        {trains.map((train) => (
          <AdvancedMarker
            key={train.id}
            position={{ lat: train.lat, lng: train.lng }}
            onClick={() => setSelectedTrainId(train.id === selectedTrainId ? null : train.id)}
          >
            <div className={`p-1 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer ${
              train.routeId === 'A' ? 'bg-blue-400 text-black' :
              train.routeId === 'B' ? 'bg-green-400 text-white' :
              train.routeId === 'D' ? 'bg-green-600 text-white' :
              train.routeId === 'E' ? 'bg-purple-600 text-white' :
              train.routeId === 'G' ? 'bg-yellow-400 text-white' :
              train.routeId === 'H' ? 'bg-blue-600 text-white' :
              train.routeId === 'L' ? 'bg-yellow-600 text-black' :
              train.routeId === 'N' ? 'bg-purple-600 text-white' :
              train.routeId === 'R' ? 'bg-green-300 text-black' :
              train.routeId === 'W' ? 'bg-teal-600 text-black' :
              'bg-primary text-primary-foreground' // Default color if direction is unknown
            }`}>
              {train.routeId} {`${train.directionName === 'Westbound' ? '←' :
              train.directionName === 'Eastbound' ? '→' :
              train.directionName === 'Northbound' ? '↑' :
              train.directionName === 'Southbound' ? '↓'
              : ''}`}
              <TrainFront className="w-3 h-3 text-primary-foreground" />
            </div>
          </AdvancedMarker>
        ))}
        {selectedTrain && (
          <InfoWindow
            position={{ lat: selectedTrain.lat, lng: selectedTrain.lng }}
            onCloseClick={() => setSelectedTrainId(null)}
            pixelOffset={[0, -35]} // Adjust to position above the custom marker
          >
            <div className="p-3 bg-card text-card-foreground rounded-lg shadow-xl min-w-[220px]">
              <h3 className="font-headline text-lg font-semibold mb-1 text-primary">{selectedTrain.routeId} Line - {selectedTrain.label} ({selectedTrain.directionName})</h3>
              <div className="text-sm flex items-center mb-1">
                {getStatusIcon(selectedTrain.tripStatus)}
                Status: {selectedTrain.tripStatus.replace(/_/g, ' ')}
              </div>
              {selectedTrain.nextStop && (
                <p className="text-sm">Next: {selectedTrain.nextStop.name}</p>
              )}
              {selectedTrain.currentStop && (
                <p className="text-sm">At: {selectedTrain.currentStop.name}</p>
              )}
              {!selectedTrain.currentStop && selectedTrain.tripStatus === "IN_TRANSIT_TO" && (
                 <p className="text-sm">Currently: In Transit</p>
              )}
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
};

export default TrainMap;
