"use client"

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

// ✅ Validation schema
const formSchema = z.object({
  rating: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "Please provide a rating",
  }),
  incrementAmount: z
    .string()
    .min(1, "Increment amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Increment amount must be a positive number",
    }),
  effectiveDate: z.string().min(1, "Effective date is required"),
  trainingGap: z.string().min(5, "Please mention training needs or gaps"),
})

export function Increment() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: "3",
      incrementAmount: "",
      effectiveDate: "",
      trainingGap: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    alert("Increment submitted successfully ✅")
  }

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Employee Increment Form</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Performance Rating</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">⭐ Poor</SelectItem>
                    <SelectItem value="2">⭐⭐ Fair</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Increment Amount */}
          <FormField
            control={form.control}
            name="incrementAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Increment Amount (₹ per month)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Effective Date */}
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective From</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Training Gap */}
          <FormField
            control={form.control}
            name="trainingGap"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Training / Skill Gap</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Mention skills or areas where employee requires training..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Increment
          </Button>
        </form>
      </Form>
    </div>
  )
}
