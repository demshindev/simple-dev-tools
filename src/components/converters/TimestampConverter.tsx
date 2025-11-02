import { useState, useEffect, useRef } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>('')
  const [datetime, setDatetime] = useState<string>('')
  const [mode, setMode] = useState<'to-datetime' | 'to-timestamp'>('to-datetime')
  const [copied, setCopied] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (mode === 'to-datetime') {
      if (!timestamp.trim()) {
        setDatetime('')
        return
      }
      const num = parseInt(timestamp)
      if (isNaN(num)) {
        setDatetime('')
        return
      }
      const date = num < 10000000000 ? new Date(num * 1000) : new Date(num)
      const result = date.toISOString().replace('T', ' ').slice(0, 19)
      setDatetime(result)
    }
  }, [timestamp, mode])

  useEffect(() => {
    if (mode === 'to-timestamp') {
      if (!datetime.trim()) {
        setTimestamp('')
        return
      }
      let dtFormatted = datetime.trim()
      if (!dtFormatted.includes('T')) {
        dtFormatted = dtFormatted.replace(' ', 'T')
      }
      if (!dtFormatted.match(/[+-]\d{2}:\d{2}$/) && !dtFormatted.endsWith('Z')) {
        dtFormatted += 'Z'
      }
      const date = new Date(dtFormatted)
      if (isNaN(date.getTime())) {
        setTimestamp('')
        return
      }
      setTimestamp(date.getTime().toString())
    }
  }, [datetime, mode])

  const useCurrentTime = () => {
    const ts = currentTime.toString()
    setTimestamp(ts)
    const num = parseInt(ts)
    if (!isNaN(num)) {
      const date = num < 10000000000 ? new Date(num * 1000) : new Date(num)
      const result = date.toISOString().replace('T', ' ').slice(0, 19)
      setDatetime(result)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Unix Timestamp Converter</h2>
      
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Conversion mode:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('to-datetime')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'to-datetime'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Timestamp → DateTime
          </button>
          <button
            onClick={() => setMode('to-timestamp')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'to-timestamp'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            DateTime → Timestamp
          </button>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <button
          onClick={useCurrentTime}
          className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Use current time
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              {mode === 'to-datetime' ? 'Timestamp' : 'DateTime'}
            </label>
          </div>
          <input
            type="text"
            value={mode === 'to-datetime' ? timestamp : datetime}
            onChange={(e) => {
              if (mode === 'to-datetime') {
                setTimestamp(e.target.value)
              } else {
                setDatetime(e.target.value)
              }
            }}
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder={mode === 'to-datetime' ? '1699123456789' : '2023-11-04 12:34:56'}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              {mode === 'to-datetime' ? 'DateTime' : 'Timestamp'}
            </label>
            {(mode === 'to-datetime' ? datetime : timestamp) && (
              <button
                onClick={() => copyToClipboard(mode === 'to-datetime' ? datetime : timestamp)}
                className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
              >
                {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
              </button>
            )}
          </div>
          <input
            type="text"
            value={mode === 'to-datetime' ? datetime : timestamp}
            readOnly
            className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono bg-gray-50 focus:outline-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>

      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-700 mb-1.5 sm:mb-2">
          <strong>Current time:</strong> {new Date(currentTime).toLocaleString('en-US')}
        </p>
        <p className="text-xs sm:text-sm text-gray-700">
          <strong>Timestamp (ms):</strong> {currentTime}
        </p>
        <p className="text-xs sm:text-sm text-gray-700">
          <strong>Timestamp (s):</strong> {Math.floor(currentTime / 1000)}
        </p>
      </div>
    </div>
  )
}

