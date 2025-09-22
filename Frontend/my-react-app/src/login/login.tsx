"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Github, Apple, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const { login } = useAuth();

  const form = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await axios.post("http://localhost:5000/login", values);
      const { token, user } = response.data;
      if (token && user) {
        login(user, token);
        console.log("Login successful", token, user);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid login response from server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Invalid credentials.");
      } else {
        toast.error("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-5 bg-gradient-to-b from-blue-600 to-gray-400">
      <div className="w-full max-w-5xl bg-black flex rounded-2xl overflow-hidden shadow-xl">
        {/* Left Section */}
        <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-between p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">AMU</h1>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Sign In
            </Button>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                alt="background"
                className="rounded-lg mb-6"
              />
              <p className="text-lg font-medium">
                Capturing Moments, <br /> Creating Memories
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-gray-200 p-10 text-black flex items-center justify-center">
          <Card className="w-full max-w-md bg-transparent border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="bg-[#2A273B] border-none text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password with toggle */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="bg-[#2A273B] border-none text-white pr-10"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>

              {/* OR divider */}
              <div className="flex items-center gap-2 my-5">
                <div className="h-[1px] flex-1 bg-gray-600" />
                <span className="text-xs text-gray-500">OR</span>
                <div className="h-[1px] flex-1 bg-gray-600" />
              </div>

              {/* OAuth */}
              <div className="flex gap-3 mb-4">
                <Button
                  variant="outline"
                  className="w-full hover:bg-red-600 hover:text-white flex items-center gap-2"
                >
                  <Github className="h-4 w-4" /> Google
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Apple className="h-4 w-4" /> Apple
                </Button>
              </div>

              {/* Links */}
              <div className="text-sm text-gray-600">
                Don’t have an account?
                <NavLink
                  to="/register"
                  className="underline mx-2 cursor-pointer text-blue-600"
                >
                  Register
                </NavLink>
                <br />
                Forgot Password?
                <NavLink
                  to="/forgot-password"
                  className="underline mx-2 cursor-pointer text-blue-600"
                >
                  Reset
                </NavLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
