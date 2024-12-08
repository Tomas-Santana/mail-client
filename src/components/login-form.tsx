import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, Login } from "@/types/api/login";
import AuthController from "@/api/controllers/AuthController";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react"

export function LoginForm() {
  const navigate = useNavigate();
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: AuthController.login,
    onSuccess: () => {
      navigate({ to: "/box/$mailbox", params: { mailbox: "INBOX" } });
    },
  })

  const onSubmit = (data: Login) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Login to your account to start using Decoupled.dev
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Jubert" {...field} />
                    </FormControl>
                    <FormDescription>
                      {form.watch("username") &&
                        `Logging in with email: ${form.watch("username")}@decoupled.dev`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {loginMutation.isPending ? <LoaderCircle className="animate-spin" /> : "Login"}
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Dont have an account?{" "}
          <Link href="/auth/register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
