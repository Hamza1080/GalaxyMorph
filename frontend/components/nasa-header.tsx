import { Sparkles } from "lucide-react"

const NasaHeader = () => {
  return (
    <header className="text-center py-6">
      <div className="inline-flex items-center justify-center space-x-2 bg-slate-900/60 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-500/30">
        <Sparkles className="h-5 w-5 text-blue-400" />
        <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          DEEP SPACE NETWORK
        </h1>
        <Sparkles className="h-5 w-5 text-blue-400" />
      </div>
      <p className="mt-2 text-blue-200/80 max-w-2xl mx-auto">
        Advanced Galaxy Classification & Cosmic Intelligence System
      </p>
    </header>
  )
}

export default NasaHeader
