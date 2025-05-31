"use client";

import React, { useState, useMemo, FC } from 'react'; // Combined imports
import type { Train } from '@/types/train';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, TrainFront, AlertTriangle, Clock3, CheckCircle, Play } from 'lucide-react';

interface TrainListProps {
  trains: Train[];
}

type SortableTrainKeys = 'label' | 'tripStatus' | 'headsign';
type SortKey = SortableTrainKeys | 'nextStopName' | 'currentStopName';
type SortOrder = 'asc' | 'dsc';

const TrainList: FC<TrainListProps> = ({ trains }) => {
  const [sortKey, setSortKey] = useState<SortKey>('label');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedTrains = useMemo(() => {
    return [...trains].sort((a, b) => {
      let valA: string | number | null | undefined;
      let valB: string | number | null | undefined;

      switch (sortKey) {
        case 'nextStopName':
          valA = a.nextStop?.name;
          valB = b.nextStop?.name;
          break;
        case 'currentStopName':
          valA = a.currentStop?.name;
          valB = b.currentStop?.name;
          break;
        default:
          valA = a[sortKey as SortableTrainKeys];
          valB = b[sortKey as SortableTrainKeys];
      }
      
      valA = valA ?? ''; // Handle null/undefined for sorting
      valB = valB ?? '';


      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') { // Should not happen with current keys
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [trains, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'dsc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getStatusVisuals = (status: Train['tripStatus']) => {
    switch (status) {
      case 'SCHEDULED': return { icon: <Clock3 className="h-5 w-5" />, color: 'text-muted-foreground' };
      case 'IN_TRANSIT_TO': return { icon: <Play className="h-5 w-5 fill-current" />, color: 'text-emerald-500' };
      case 'STOPPED_AT': return { icon: <TrainFront className="h-5 w-5" />, color: 'text-sky-500' };
      case 'COMPLETED': return { icon: <CheckCircle className="h-5 w-5" />, color: 'text-primary' };
      case 'DELAYED': return { icon: <AlertTriangle className="h-5 w-5" />, color: 'text-amber-500' };
      case 'CANCELLED': return { icon: <AlertTriangle className="h-5 w-5" />, color: 'text-destructive' };
      default: return { icon: <TrainFront className="h-5 w-5" />, color: 'text-foreground' };
    }
  };

  const SortableHeader: FC<{ columnKey: SortKey; label: string }> = ({ columnKey, label }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(columnKey)} className="px-2 py-1 text-xs sm:text-sm">
        {label}
        {sortKey === columnKey && <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />}
      </Button>
    </TableHead>
  );

  return (
    <Card className="shadow-lg flex flex-col h-full">
      <CardHeader className="py-4 px-4 sm:px-6">
        <CardTitle className="font-headline text-xl sm:text-2xl">Active Trains</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0 sm:p-2 md:p-4">
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
              <TableRow>
                <SortableHeader columnKey="label" label="Train" />
                <SortableHeader columnKey="tripStatus" label="Status" />
                <SortableHeader columnKey="nextStopName" label="Next Stop" />
                <SortableHeader columnKey="currentStopName" label="Current Stop" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTrains.map((train) => {
                const { icon, color } = getStatusVisuals(train.tripStatus);
                return (
                  <TableRow key={train.id} className="transition-colors hover:bg-muted/50 text-xs sm:text-sm">
                    <TableCell className="font-medium py-2 px-2 sm:px-4">{train.label} <span className="text-muted-foreground">({train.headsign})</span></TableCell>
                    <TableCell className="py-2 px-2 sm:px-4">
                      <div className={`flex items-center ${color}`}>
                        {icon}
                        <span className="ml-2 hidden sm:inline">{train.tripStatus.replace(/_/g, ' ')}</span>
                        <span className="ml-2 sm:hidden">{train.tripStatus.substring(0,3)}..</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-2 sm:px-4">{train.nextStop?.name || 'N/A'}</TableCell>
                    <TableCell className="py-2 px-2 sm:px-4">{train.currentStop?.name || (train.tripStatus === "IN_TRANSIT_TO" ? "In Transit" : "N/A")}</TableCell>
                  </TableRow>
                );
              })}
              {sortedTrains.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No active trains to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainList;

