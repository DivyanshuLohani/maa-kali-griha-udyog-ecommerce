"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userAuthSchema } from "@/lib/validations/auth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
// import { Icons } from "@/components/icons";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>;

export default function LoginForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    const signInResult = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (!signInResult?.ok) {
      if (signInResult?.error == "CredentialsSignin") {
        return toast({
          title: "Invalid Credentials",
          description: "Check your credentials and try again",
          variant: "destructive",
        });
      }
      return toast({
        title: "Something went wrong.",
        description: "Your sign in request failed. Please try again.",
        variant: "destructive",
      });
    }
    router.replace("/");
    return toast({
      title: "Login Successful",
    });
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="text-sm font-bold" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
            <span className="mt-5"></span>
            <Label
              className="text-sm font-bold flex justify-between"
              htmlFor="password"
            >
              <span>Password</span>
              <span className="font-normal">
                <Link href={"/forgot/"} className="underline">
                  Forgot Password?
                </Link>
              </span>
            </Label>
            <Input
              id="password"
              placeholder="name@example.com"
              type="password"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <span className="mt-2"></span>
          <Button className={cn(buttonVariants())} disabled={isLoading}>
            {/* {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
