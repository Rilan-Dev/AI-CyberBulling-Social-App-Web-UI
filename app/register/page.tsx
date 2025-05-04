"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Shield, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  })
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (error) clearError()
    if (passwordError) setPasswordError(null)
  }

  const validateForm = () => {
    if (formData.password !== formData.password2) {
      setPasswordError("Passwords do not match")
      return false
    }

    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const {...userData } = formData
    await register(userData)
  }

  const nextStep = () => {
    setFormStep(1)
  }

  const prevStep = () => {
    setFormStep(0)
  }

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-gray-900 to-black">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.1),transparent_70%)]"></div>
        {/* Animated grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-8 z-10"
      >
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="h-8 w-8 text-blue-400" />
          <span className="font-bold text-2xl text-white">CyberGuard AI</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Create Account
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md z-10 px-4"
      >
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${formStep === 0 ? "bg-blue-600" : "bg-green-600"}`}
                >
                  {formStep > 0 ? <CheckCircle className="h-5 w-5" /> : "1"}
                </div>
                <div className={`h-1 w-10 ${formStep > 0 ? "bg-green-600" : "bg-gray-700"}`}></div>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${formStep === 1 ? "bg-blue-600" : "bg-gray-700"}`}
                >
                  2
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {passwordError && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {formStep === 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={formVariants}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-gray-300">
                        First Name
                      </Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-gray-300">
                        Last Name
                      </Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 h-11"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {formStep === 1 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={formVariants}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password2" className="text-gray-300">
                      Confirm Password
                    </Label>
                    <Input
                      id="password2"
                      name="password2"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-center text-gray-500 text-sm"
        >
          <p>
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
