"use client"

import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type Holiday = {
  _id: string
  date: string
  name: string
  type: "Public" | "Optional" | "Company"
  description: string
}

export default function Holidays() {
  const [holidays, setHolidays] = React.useState<Holiday[]>([])
  const [newHoliday, setNewHoliday] = React.useState<Partial<Holiday>>({})

  React.useEffect(() => {
    fetch("/api/holidays")
      .then((res) => res.json())
      .then((data) => setHolidays(data))
      .catch(() =>
        setHolidays([
          {
            _id: "1",
            date: "2025-01-26",
            name: "Republic Day",
            type: "Public",
            description: "National holiday in India",
          },
        ])
      )
  }, [])

  const handleAddHoliday = () => {
    if (!newHoliday.date || !newHoliday.name || !newHoliday.type) return

    const holiday: Holiday = {
      _id: Date.now().toString(),
      date: newHoliday.date,
      name: newHoliday.name,
      type: newHoliday.type as Holiday["type"],
      description: newHoliday.description || "",
    }

    // Update state
    setHolidays((prev) => [...prev, holiday])

    // Reset form
    setNewHoliday({})

    // TODO: also send POST request to MongoDB backend
    // fetch("/api/holidays", { method: "POST", body: JSON.stringify(holiday) })
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Holiday Calendar</CardTitle>
          <CardDescription>
            List of upcoming company and public holidays
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Holiday</DialogTitle>
              <DialogDescription>
                Fill in the holiday details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newHoliday.date || ""}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Holiday Name</Label>
                <Input
                  placeholder="e.g. Republic Day"
                  value={newHoliday.name || ""}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  value={newHoliday.type}
                  onValueChange={(value) =>
                    setNewHoliday({ ...newHoliday, type: value as Holiday["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Short description"
                  value={newHoliday.description || ""}
                  onChange={(e) =>
                    setNewHoliday({ ...newHoliday, description: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddHoliday} className="w-full">
                Save Holiday
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead>Holiday Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday._id}>
                <TableCell>{holiday.date}</TableCell>
                <TableCell>{holiday.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      holiday.type === "Public"
                        ? "default"
                        : holiday.type === "Company"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {holiday.type}
                  </Badge>
                </TableCell>
                <TableCell>{holiday.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
