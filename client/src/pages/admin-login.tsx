// import { useState } from "react";
// import { useLocation } from "wouter";
// import { useMutation } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";

// export default function AdminLoginPage() {
//   const [, setLocation] = useLocation();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { toast } = useToast();

//   const loginMutation = useMutation({
//     mutationFn: async (credentials: { username: string; password: string }) => {
//       return await apiRequest("/api/admin/login", {
//         method: "POST",
//         body: JSON.stringify(credentials),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     },
//     onSuccess: (data) => {
//       localStorage.setItem("adminUser", JSON.stringify(data.admin));
//       toast({
//         title: "Login successful",
//         description: "Welcome to the admin dashboard",
//       });
//       setLocation("/admin/dashboard");
//     },
//     onError: () => {
//       toast({
//         title: "Login failed",
//         description: "Invalid credentials. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (username && password) {
//       loginMutation.mutate({ username, password });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
//           <CardDescription className="text-center">
//             Enter your credentials to access the admin dashboard
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Enter your username"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//             <Button 
//               type="submit" 
//               className="w-full"
//               disabled={loginMutation.isPending}
//             >
//               {loginMutation.isPending ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>
//           <div className="mt-4 text-center text-sm text-gray-600">
//             Default credentials: admin / admin123
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// 1st updated

// import { useState } from "react";
// import { useLocation } from "wouter";
// import { useMutation } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";

// export default function AdminLoginPage() {
//   const [, setLocation] = useLocation();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const { toast } = useToast();

//   const loginMutation = useMutation({
//     mutationFn: async (credentials: { username: string; password: string }) => {
//       return await apiRequest("POST", "/api/admin/login", credentials);
//     },
//     onSuccess: (data) => {
//       localStorage.setItem("adminUser", JSON.stringify(data.admin));
//       toast({
//         title: "Login successful",
//         description: "Welcome to the admin dashboard",
//       });
//       setLocation("/admin/dashboard");
//     },
//     onError: () => {
//       toast({
//         title: "Login failed",
//         description: "Invalid credentials. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (username && password) {
//       loginMutation.mutate({ username, password });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
//           <CardDescription className="text-center">
//             Enter your credentials to access the admin dashboard
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Enter your username"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>
//             <Button 
//               type="submit" 
//               className="w-full"
//               disabled={loginMutation.isPending}
//             >
//               {loginMutation.isPending ? "Signing in..." : "Sign in"}
//             </Button>
//           </form>
//           <div className="mt-4 text-center text-sm text-gray-600">
//             Default credentials: admin / admin123
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


//2nd updated

import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Simulate a successful login by directly setting a dummy admin user
    const dummyAdminUser = { username: "admin", role: "superadmin" };
    localStorage.setItem("adminUser", JSON.stringify(dummyAdminUser));

    // Redirect to the admin dashboard immediately
    setLocation("/admin/dashboard");
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            You are now logged in and redirected to the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-gray-600">
            Redirecting to dashboard...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
