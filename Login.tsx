import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (
      storedUser.email === data.email &&
      storedUser.password === data.password
    ) {
      alert("Login successful!");
      if (storedUser.role === "admin") {
        navigate("/appointments");
      } else {
        navigate("/forum");
      }
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-card p-8 rounded-2xl shadow-card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full"
          />
          <Input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
            className="w-full"
          />

          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-primary cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
