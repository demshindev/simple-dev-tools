import { useState } from 'react'
import React from 'react'

function diffStrings(oldText: string, newText: string): React.ReactNode {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const maxLines = Math.max(oldLines.length, newLines.length)
  const result: (string | JSX.Element)[] = []

  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i] || ''
    const newLine = newLines[i] || ''

    if (oldLine === newLine) {
      result.push(
        <div key={i} className="p-1 border-l-2 border-gray-300">
          <span className="text-gray-600 mr-2">{i + 1}</span>
          <span>{oldLine || '\u00A0'}</span>
        </div>
      )
    } else {
      if (oldLine) {
        result.push(
          <div key={`old-${i}`} className="p-1 border-l-2 border-red-400 bg-red-50">
            <span className="text-gray-600 mr-2">{i + 1}</span>
            <span className="text-red-800 line-through">{oldLine}</span>
          </div>
        )
      }
      if (newLine) {
        result.push(
          <div key={`new-${i}`} className="p-1 border-l-2 border-green-400 bg-green-50">
            <span className="text-gray-600 mr-2">{i + 1}</span>
            <span className="text-green-800 font-medium">{newLine}</span>
          </div>
        )
      }
    }
  }

  return result
}

export default function TextDiff() {
  const [oldText, setOldText] = useState('')
  const [newText, setNewText] = useState('')

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Text Diff Compare</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Original Text
          </label>
          <textarea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter original text..."
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Changed Text
          </label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter changed text..."
          />
        </div>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Diff Result
        </label>
        <div className="border border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50 font-mono text-xs sm:text-sm max-h-96 overflow-y-auto">
          {oldText || newText ? (
            diffStrings(oldText, newText)
          ) : (
            <div className="text-gray-500 text-center py-8">Enter text in both fields to see the difference</div>
          )}
        </div>
      </div>
    </div>
  )
}

