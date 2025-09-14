// app/login/page.tsx

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Github, Apple } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function LoginPage() {
  return (
    <div className="max-w-screen-h-screen -mt-1 p-5 mx-auto rounded-lg flex items-center justify-center bg-gradient-to-b from-blue-600 to-gray-400
     border-lg">
      <div className="w-full max-w-5xl bg-black flex rounded-2xl overflow-hidden shadow-xl">
        
        {/* Left Section */}
        <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-between p-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">AMU</h1>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
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
              <p className="text-lg font-medium">Capturing Moments, <br/> Creating Memories</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-gray-200 p-10 text-white flex items-center justify-center">
          <Card className="w-full max-w-md bg-transparent border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <p className="text-sm text-Black-400">Already have an account? <span className="underline cursor-pointer">Login</span></p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" className="bg-[#2A273B] border-none text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" className="bg-[#2A273B] border-none text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="bg-[#2A273B] border-none text-white mb-2" />
              </div>

              {/* <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the terms and conditions
                </Label>
              </div> */}
            <NavLink to="/dashboard">
              <Button className="w-full mt-5 bg-blue-600 hover:bg-blue-700 bg-purple-600 hover:bg-purple-700">Create account</Button>
            </NavLink>
              <div className="flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-gray-600" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="h-[1px] flex-1 bg-gray-600" />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="w-full hover:bg-white hover:bg-red-600 hover:text-white flex items-center gap-2">
                  <Github className="h-4 w-4" /> Google
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Apple className="h-4 w-4" /> Apple
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
