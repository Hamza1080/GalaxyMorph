const GalaxyBackground = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-30">
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-purple-900/10 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  )
}

export default GalaxyBackground
