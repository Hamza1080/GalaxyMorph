"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Clock, Trash2, ImageIcon, MessageSquare } from "lucide-react"

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

interface HistoryPanelProps {
  classificationHistory: ClassificationHistory[]
  chatHistory: ChatHistory[]
  onClearHistory: (type: "classification" | "chat" | "all") => void
  onLoadHistoryItem: (item: ClassificationHistory | ChatHistory, type: "classification" | "chat") => void
}

const HistoryPanel = ({ classificationHistory, chatHistory, onClearHistory, onLoadHistoryItem }: HistoryPanelProps) => {
  const [activeTab, setActiveTab] = useState<"classification" | "chat">("classification")

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-blue-400 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            History
          </CardTitle>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onClearHistory(activeTab)}
            className="bg-red-900/70 hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="classification"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "classification" | "chat")}
        >
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/60">
            <TabsTrigger value="classification" className="data-[state=active]:bg-blue-900/50">
              <ImageIcon className="mr-2 h-4 w-4" />
              Classifications
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-blue-900/50">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classification" className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {classificationHistory.length === 0 ? (
              <div className="text-center text-slate-400 py-8">No classification history yet</div>
            ) : (
              classificationHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-colors"
                  onClick={() => onLoadHistoryItem(item, "classification")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-slate-600">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt="Galaxy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-blue-300 font-medium">{item.result}</p>
                      <p className="text-xs text-slate-400">{formatDate(item.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center text-slate-400 py-8">No chat history yet</div>
            ) : (
              chatHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-colors"
                  onClick={() => onLoadHistoryItem(item, "chat")}
                >
                  <p className="text-blue-300 font-medium truncate">{item.query}</p>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.response}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(item.timestamp)}</p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default HistoryPanel
