"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"

export default function CompleteProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState(null)
  const { toast } = useToast()
  const router = useRouter()
  const { getUserInfo } = useAuth()

  useEffect(() => {
    // Fetch initial user data from OAuth provider
    const fetchUserData = async () => {
      try {
        const data = await getUserInfo()
        setUserData(data)
        
        // Pre-fill form with available data
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || ""
        }))
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    
    fetchUserData()
  }, [getUserInfo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // API call to update user profile
      const response = await fetch("http://localhost:8080/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error("Failed to update profile")
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been completed successfully.",
      })
      
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mesh p-4">
      <Link href="/" className="absolute left-8 top-8 flex items-center gap-2">
        <Zap className="h-6 w-6 text-primary animate-pulse-subtle" />
        <span className="text-xl font-bold gradient-text">StreamLine</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg backdrop-blur bg-background/50 border-primary/20 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold gradient-text">Complete Your Profile</CardTitle>
            <CardDescription>Please provide the remaining information to complete your profile</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <motion.div 
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    required 
                    className="bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
              </motion.div>
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Label htmlFor="companyName">Company name (required)</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="bg-background/50 border-primary/20 focus:border-primary"
                />
              </motion.div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                    Updating Profile...
                  </span>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}