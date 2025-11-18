import { useState, useEffect, useRef } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

function base64UrlEncode(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  try {
    const binary = atob(str)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  } catch {
    throw new Error('Invalid base64url')
  }
}

export default function JwtEncoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [header, setHeader] = useState('{"alg":"HS256","typ":"JWT"}')
  const [payload, setPayload] = useState('{"sub":"1234567890","name":"John Doe","iat":1516239022}')
  const [secret, setSecret] = useState('your-secret-key')
  const [token, setToken] = useState('')
  const [decoded, setDecoded] = useState('')
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const encode = () => {
    try {
      let headerObj
      try {
        headerObj = JSON.parse(header)
        if (typeof headerObj !== 'object' || headerObj === null || Array.isArray(headerObj)) {
          setToken('Error: header must be a JSON object')
          setDecoded('')
          return
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'parse error'
        setToken(`Error: invalid JSON in header - ${errorMsg}`)
        setDecoded('')
        return
      }

      let payloadObj
      try {
        payloadObj = JSON.parse(payload)
        if (typeof payloadObj !== 'object' || payloadObj === null || Array.isArray(payloadObj)) {
          setToken('Error: payload must be a JSON object')
          setDecoded('')
          return
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : 'parse error'
        setToken(`Error: invalid JSON in payload - ${errorMsg}`)
        setDecoded('')
        return
      }

      const encodedHeader = base64UrlEncode(header)
      const encodedPayload = base64UrlEncode(payload)
      const signature = base64UrlEncode(`HMACSHA256(${encodedHeader}.${encodedPayload},${secret})`)
      const jwt = `${encodedHeader}.${encodedPayload}.${signature}`
      setToken(jwt)
      setDecoded('')
    } catch (e) {
      setToken(`Error: ${e instanceof Error ? e.message : 'encoding error'}`)
      setDecoded('')
    }
  }

  const decode = () => {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) {
        setDecoded('Error: invalid JWT format')
        return
      }

      const decodedHeader = base64UrlDecode(parts[0])
      const decodedPayload = base64UrlDecode(parts[1])
      
      const headerObj = JSON.parse(decodedHeader)
      const payloadObj = JSON.parse(decodedPayload)

      setDecoded(JSON.stringify({
        header: headerObj,
        payload: payloadObj,
        signature: parts[2]
      }, null, 2))
    } catch (e) {
      setDecoded(e instanceof Error ? `Error: ${e.message}` : 'Error: invalid JWT')
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
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">JWT Encoder/Decoder</h2>
      
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Mode:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'encode'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Encode (JSON → JWT)
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
              mode === 'decode'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Decode (JWT → JSON)
          </button>
        </div>
      </div>

      {mode === 'encode' ? (
        <>
          <div className="mb-3 sm:mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Header (JSON):</label>
              <textarea
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder='{"alg":"HS256","typ":"JWT"}'
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Payload (JSON):</label>
              <textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder='{"sub":"1234567890","name":"John Doe"}'
              />
            </div>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Secret:</label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="your-secret-key"
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <button
              onClick={encode}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Encode JWT
            </button>
          </div>

          {token && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">JWT Token:</label>
                <button
                  onClick={() => copyToClipboard(token)}
                  className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                  aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
                >
                  {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                value={token}
                readOnly
                className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm bg-gray-50 focus:outline-none break-all"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">JWT Token:</label>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <button
              onClick={decode}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Decode JWT
            </button>
          </div>

          {decoded && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Decoded:</label>
                <button
                  onClick={() => copyToClipboard(decoded)}
                  className="flex items-center gap-1 text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                  aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
                >
                  {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                value={decoded}
                readOnly
                className="w-full h-64 sm:h-96 p-3 sm:p-4 border border-gray-300 rounded-lg font-mono text-xs sm:text-sm bg-gray-50 focus:outline-none"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

