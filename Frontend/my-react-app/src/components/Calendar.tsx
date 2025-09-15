"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* Minimal types for events - extend as needed */
type CalEvent = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  notes?: string;
};

export default function Calendar({
  initialEvents = [],
}: {
  initialEvents?: CalEvent[];
}) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [events, setEvents] = useState<CalEvent[]>(initialEvents);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // events grouped by date for quick lookup
  const eventsByDate = useMemo(() => {
    return events.reduce<Record<string, CalEvent[]>>((acc, ev) => {
      acc[ev.date] = acc[ev.date] || [];
      acc[ev.date].push(ev);
      return acc;
    }, {});
  }, [events]);

  const selectedISO = selected ? format(selected, "yyyy-MM-dd") : undefined;
  const todaysEvents = selectedISO ? eventsByDate[selectedISO] ?? [] : [];

  function openAddDialog() {
    setNewTitle("");
    setNewNotes("");
    setIsAddOpen(true);
  }

  function handleAddEvent() {
    if (!selected) return alert("Select a date first");
    const newEv: CalEvent = {
      id: String(Date.now()),
      title: newTitle || "Untitled",
      date: format(selected, "yyyy-MM-dd"),
      notes: newNotes,
    };

    // TODO: replace with your API call that persists to MongoDB
    // await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(newEv) })

    setEvents((s) => [newEv, ...s]);
    setIsAddOpen(false);
  }

  function handleDeleteEvent(id: string) {
    // TODO: call your API to delete
    setEvents((s) => s.filter((e) => e.id !== id));
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Click a date to view or create events</CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                {selected ? format(selected, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={(d) => setSelected(d ?? undefined)}
              />
            </PopoverContent>
          </Popover>

          <Button onClick={openAddDialog} size="sm">
            Add event
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add event</DialogTitle>
                <DialogDescription>
                  Create event for {selected ? format(selected, "PPP") : "no date selected"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-2 py-2">
                <Input
                  placeholder="Event title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Notes (optional)"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calendar */}
        <div>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => setSelected(d ?? undefined)}
            // highlight days that have events
            modifiers={{
              hasEvent: (date) => !!eventsByDate[format(date, "yyyy-MM-dd")],
            }}
            modifiersClassNames={{
              hasEvent: "rdp-has-event", // you can style .rdp-has-event in your CSS
            }}
            showOutsideDays
          />
        </div>

        {/* Events list for selected date */}
        <div>
          <h3 className="text-sm font-medium mb-2">
            {selected ? format(selected, "PPP") : "No date selected"}
          </h3>

          {todaysEvents.length === 0 ? (
            <div className="text-sm text-muted-foreground">No events for this date.</div>
          ) : (
            <div className="space-y-3">
              {todaysEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-md border flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="font-medium">{ev.title}</div>
                    {ev.notes && <div className="text-sm text-muted-foreground">{ev.notes}</div>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        // open edit dialog — omitted for brevity
                        const newTitle = prompt("Edit title", ev.title);
                        if (newTitle !== null) {
                          setEvents((s) => s.map((e) => (e.id === ev.id ? { ...e, title: newTitle } : e)));
                        }
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteEvent(ev.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
