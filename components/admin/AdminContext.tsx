"use client";

import { createContext, useContext } from "react";

export interface AdminContextValue {
  /** This server offers admin mode (only then is the admin button shown). */
  available: boolean;
  isAdmin: boolean;
  openAdmin: () => void;
}

export const AdminContext = createContext<AdminContextValue>({ available: false, isAdmin: false, openAdmin: () => undefined });

export const useAdmin = () => useContext(AdminContext);
