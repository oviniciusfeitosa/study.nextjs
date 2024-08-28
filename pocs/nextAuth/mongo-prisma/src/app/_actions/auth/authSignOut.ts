"use server";

import { signOut  } from "@/auth";
import {
  isRedirectError,
  redirect,
} from "next/dist/client/components/redirect";

export async function authSignOut() {
  try {
    await signOut({ redirect: false });
  } catch (err) {
    if (isRedirectError(err)) {
      console.error(err);
      throw err;
    }
  } finally {
    redirect("/");
  }
}