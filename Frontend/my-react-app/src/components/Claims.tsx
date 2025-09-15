"use client"

import { useState, useEffect } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Claim = {
  _id: string
  type: string
  amount: number
  date: string
  status: "Pending" | "Approved" | "Rejected"
}

export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [newClaim, setNewClaim] = useState<Partial<Claim>>({})

  useEffect(() => {
    fetch("/api/claims")
      .then((res) => res.json())
      .then((data) => setClaims(data))
      .catch(() => setClaims([]))
  }, [])

  const handleAddClaim = () => {
    const claim: Claim = {
      _id: String(Date.now()),
      type: newClaim.type || "General",
      amount: Number(newClaim.amount) || 0,
      date: newClaim.date || new Date().toISOString().split("T")[0],
      status: "Pending",
    }
    setClaims([...claims, claim])
    setNewClaim({})
  }

  return (
    <Card className="w-[980px] mx-auto mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Employee Claims</CardTitle>
          <CardDescription>Track your reimbursement & claim requests</CardDescription>
        </div>

        {/* Add Claim Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Claim
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit a Claim</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Claim Type</Label>
                <Input
                  placeholder="Travel, Medical, Food..."
                  value={newClaim.type || ""}
                  onChange={(e) =>
                    setNewClaim({ ...newClaim, type: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={newClaim.amount || ""}
                  onChange={(e) =>
                    setNewClaim({ ...newClaim, amount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newClaim.date || ""}
                  onChange={(e) =>
                    setNewClaim({ ...newClaim, date: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddClaim} className="w-full">
                Submit Claim
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>S.No</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.length > 0 ? (
              claims.map((claim, idx) => (
                <TableRow key={claim._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>₹{claim.amount}</TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        claim.status === "Approved"
                          ? "default"
                          : claim.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                  No claims submitted yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
