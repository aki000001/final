"use client"

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const stores = [
  {
    name: "ローソン大同工前店",
    position: { lat: 35.0875, lng: 136.9290 },
  },
  {
    name: "ピアゴ柴田店",
    position: { lat: 35.0760, lng: 136.9380 },
  },
  {
    name: "ヤマナカ柴田店",
    position: { lat: 35.0750, lng: 136.9370 },
  },
  {
    name: "ウェルシア名古屋大同店",
    position: { lat: 35.0870, lng: 136.9295 },
  },
]

const containerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 35.0820,
  lng: 136.9330,
}

export function StoreMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground text-sm">
          Google Maps APIキーが設定されていません
        </p>
      </div>
    )
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
        {stores.map((store, index) => (
          <Marker key={index} position={store.position} title={store.name} />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}
