"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Users, CheckCircle, Award } from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Task type to match the backend schema
type Task = {
  _id: string;
  task: string;
  status: "Completed" | "In Progress" | "Pending";
  // Add other fields from your Task model if needed for other parts of the UI
  [key: string]: any;
};

// Mock leads data (still local)
const leadsSource = [
  { name: "Organic", value: 45 },
  { name: "Referral", value: 25 },
  { name: "Paid", value: 20 },
  { name: "Social", value: 10 },
];

const COLORS = ["#60A5FA", "#34D399", "#F59E0B", "#F97316"];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks"); // Use the authenticated api client
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const totalLeads = leadsSource.reduce((s, l) => s + l.value, 0);

  // Helper to convert status to progress percentage
  const getProgressFromStatus = (status: Task["status"]) => {
    if (status === "Completed") return 100;
    if (status === "In Progress") return 50;
    return 0;
  };

  const completedTasks = tasks.filter(
    (t) => t.status === "Completed"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <div className="flex gap-2">
          <Button size="sm">Export</Button>
          <Button size="sm">Create</Button>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Leads */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Leads</CardTitle>
              <CardDescription className="text-lg font-medium">
                {totalLeads}
              </CardDescription>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ height: 80 }}>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={leadsSource}>
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Tasks Completed</CardTitle>
              <CardDescription className="text-lg font-medium">
                {loading ? "Loading..." : `${completedTasks}/${tasks.length}`}
              </CardDescription>
            </div>
            <div className="p-2 rounded-lg bg-amber-50">
              <CheckCircle className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Fetching tasks...</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t._id}>
                    <div className="flex justify-between text-sm">
                      <span>{t.task}</span>
                      <span>{getProgressFromStatus(t.status)}%</span>
                    </div>
                    <Progress value={getProgressFromStatus(t.status)} className="mt-1" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employee of the Month */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Employee of the Month</CardTitle>
              <CardDescription className="text-lg font-medium">
                Aisha Patel
              </CardDescription>
            </div>
            <div className="p-2 rounded-lg bg-pink-50">
              <Award className="h-6 w-6 text-pink-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/avatars/aisha.jpg" alt="Aisha" />
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Aisha Patel</div>
                <div className="text-sm text-muted-foreground">
                  Sales Manager • 4.9 avg rating
                </div>
                <div className="mt-2">
                  <Button size="sm">View profile</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Leads by Source</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={leadsSource}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {leadsSource.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">Aisha closed a deal</div>
                  <div className="text-xs text-muted-foreground">
                    2 hours ago
                  </div>
                </div>
                <div className="text-sm">+$1,200</div>
              </div>

              <Separator />

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">Bugfixes deployed</div>
                  <div className="text-xs text-muted-foreground">
                    1 day ago
                  </div>
                </div>
                <div className="text-sm">—</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
