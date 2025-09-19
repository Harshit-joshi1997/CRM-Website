"use client"

import api from "@/lib/api";
import { toast } from "sonner";
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// ✅ Validation schema for applying leave
const formSchema = z.object({
  leaveType: z.enum(["EL", "SL", "CL", "ML"], {
    required_error: "Please select a leave type",
  }),
  fromDate: z.string().min(1, "Start date is required"),
  toDate: z.string().min(1, "End date is required"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
  prescription: z.any().optional(),
})

// Type for leave data fetched from MongoDB
interface LeaveData {
  type: string
  total: number
  used: number
}

export function Leaves() {
  const [leaveBalances, setLeaveBalances] = React.useState<LeaveData[] | null>(null)
  const [loading, setLoading] = React.useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveType: "EL",
      fromDate: "",
      toDate: "",
      reason: "",
      prescription: null,
    },
  })

  const leaveType = form.watch("leaveType")

  // ✅ Fetch leave balances from MongoDB API
  React.useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await api.get("/leaves"); // Use authenticated client
        setLeaveBalances(response.data.leaves || []);
      } catch (error) {
        console.error("Error fetching leaves:", error)
        toast.error("Could not load leave balances.");
        setLeaveBalances([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeaves()
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    alert("Leave applied successfully ✅")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Leave Balance Section */}
      <div className="p-6 border rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Leave Balances</h2>
        {loading ? (
          <p>Loading...</p>
        ) : leaveBalances && leaveBalances.length > 0 ? (
          <ul className="space-y-2">
            {leaveBalances.map((leave, index) => (
              <li
                key={index}
                className="flex justify-between border p-2 rounded-md"
              >
                <span className="font-medium">{leave.type}</span>
                <span>
                  {leave.used}/{leave.total} used
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No leave data is present at the moment</p>
        )}
      </div>

      {/* Apply for Leave Section */}
      <div className="p-6 border rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Leave Type */}
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EL">Earned Leave (EL)</SelectItem>
                      <SelectItem value="SL">Sick Leave (SL)</SelectItem>
                      <SelectItem value="CL">Casual Leave (CL)</SelectItem>
                      <SelectItem value="ML">Medical Leave (ML)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Range */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>From Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>To Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter reason for leave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prescription (only for SL / ML) */}
            {(leaveType === "SL" || leaveType === "ML") && (
              <FormField
                control={form.control}
                name="prescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor’s Prescription</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Submit */}
            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
