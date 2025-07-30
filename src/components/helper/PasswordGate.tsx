"use client";

import { useEffect, useState } from "react";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("https://screener-backend.alphaco.ai/user/", {
        // fetch("http://127.0.0.1:8000/user", {
      credentials: "include", 
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthenticated");
      })
      .then(() => setAuthenticated(true))
      .catch(() => setAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("https://screener-backend.alphaco.ai/user/login", {
        // const res = await fetch("http://127.0.0.1:8000/user/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.ok) {
      setAuthenticated(true);
    } else {
      alert("Access denied. Invalid Credentials.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-semibold">Login</h1>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Password"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
