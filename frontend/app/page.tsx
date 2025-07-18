"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, Send, Star, Sparkles, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StarField from "@/components/star-field"
import GalaxyBackground from "@/components/galaxy-background"
import NasaHeader from "@/components/nasa-header"
import HistoryPanel from "@/components/history-panel"

// Define types for our history items
interface ClassificationHistory {
  id: string
  timestamp: number
  imageUrl: string
  result: string
}

interface ChatHistory {
  id: string
  timestamp: number
  query: string
  response: string
}

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [classificationResult, setClassificationResult] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState("")
  const [chatResponse, setChatResponse] = useState<string | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [isAsking, setIsAsking] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // History states
  const [classificationHistory, setClassificationHistory] = useState<ClassificationHistory[]>([])
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  // Flask API URL - update this to your Flask server address
  const FLASK_API_URL = "http://localhost:5000"

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedClassificationHistory = localStorage.getItem("classificationHistory")
    const savedChatHistory = localStorage.getItem("chatHistory")

    if (savedClassificationHistory) {
      setClassificationHistory(JSON.parse(savedClassificationHistory))
    }

    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory))
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("classificationHistory", JSON.stringify(classificationHistory))
  }, [classificationHistory])

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
  }, [chatHistory])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClassify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError("Please select an image first")
      return
    }

    setIsClassifying(true)
    setError(null)

    try {
      // Create form data to send the file
      const formData = new FormData()
      formData.append("image", selectedFile)

      // Send to Flask backend
      const response = await fetch(`${FLASK_API_URL}/api/classify`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setClassificationResult(data.result)

      // Add to history
      if (data.result && imagePreview) {
        const newHistoryItem: ClassificationHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          imageUrl: imagePreview,
          result: data.result,
        }

        setClassificationHistory((prev) => [newHistoryItem, ...prev].slice(0, 20)) // Keep only the last 20 items
      }
    } catch (error) {
      console.error("Error classifying image:", error)
      setError(`Classification failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setClassificationResult(null)
    } finally {
      setIsClassifying(false)
    }
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) {
      setError("Please enter a question")
      return
    }

    setIsAsking(true)
    setError(null)
    const query = chatInput
    setChatInput("")

    try {
      // Send chat query to Flask backend
      const response = await fetch(`${FLASK_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      setChatResponse(data.response)

      // Add to history
      if (data.response) {
        const newHistoryItem: ChatHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          query: query,
          response: data.response,
        }

        setChatHistory((prev) => [newHistoryItem, ...prev].slice(0, 20)) // Keep only the last 20 items
      }
    } catch (error) {
      console.error("Error getting chat response:", error)
      setError(`Chat request failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setChatResponse(null)
    } finally {
      setIsAsking(false)
    }
  }

  const clearHistory = (type: "classification" | "chat" | "all") => {
    if (type === "classification" || type === "all") {
      setClassificationHistory([])
    }

    if (type === "chat" || type === "all") {
      setChatHistory([])
    }
  }

  const loadHistoryItem = (item: ClassificationHistory | ChatHistory, type: "classification" | "chat") => {
    if (type === "classification" && "imageUrl" in item) {
      setImagePreview(item.imageUrl)
      setClassificationResult(item.result)
    } else if (type === "chat" && "query" in item && "response" in item) {
      setChatResponse(item.response)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <StarField />
      <GalaxyBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <NasaHeader />

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            className="bg-slate-900/60 border-blue-500/30 text-blue-300 hover:bg-blue-900/30"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {isHistoryOpen ? "Hide History" : "Show History"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className={`${isHistoryOpen ? "lg:w-2/3" : "w-full"}`}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/70 border border-red-500 rounded-lg text-white text-center">
                {error}
              </div>
            )}

            <Tabs defaultValue="classify" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900/60 backdrop-blur-sm">
                <TabsTrigger value="classify" className="data-[state=active]:bg-blue-900/50">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Galaxy Classifier
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-blue-900/50">
                  <Star className="mr-2 h-4 w-4" />
                  Expert Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="classify" className="mt-6">
                <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-blue-400">
                      Deep Space Galaxy Classification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleClassify} className="space-y-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
                        <label htmlFor="image-upload" className="text-center mb-2">
                          Upload Galaxy Image
                        </label>
                        <div className="relative">
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="bg-slate-800 border-slate-700 file:bg-blue-900 file:text-white file:border-0"
                          />
                          <Upload
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                            size={18}
                          />
                        </div>
                      </div>

                      {imagePreview && (
                        <div className="mt-4 relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"></div>
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Galaxy preview"
                            className="w-full max-h-64 object-contain rounded-lg border border-blue-500/30"
                          />
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                        disabled={!imagePreview || isClassifying}
                      >
                        {isClassifying ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            Analyzing Galaxy...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Classify Galaxy
                          </div>
                        )}
                      </Button>

                      {classificationResult && (
                        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/30">
                          <h3 className="text-lg font-medium text-center mb-2">Classification Result:</h3>
                          <p className="text-center text-xl font-bold text-blue-300">{classificationResult}</p>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="mt-6">
                <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-blue-400">
                      Cosmic Intelligence Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChatSubmit} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="Ask about galaxies, stars, or cosmic phenomena..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="bg-slate-800 border-slate-700 focus:border-blue-500"
                        />
                        <Button
                          type="submit"
                          className="bg-blue-900 hover:bg-blue-800"
                          disabled={!chatInput.trim() || isAsking}
                        >
                          {isAsking ? (
                            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          ) : (
                            <Send size={18} />
                          )}
                        </Button>
                      </div>

                      {chatResponse && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-blue-900 rounded-full p-2 mr-3">
                              <Star className="h-5 w-5 text-white" />
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/30 flex-1">
                              <p className="text-blue-100">{chatResponse}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-slate-400 text-center mt-4">
                        Powered by NASA Deep Space Network AI
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* History panel */}
          {isHistoryOpen && (
            <div className="lg:w-1/3">
              <HistoryPanel
                classificationHistory={classificationHistory}
                chatHistory={chatHistory}
                onClearHistory={clearHistory}
                onLoadHistoryItem={loadHistoryItem}
              />
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Deep Space Galaxy Research Initiative</p>
        </div>
      </div>
    </main>
  )
}
