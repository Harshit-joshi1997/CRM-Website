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
  const [editTask, setEditTask] = useState<Partial<Task> | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast.error("Could not load tasks.");
      }
    };
    fetchTasks();
  }, []);

  // ✅ Add new task
  const handleAddTask = async () => {
    try {
      setLoading(true);
      const response = await api.post("/tasks", newTask);
      setTasks((prev) => [...prev, response.data]);
      toast.success("Task added successfully!");
      setNewTask({});
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update existing task
  const handleUpdateTask = async () => {
    if (!editTask?._id) return;
    try {
      setLoading(true);
      const response = await api.put(`/tasks/${editTask._id}`, editTask);
      setTasks((prev) =>
        prev.map((t) => (t._id === editTask._id ? response.data : t))
      );
      toast.success("Task updated successfully!");
      setEditTask(null);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[980px] mt-6 mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="mb-4">Task Assignments</CardTitle>
          <CardDescription>All employees</CardDescription>
        </div>

        {/* Add Task Button */}
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
              <Input
                placeholder="Employee Name"
                value={newTask?.employee || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, employee: e.target.value })
                }
              />
              <Input
                placeholder="Designation"
                value={newTask?.designation || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, designation: e.target.value })
                }
              />
              <Input
                placeholder="Department"
                value={newTask?.department || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, department: e.target.value })
                }
              />
              <Input
                placeholder="Task"
                value={newTask?.task || ""}
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
              />
              <Input
                placeholder="Assignee"
                value={newTask?.assignee || ""}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
              />
              <Input
                type="date"
                value={newTask?.date || ""}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
              />
              {/* Status is usually 'Pending' by default for new tasks */}
              <Button
                onClick={handleAddTask}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Task"}
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
              <TableHead>Task</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Date</TableHead>
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
                    <Dialog
                      open={!!editTask && editTask._id === task._id}
                      onOpenChange={(open) =>
                        !open && setEditTask(null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditTask(task)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            value={editTask?.employee || ""}
                            onChange={(e) =>
                              setEditTask({ ...editTask!, employee: e.target.value })
                            }
                          />
                          <Input
                            value={editTask?.designation || ""}
                            onChange={(e) =>
                              setEditTask({ ...editTask!, designation: e.target.value })
                            }
                          />
                          <Input
                            value={editTask?.department || ""}
                            onChange={(e) =>
                              setEditTask({ ...editTask!, department: e.target.value })
                            }
                          />
                          <Input
                            value={editTask?.task || ""}
                            onChange={(e) =>
                              setEditTask({ ...editTask!, task: e.target.value })
                            }
                          />
                          <Input
                            value={editTask?.assignee || ""}
                            onChange={(e) =>
                              setEditTask({ ...editTask!, assignee: e.target.value })
                            }
                          />
                          <Input
                            type="date"
                            value={editTask?.date || ""}
                            onChange={(e) =>
                              setEditTask({ ...editTask!, date: e.target.value })
                            }
                          />
                          <div>
                            <Label>Status</Label>
                            <select
                              className="w-full border rounded px-3 py-2 mt-1"
                              value={editTask?.status || "Pending"}
                              onChange={(e) =>
                                setEditTask({
                                  ...editTask!,
                                  status: e.target.value as Task["status"],
                                })
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                          <Button
                            onClick={handleUpdateTask}
                            className="w-full"
                            disabled={loading}
                          >
                            {loading ? "Updating..." : "Update Task"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6">
                  No tasks available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
