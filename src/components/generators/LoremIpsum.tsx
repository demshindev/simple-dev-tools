import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
]

function generateLoremIpsum(type: 'words' | 'sentences' | 'paragraphs', count: number): string {
  if (type === 'words') {
    return Array.from({ length: count }, () => words[Math.floor(Math.random() * words.length)]).join(' ')
  }

  if (type === 'sentences') {
    const sentences: string[] = []
    for (let i = 0; i < count; i++) {
      const wordCount = Math.floor(Math.random() * 15) + 5
      const sentence = Array.from({ length: wordCount }, () => words[Math.floor(Math.random() * words.length)]).join(' ')
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.')
    }
    return sentences.join(' ')
  }

  const paragraphs: string[] = []
  for (let i = 0; i < count; i++) {
    const sentenceCount = Math.floor(Math.random() * 3) + 2
    const paragraph = generateLoremIpsum('sentences', sentenceCount)
    paragraphs.push(paragraph)
  }
  return paragraphs.join('\n\n')
}

export default function LoremIpsum() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    setOutput(generateLoremIpsum(type, count))
  }

  const copyToClipboard = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        if (import.meta.env.DEV) {
          console.error('Failed to copy to clipboard:', e)
        }
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Lorem Ipsum Generator</h2>
      
      <div className="mb-3 sm:mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Count:</label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <button
          onClick={handleGenerate}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Generate
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Result
          </label>
          {output && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700"
              aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
            >
              {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
        <textarea
          value={output}
          readOnly
          className="w-full h-64 sm:h-96 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm bg-gray-50 focus:outline-none"
          placeholder="Generated text will appear here..."
        />
      </div>
    </div>
  )
}

