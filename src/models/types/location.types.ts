export interface PollingLocation {
  locationName: string
  address: string
  lat: number
  lng: number
  pollingHours?: string
  startDate?: string
  endDate?: string
  notes?: string
}

export interface DriverLocation {
  id: string
  userId: string
  user: {
    id: string
    name: string
    phone: string | null
  }
  currentLat: number | null
  currentLng: number | null
  availableSeats: number | null
  distance: number
}

export interface LocationResponse<T> {
  message: string
  data: T
}
