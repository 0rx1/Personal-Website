'use client'

import { useState, useEffect } from 'react'

interface LinkPreviewData {
  title: string
  description: string
  image: string
  url: string
  favicon: string
}

const LinkPreview = ({ url }: { url: string }) => {
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
        const data = await response.json()
        setPreviewData(data)
      } catch (err) {
        setError('Failed to load preview')
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [url])

  if (loading) {
    return (
      <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
        <div className="animate-pulse flex space-x-4">
          <div className="w-24 h-24 bg-green-400/10 rounded"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-green-400/10 rounded w-3/4"></div>
            <div className="h-3 bg-green-400/10 rounded w-1/2"></div>
            <div className="h-3 bg-green-400/10 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-green-400/30 rounded-lg p-4 bg-black/50">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-green-400/30 rounded-lg overflow-hidden hover:bg-black/30 transition-all group"
    >
      <div className="flex">
        {previewData?.image && (
          <div className="w-32 h-32 flex-shrink-0">
            <img 
              src={previewData.image} 
              alt={previewData.title || 'Link preview'} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            {previewData?.favicon && (
              <img 
                src={previewData.favicon} 
                alt="" 
                className="w-4 h-4"
              />
            )}
            <span className="text-white/50 text-sm">{url}</span>
          </div>
          <h3 className="text-cyan-400 font-bold group-hover:text-cyan-300">
            {previewData?.title}
          </h3>
          <p className="text-white/70 text-sm mt-1 line-clamp-2">
            {previewData?.description}
          </p>
        </div>
      </div>
    </a>
  )
}

export default LinkPreview