"use client"

export default function BackButton() {
  return (
    <button
      className="btn btn-outline mb-4"
      onClick={() => window.history.back()}
    >
      Back
    </button>
  )
}
