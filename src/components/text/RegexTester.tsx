import { useState, useMemo } from 'react'

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [text, setText] = useState('')
  const [flags, setFlags] = useState('g')
  const [matches, setMatches] = useState<string[]>([])
  const [error, setError] = useState('')

  const regex = useMemo(() => {
    if (!pattern.trim()) return null
    try {
      return new RegExp(pattern, flags)
    } catch {
      return null
    }
  }, [pattern, flags])

  const testRegex = () => {
    setError('')
    setMatches([])

    if (!pattern.trim()) {
      return
    }

    if (!regex) {
      setError('Invalid regex pattern')
      return
    }

    try {
      const results = text.match(regex)
      if (results) {
        setMatches(results)
      } else {
        setMatches([])
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regex')
    }
  }

  const getHighlightedText = (): React.ReactNode => {
    if (!pattern.trim() || error || !regex) return text

    try {
      const matches = [...text.matchAll(regex)]
      
      if (matches.length === 0) return text

      let result: (string | JSX.Element)[] = []
      let lastIndex = 0

      matches.forEach((match, i) => {
        const matchIndex = match.index || 0
        const before = text.substring(lastIndex, matchIndex)
        if (before) result.push(<span key={`before-${i}`}>{before}</span>)
        
        const matched = match[0]
        result.push(
          <mark key={`match-${i}`} className="bg-yellow-200">
            {matched}
          </mark>
        )
        
        lastIndex = matchIndex + matched.length
      })

      const after = text.substring(lastIndex)
      if (after) result.push(<span key="after">{after}</span>)

      return result
    } catch (e) {
      return text
    }
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Regex Tester</h2>
      
      <div className="mb-3 sm:mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Regular expression:</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            onKeyUp={testRegex}
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="\\d+"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Flags:</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            onKeyUp={testRegex}
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="g, i, m"
          />
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <button
          onClick={testRegex}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Test
        </button>
      </div>

      {error && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 text-xs sm:text-sm bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Test text:</label>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (pattern) testRegex()
          }}
          className="w-full h-40 sm:h-48 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter text to test..."
        />
      </div>

      <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Highlighted result:</label>
        <div className="p-2 sm:p-4 bg-white border border-gray-300 rounded-lg font-mono text-xs sm:text-sm min-h-20 sm:min-h-24">
          {getHighlightedText()}
        </div>
      </div>

      {matches.length > 0 && (
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Matches found: {matches.length}
          </label>
          <div className="border border-gray-300 rounded-lg p-2 sm:p-4 bg-gray-50 max-h-40 sm:max-h-48 overflow-y-auto">
            {matches.map((match, index) => (
              <div key={index} className="p-1.5 sm:p-2 mb-1 bg-white rounded font-mono text-xs sm:text-sm">
                [{index}]: {match}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

