"use client";
import api from "@/lib/api";
import { toast } from "sonner";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Task = {
  _id: string;
  employee: string;
  designation: string;
  department: string;
  task: string;
  assignee: string;
  date: string;
  status: "Completed" | "In Progress" | "Pending";
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks"); // Use the authenticated client
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Could not load tasks.");
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    const task: Task = {
      _id: String(Date.now()),
      employee: newTask.employee || "Unknown",
      designation: newTask.designation || "N/A",
      department: newTask.department || "N/A",
      task: newTask.task || "Untitled",
      assignee: newTask.assignee || "N/A",
      date: newTask.date || new Date().toISOString().split("T")[0],
      status: (newTask.status as Task["status"]) || "Pending",
    };
    setTasks([...tasks, task]);
    setNewTask({});
  };

  return (
    <Card className="w-[980px] -ml-15 mt-6 mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="mb-4">Task Assignments</CardTitle>
          <CardDescription>All employees</CardDescription>
        </div>

        {/* Add Task Button with Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee Name</Label>
                <Input
                  value={newTask.employee || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, employee: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Designation</Label>
                <Input
                  value={newTask.designation || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, designation: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Department</Label>
                <Input
                  value={newTask.department || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, department: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Task</Label>
                <Input
                  value={newTask.task || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, task: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Assignee</Label>
                <Input
                  value={newTask.assignee || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newTask.date || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, date: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddTask} className="w-full">
                Save Task
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
              <TableHead>Employee Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Task Assigned</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Assigned Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <TableRow key={task._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{task.employee}</TableCell>
                  <TableCell>{task.designation}</TableCell>
                  <TableCell>{task.department}</TableCell>
                  <TableCell>{task.task}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>{task.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === "Completed"
                          ? "default"
                          : task.status === "In Progress"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-6">
                  No data available to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
