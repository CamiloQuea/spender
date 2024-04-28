warning: in the working copy of 'src/trpc/react.tsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/src/trpc/react.tsx b/src/trpc/react.tsx[m
[1mindex e4e276f..404432d 100644[m
[1m--- a/src/trpc/react.tsx[m
[1m+++ b/src/trpc/react.tsx[m
[36m@@ -7,16 +7,14 @@[m [mimport { createTRPCReact } from "@trpc/react-query";[m
 import { useState } from "react";[m
 import SuperJSON from "superjson";[m
 [m
[31m-[m
[31m-const createQueryClient = () => new QueryClient({[m
[31m-  defaultOptions: {[m
[31m-    queries:{[m
[31m-      refetchOnWindowFocus: false,[m
[31m-      [m
[31m-    }[m
[31m-  },[m
[31m-[m
[31m-});[m
[32m+[m[32mconst createQueryClient = () =>[m
[32m+[m[32m  new QueryClient({[m
[32m+[m[32m    defaultOptions: {[m
[32m+[m[32m      queries: {[m
[32m+[m[32m        refetchOnWindowFocus: false,[m
[32m+[m[32m      },[m
[32m+[m[32m    },[m
[32m+[m[32m  });[m
 [m
 let clientQueryClientSingleton: QueryClient | undefined = undefined;[m
 const getQueryClient = () => {[m
