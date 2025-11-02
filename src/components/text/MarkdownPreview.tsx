import { useState, useEffect, useRef } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true
})

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is **bold** and this is *italic*.')
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  let html = marked.parse(markdown) as string
  html = html.replace(/<a href=/g, '<a target="_blank" rel="noopener noreferrer" href=')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
      setCopied(true)
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Failed to copy to clipboard:', e)
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Markdown Preview</h2>
      
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Markdown Source
          </label>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700"
            aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="# Heading\n\n**Bold** and *italic* text\n\n- List item"
        />
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Preview
        </label>
        <div 
          className="w-full min-h-48 sm:min-h-64 p-3 sm:p-4 border border-gray-300 rounded-lg bg-white prose prose-sm max-w-none markdown-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}

