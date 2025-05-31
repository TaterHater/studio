export interface Stop {
  id: string;
  name: string;
}

export interface Train {
  id: string;
  label: string; // Train name/number
  bearing: number;
  directionId: number;
  directionName: string;
  tripStatus: "SCHEDULED" | "IN_TRANSIT_TO" | "STOPPED_AT" | "COMPLETED" | "CANCELLED" | "DELAYED";
  lat: number;
  lng: number;
  occupancyStatus: string | null;
  tripId: string;
  shapeId: string;
  routeId: string;
  serviceDate: string;
  headsign: string;
  timestamp: number;
  prevStop: Stop | null;
  currentStop: Stop | null;
  nextStop: Stop | null;
}
