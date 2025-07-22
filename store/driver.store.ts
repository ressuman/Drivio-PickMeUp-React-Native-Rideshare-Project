import { DriverStore, MarkerData } from "@/types/type";
import { create } from "zustand";

/**
 * Zustand store to manage driver-related data.
 * - Stores list of available drivers on the map.
 * - Keeps track of the selected driver (e.g., after user taps on a marker).
 */
export const useDriverStore = create<DriverStore>((set) => ({
  // Array of driver marker data (e.g. for map pins)
  drivers: [] as MarkerData[],

  // Currently selected driver ID (or null if none)
  selectedDriver: null,

  // Set the selected driver by their ID
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),

  // Set the list of available drivers (e.g. fetched from API)
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),

  // Clear the selected driver (used when user changes location)
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));
