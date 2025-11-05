"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState } from "react"

export const authClient = createAuthClient({
   baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  fetchOptions: {
      onSuccess: (ctx: { response: { headers: { get: (arg0: string) => any; }; }; }) => {
          const authToken = ctx.response.headers.get("set-auth-token")
          // Store the full token (don't split it)
          if(authToken){
            localStorage.setItem("bearer_token", authToken);
          }
      },
      onRequest: (ctx: { headers: { set: (arg0: string,arg1: string) => void; }; }) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : "";
        if (token) {
          ctx.headers.set("Authorization", `Bearer ${token}`);
        }
      }
  }
});

type SessionData = ReturnType<typeof authClient.useSession>

export function useSession(): SessionData {
   const [session, setSession] = useState<any>(null);
   const [isPending, setIsPending] = useState(true);
   const [isRefetching, setIsRefetching] = useState(false);
   const [error, setError] = useState<any>(null);

   const refetch = () => {
      setIsRefetching(true);
      setError(null);
      fetchSession();
   };

   const fetchSession = async () => {
      try {
         const res = await authClient.getSession({
            fetchOptions: {
               auth: {
                  type: "Bearer",
                  token: typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : "",
               },
            },
         });
         setSession(res.data);
         setError(null);
      } catch (err) {
         setSession(null);
         setError(err);
      } finally {
         setIsPending(false);
         setIsRefetching(false);
      }
   };

   useEffect(() => {
      fetchSession();
   }, []);

   return { data: session, isPending, isRefetching, error, refetch };
}