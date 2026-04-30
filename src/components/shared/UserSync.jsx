"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (user.publicMetadata?.userMongoId) return;

    fetch("/api/user/ensure-synced", { method: "POST" })
      .then((r) => r.json())
      .then((data) => { if (data.success) user.reload(); })
      .catch((err) => console.error("UserSync error:", err));
  }, [isLoaded, isSignedIn, user]);

  return null;
}
