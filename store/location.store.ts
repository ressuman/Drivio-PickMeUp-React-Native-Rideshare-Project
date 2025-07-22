import { LocationStore } from "@/types/type";
import { create } from "zustand";
import { useDriverStore } from "./driver.store";

/**
 * Zustand store to manage user and destination location data.
 * - Handles both current user location and chosen destination.
 * - Automatically clears selected driver if location is updated.
 */
export const useLocationStore = create<LocationStore>((set) => ({
  // User's current coordinates and address
  userLatitude: null,
  userLongitude: null,
  userAddress: null,

  // Destination coordinates and address (set by user)
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,

  /**
   * Update user's current location and address.
   * Also clears selected driver if one was chosen previously.
   */
  setUserLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    }));

    // Clear selected driver if location changes
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },

  /**
   * Update destination location and address.
   * Also clears selected driver if one was chosen previously.
   */
  setDestinationLocation: ({
    latitude,
    longitude,
    address,
  }: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    }));

    // Clear selected driver if destination changes
    const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
    if (selectedDriver) clearSelectedDriver();
  },
}));
