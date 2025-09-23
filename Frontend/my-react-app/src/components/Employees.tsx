"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import axios from "axios"; // Keep for the isAxiosError type guard
import api from "@/lib/api"; // Import our new authenticated API client

// Employee type
type Employee = {
  _id: string;
  jobID: string;
  name: string;
  email: string;
  password?: string;
  roleType?: string;
  jobTitle: string;
  department: string;
  joiningDate: string;
};

type FormData = {
  name: string;
  email: string;
  password: string;
  jobTitle: string;
  roleType: string;
  department: string;
  joiningDate: string;
};

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      jobTitle: "",
      roleType: "",
      department: "",
      joiningDate: ""
    }
  });

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function fetchEmployees() {
    try {
      const response = await api.get("/employees");
      const employeesFromDb = response.data.map((emp: any, index: number) => ({
        _id: emp._id,
        jobID: `CT-${index + 1}`, // Backend doesn't provide this, generating on client
        name: emp.name,
        email: emp.email,
        jobTitle: emp.jobTitle,
        department: emp.department,
        joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split("T")[0] : "",
      }));
      setEmployees(employeesFromDb);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Failed to fetch employees from server.");
      setEmployees([]); // Reset to empty on error
    }
  }

  async function onSubmit(data: FormData) {
    try {
      await api.post("/employees", data);

      toast.success("Employee added successfully!");
      form.reset();
      setIsDialogOpen(false);
      fetchEmployees(); // Refetch employees to get the latest list from the server
    } catch (error) {
      console.error("Failed to add employee:", error);
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error) && error.response) {
        // The backend sends { message: '...', error: '...' } on 500
        // and { message: '...' } on 4xx
        const errorData = error.response.data;
        if (errorData?.error) {
          errorMessage = errorData.error; // Show the detailed Mongoose error
        } else if (errorData?.message) {
          errorMessage = errorData.message; // Show the generic error message
        }
      }
      toast.error(`Failed to add employee: ${errorMessage}`);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/employees/${id}`);
      // Refetch or filter locally for an optimistic update
      setEmployees(employees.filter((employee) => employee._id !== id));
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error("Failed to delete employee:", error);
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(`Failed to delete employee: ${errorMessage}`);
    }
  };

  const handleEdit = (id: string) => {
    toast("Edit functionality to be implemented!");
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Employee</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name" {...field} />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  rules={{ required: "Job Title is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job title" {...field} />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="roleType"
                  rules={{ required: "Job Title is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Role type</FormLabel>
                      <FormControl>
                        
                          <select {...field} className="border p-2 rounded w-full">
                            <option value="">Select role type</option>
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                          </select>
                        
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  rules={{ required: "Department is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter department" {...field} />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joiningDate"
                  rules={{ required: "Joining Date is required" }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Joining Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address"
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="employee@example.com" {...field} />
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 chars" }
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Employees in the system</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No.</TableHead>
              <TableHead>Job ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Joining Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee, index) => (
              <TableRow key={employee._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{employee.jobID}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.joiningDate}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(employee._id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(employee._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
