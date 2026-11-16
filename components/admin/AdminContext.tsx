"use client";

import { createContext, useContext } from "react";

export interface AdminContextValue {
  /** This server offers admin mode (only then is the admin button shown). */
  available: boolean;
  isAdmin: boolean;
  openAdmin: () => void;
  exitAdmin: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextValue>({ available: false, isAdmin: false, openAdmin: () => undefined, exitAdmin: async () => undefined });

export const useAdmin = () => useContext(AdminContext);
