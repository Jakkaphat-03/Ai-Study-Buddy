"use client";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

import { Logo } from "@/components/common/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm } from "@/features/auth/components/auth-form";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const login = mode === "login";

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-6 py-12">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(34,211,238,0.1),transparent_28%)]" />

      {/* Floating orbs */}
      <motion.div
        className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-emerald-500/5 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-cyan-500/5 blur-3xl"
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="mb-10 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Logo />
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <Card>
            <CardHeader className="pb-4 text-center">
              <motion.span
                className="mx-auto mb-3 grid size-11 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
              >
                <BrainCircuit className="size-5" aria-hidden="true" />
              </motion.span>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              >
                <CardTitle className="text-2xl">
                  {login ? "Welcome back" : "Create your account"}
                </CardTitle>
                <CardDescription className="mt-1">
                  {login
                    ? "Continue your focused learning journey."
                    : "Start turning study materials into understanding."}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            >
              <CardContent>
                <AuthForm mode={mode} />
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}