import { useState } from 'react'
import { FiCopy, FiCheck } from 'react-icons/fi'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
      val = val / 255
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getContrastRating(ratio: number): { text: string; color: string } {
  if (ratio >= 7) return { text: 'AAA (Large text)', color: 'text-green-600' }
  if (ratio >= 4.5) return { text: 'AA (Large text)', color: 'text-green-600' }
  if (ratio >= 3) return { text: 'AAA (Normal text)', color: 'text-yellow-600' }
  return { text: 'Insufficient', color: 'text-red-600' }
}

export default function ColorPicker() {
  const [color, setColor] = useState('#3b82f6')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [copied, setCopied] = useState('')

  const rgb = hexToRgb(color) || { r: 59, g: 130, b: 246 }
  const bgRgb = hexToRgb(backgroundColor) || { r: 255, g: 255, b: 255 }

  const contrastRatio = getContrastRatio(color, backgroundColor)
  const rating = getContrastRating(contrastRatio)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Failed to copy to clipboard:', e)
      }
    }
  }

  return (
    <div className="min-w-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Color Picker & Contrast Checker</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div className="min-w-0">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Text color
          </label>
          <div className="flex gap-2 mb-2 min-w-0">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 sm:w-16 h-10 sm:h-12 border border-gray-300 rounded cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 min-w-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg space-y-1 min-w-0 overflow-hidden">
            <div className="text-xs sm:text-sm break-words">
              <strong>RGB:</strong> rgb({rgb.r}, {rgb.g}, {rgb.b})
              <button
                onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                className="ml-2 text-primary-600 hover:text-primary-700 flex-shrink-0 inline"
                aria-label={copied === 'rgb' ? 'Copied to clipboard' : 'Copy RGB to clipboard'}
              >
                {copied === 'rgb' ? <FiCheck size={14} /> : <FiCopy size={14} className="inline" />}
              </button>
            </div>
            <div className="text-xs sm:text-sm break-words">
              <strong>RGB (0-1):</strong> rgb({(rgb.r / 255).toFixed(2)}, {(rgb.g / 255).toFixed(2)}, {(rgb.b / 255).toFixed(2)})
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Background color
          </label>
          <div className="flex gap-2 mb-2 min-w-0">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 sm:w-16 h-10 sm:h-12 border border-gray-300 rounded cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="flex-1 min-w-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg space-y-1 min-w-0 overflow-hidden">
            <div className="text-xs sm:text-sm break-words">
              <strong>RGB:</strong> rgb({bgRgb.r}, {bgRgb.g}, {bgRgb.b})
              <button
                onClick={() => copyToClipboard(`rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`, 'bg-rgb')}
                className="ml-2 text-primary-600 hover:text-primary-700 flex-shrink-0 inline"
                aria-label={copied === 'bg-rgb' ? 'Copied to clipboard' : 'Copy background RGB to clipboard'}
              >
                {copied === 'bg-rgb' ? <FiCheck size={14} /> : <FiCopy size={14} className="inline" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Preview</h3>
        <div
          className="p-4 sm:p-8 rounded-lg text-center"
          style={{ backgroundColor: backgroundColor }}
        >
          <p
            className="text-xl sm:text-2xl font-bold"
            style={{ color: color }}
          >
            Sample text
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg min-w-0 overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
            Contrast
          </h3>
          <div className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-700">
              {contrastRatio.toFixed(2)}:1
            </div>
            <div className={`text-xs sm:text-sm ${rating.color}`}>
              <strong>{rating.text}</strong>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-2">
              <p>WCAG recommendations:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5">
                <li>AAA (normal text): ≥ 7:1</li>
                <li>AA (normal text): ≥ 4.5:1</li>
                <li>AAA (large text): ≥ 4.5:1</li>
                <li>AA (large text): ≥ 3:1</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg min-w-0 overflow-hidden">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
            Color codes
          </h3>
          <div className="space-y-2 text-xs sm:text-sm font-mono min-w-0">
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="flex-shrink-0">HEX:</span>
              <span className="flex items-center gap-2 min-w-0 flex-1">
                <span className="break-all min-w-0">{color}</span>
                <button
                  onClick={() => copyToClipboard(color, 'hex')}
                  className="text-primary-600 hover:text-primary-700 flex-shrink-0"
                  aria-label={copied === 'hex' ? 'Copied to clipboard' : 'Copy HEX to clipboard'}
                >
                  {copied === 'hex' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="flex-shrink-0">RGB:</span>
              <span className="flex items-center gap-2 min-w-0 flex-1">
                <span className="break-all min-w-0">rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
                <button
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb-full')}
                  className="text-primary-600 hover:text-primary-700 flex-shrink-0"
                  aria-label={copied === 'rgb-full' ? 'Copied to clipboard' : 'Copy RGB to clipboard'}
                >
                  {copied === 'rgb-full' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </button>
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="flex-shrink-0">RGBA:</span>
              <span className="flex items-center gap-2 min-w-0 flex-1">
                <span className="break-all min-w-0">rgba({rgb.r}, {rgb.g}, {rgb.b}, 1)</span>
                <button
                  onClick={() => copyToClipboard(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`, 'rgba')}
                  className="text-primary-600 hover:text-primary-700 flex-shrink-0"
                  aria-label={copied === 'rgba' ? 'Copied to clipboard' : 'Copy RGBA to clipboard'}
                >
                  {copied === 'rgba' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

