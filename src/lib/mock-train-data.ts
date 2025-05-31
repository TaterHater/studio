import type { Train, Stop } from '@/types/train';

export const initialTrainData: Train[] = [
  {
    id: "TRAIN_A_001",
    label: "A Line",
    bearing: 90,
    directionId: 0,
    directionName: "Eastbound",
    tripStatus: "SCHEDULED",
    lat: 39.750809,
    lng: -104.996500, 
    occupancyStatus: "FEW_SEATS_AVAILABLE",
    tripId: "TRIP_A_101",
    shapeId: "SHAPE_A",
    routeId: "A",
    serviceDate: "2025-05-31",
    headsign: "Denver Airport",
    timestamp: Date.now(),
    prevStop: null,
    currentStop: { id: "union_station", name: "Union Station Track 1" },
    nextStop: { id: "station_38_blake", name: "38th & Blake Station" },
  },
  {
    id: "TRAIN_B_002",
    label: "B Line",
    bearing: 180,
    directionId: 1,
    directionName: "Southbound",
    tripStatus: "IN_TRANSIT_TO",
    lat: 39.775479,
    lng: -105.003584, 
    occupancyStatus: "MANY_SEATS_AVAILABLE",
    tripId: "TRIP_B_202",
    shapeId: "SHAPE_B",
    routeId: "B",
    serviceDate: "2025-05-31",
    headsign: "Union Station",
    timestamp: Date.now(),
    prevStop: { id: "station_westminster", name: "Westminster Station" },
    currentStop: null, 
    nextStop: { id: "station_pecos", name: "Pecos Junction Station" },
  },
  {
    id: "TRAIN_C_003",
    label: "C Line",
    bearing: 270,
    directionId: 0,
    directionName: "Westbound",
    tripStatus: "STOPPED_AT",
    lat: 39.702200,
    lng: -105.053900, 
    occupancyStatus: "FULL",
    tripId: "TRIP_C_303",
    shapeId: "SHAPE_C",
    routeId: "C",
    serviceDate: "2025-05-31",
    headsign: "Littleton-Mineral",
    timestamp: Date.now(),
    prevStop: { id: "station_oxford", name: "Oxford-City of Sheridan Station" },
    currentStop: { id: "station_littleton_dwntn", name: "Littleton-Downtown Station" },
    nextStop: { id: "station_mineral", name: "Littleton-Mineral Station" },
  },
  {
    id: "TRAIN_D_004",
    label: "R Line",
    bearing: 0,
    directionId: 1,
    directionName: "Northbound",
    tripStatus: "DELAYED",
    lat: 39.717270,
    lng: -104.831860,
    occupancyStatus: "FEW_SEATS_AVAILABLE",
    tripId: "TRIP_D_404",
    shapeId: "SHAPE_D",
    routeId: "R",
    serviceDate: "2025-05-31",
    headsign: "Peoria Station",
    timestamp: Date.now(),
    prevStop: { id: "station_florida", name: "Florida Station" },
    currentStop: null,
    nextStop: { id: "station_iliff", name: "Iliff Station" },
  },
];

const possibleStatuses: Train['tripStatus'][] = ["SCHEDULED", "IN_TRANSIT_TO", "STOPPED_AT", "DELAYED", "COMPLETED"];
const stopNames = ["Central Park", "Peoria", "40th & Airport", "Gateway Park", "Union Station", "Oak Station", "Federal Center", "Auraria West"];

export function simulateTrainUpdates(trains: Train[]): Train[] {
  return trains.map(train => {
    let newLat = train.lat;
    let newLng = train.lng;
    const newStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
    
    let newNextStop = train.nextStop;
    let newCurrentStop = train.currentStop;
    let newPrevStop = train.prevStop;

    // Simulate movement only if in transit or scheduled (and becomes in transit)
    if (train.tripStatus === "IN_TRANSIT_TO" || (train.tripStatus === "SCHEDULED" && newStatus === "IN_TRANSIT_TO")) {
        newLat += (Math.random() - 0.5) * 0.002; 
        newLng += (Math.random() - 0.5) * 0.002;
    }
    
    if (newStatus === "STOPPED_AT") {
        if (train.tripStatus === "IN_TRANSIT_TO" && train.nextStop) { // Arrived at nextStop
            newPrevStop = train.currentStop; // Old current (or null if first stop) becomes previous
            newCurrentStop = train.nextStop; // Next stop becomes current
             // Pick a new random next stop
            const randomNextStopName = stopNames[Math.floor(Math.random() * stopNames.length)];
            newNextStop = { id: `st_${randomNextStopName.toLowerCase().replace(/ /g, '_')}_${Math.random().toString(36).substring(2, 5)}`, name: randomNextStopName };
            // Snap lat/lng to current stop for simulation, if currentStop has coords (not in this mock)
            // newLat = newCurrentStop.lat; newLng = newCurrentStop.lng; 
        } else if (!train.currentStop && train.nextStop) { // If it was scheduled at no specific stop and now stopped at its first designated stop
            newCurrentStop = train.nextStop;
            const randomNextStopName = stopNames[Math.floor(Math.random() * stopNames.length)];
            newNextStop = { id: `st_${randomNextStopName.toLowerCase().replace(/ /g, '_')}_${Math.random().toString(36).substring(2, 5)}`, name: randomNextStopName };
        }
    } else if (newStatus === "IN_TRANSIT_TO") {
        if(train.tripStatus === "STOPPED_AT" && train.currentStop) { // Departed from currentStop
            newPrevStop = train.currentStop;
            newCurrentStop = null;
            // Next stop should already be set or could be re-randomized if needed
            if (!train.nextStop) {
                const randomNextStopName = stopNames[Math.floor(Math.random() * stopNames.length)];
                newNextStop = { id: `st_${randomNextStopName.toLowerCase().replace(/ /g, '_')}_${Math.random().toString(36).substring(2, 5)}`, name: randomNextStopName };
            }
        } else if (train.tripStatus === "SCHEDULED" && train.currentStop && !train.nextStop) { // Scheduled at a station, now departing
            newPrevStop = train.currentStop; // currentStop becomes prevStop
            newCurrentStop = null; // Now in transit
            const randomNextStopName = stopNames[Math.floor(Math.random() * stopNames.length)];
            newNextStop = { id: `st_${randomNextStopName.toLowerCase().replace(/ /g, '_')}_${Math.random().toString(36).substring(2, 5)}`, name: randomNextStopName };
        }
    } else if (newStatus === "SCHEDULED" && !train.currentStop && train.nextStop) { // If magically becomes scheduled before first stop
        newPrevStop = null;
    }


    return {
      ...train,
      lat: newLat,
      lng: newLng,
      bearing: Math.random() * 360,
      timestamp: Date.now(),
      tripStatus: newStatus,
      nextStop: newNextStop,
      currentStop: newCurrentStop,
      prevStop: newPrevStop,
    };
  });
}
