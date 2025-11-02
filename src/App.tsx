import { useState, useEffect } from 'react'
import { 
  FiArrowRight, 
  FiArrowDown,
  FiClock, 
  FiHash, 
  FiCode, 
  FiFileText,
  FiLock,
  FiEdit,
  FiZap,
  FiType,
  FiDroplet,
  FiRepeat,
  FiCheckSquare,
  FiMenu,
  FiX,
  FiKey,
  FiEye
} from 'react-icons/fi'

import TimestampConverter from './components/converters/TimestampConverter'
import NumberBase from './components/converters/NumberBase'
import JsonYaml from './components/converters/JsonYaml'

import Base64Tool from './components/encoders/Base64Tool'
import UrlEncoder from './components/encoders/UrlEncoder'
import HtmlEncoder from './components/encoders/HtmlEncoder'
import JwtEncoder from './components/encoders/JwtEncoder'

import JsonFormatter from './components/formatters/JsonFormatter'
import SqlFormatter from './components/formatters/SqlFormatter'
import XmlFormatter from './components/formatters/XmlFormatter'

import UuidGenerator from './components/generators/UuidGenerator'
import HashGenerator from './components/generators/HashGenerator'
import LoremIpsum from './components/generators/LoremIpsum'

import CaseConverter from './components/text/CaseConverter'
import StringEscape from './components/text/StringEscape'
import RegexTester from './components/text/RegexTester'
import TextDiff from './components/text/TextDiff'
import MarkdownPreview from './components/text/MarkdownPreview'

import ColorPicker from './components/graphics/ColorPicker'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import PrivacyPolicy from './components/PrivacyPolicy'
import { APP_NAME } from './constants'

type CategoryId = 'converters' | 'encoders' | 'formatters' | 'generators' | 'text' | 'graphics'
type ToolId = 
  | 'timestamp' | 'number-base' | 'json-yaml'
  | 'base64' | 'url-encoder' | 'html-encoder' | 'jwt-encoder'
  | 'json-formatter' | 'sql-formatter' | 'xml-formatter'
  | 'uuid' | 'hash' | 'lorem'
  | 'case' | 'string-escape' | 'regex' | 'text-diff' | 'markdown-preview'
  | 'color'

interface Category {
  id: CategoryId
  name: string
  icon: React.ReactNode
  tools: Tool[]
}

interface Tool {
  id: ToolId
  name: string
  icon: React.ReactNode
  component: React.ComponentType
}

const categories: Category[] = [
  {
    id: 'generators',
    name: 'Generators',
    icon: <FiZap />,
    tools: [
      { id: 'uuid', name: 'UUID/GUID Generator', icon: <FiZap />, component: UuidGenerator },
      { id: 'lorem', name: 'Lorem Ipsum Generator', icon: <FiType />, component: LoremIpsum },
      { id: 'hash', name: 'Hash Generator', icon: <FiHash />, component: HashGenerator },
    ]
  },
  {
    id: 'text',
    name: 'Text Tools',
    icon: <FiType />,
    tools: [
      { id: 'case', name: 'Case Converter', icon: <FiType />, component: CaseConverter },
      { id: 'regex', name: 'Regex Tester', icon: <FiCheckSquare />, component: RegexTester },
      { id: 'string-escape', name: 'String Escape/Unescape', icon: <FiCode />, component: StringEscape },
      { id: 'text-diff', name: 'Text Diff Compare', icon: <FiRepeat />, component: TextDiff },
      { id: 'markdown-preview', name: 'Markdown Preview', icon: <FiEye />, component: MarkdownPreview },
    ]
  },
  {
    id: 'formatters',
    name: 'Formatters',
    icon: <FiEdit />,
    tools: [
      { id: 'json-formatter', name: 'JSON Formatter', icon: <FiCode />, component: JsonFormatter },
      { id: 'xml-formatter', name: 'XML Formatter', icon: <FiCode />, component: XmlFormatter },
      { id: 'sql-formatter', name: 'SQL Formatter', icon: <FiCode />, component: SqlFormatter },
    ]
  },
  {
    id: 'converters',
    name: 'Converters',
    icon: <FiRepeat />,
    tools: [
      { id: 'json-yaml', name: 'JSON ↔ YAML', icon: <FiCode />, component: JsonYaml },
      { id: 'timestamp', name: 'Timestamp Converter', icon: <FiClock />, component: TimestampConverter },
      { id: 'number-base', name: 'Number Base Converter', icon: <FiHash />, component: NumberBase },
    ]
  },
  {
    id: 'encoders',
    name: 'Encoders & Decoders',
    icon: <FiLock />,
    tools: [
      { id: 'base64', name: 'Base64 Encoder/Decoder', icon: <FiFileText />, component: Base64Tool },
      { id: 'jwt-encoder', name: 'JWT Encoder/Decoder', icon: <FiKey />, component: JwtEncoder },
      { id: 'url-encoder', name: 'URL Encoder/Decoder', icon: <FiLock />, component: UrlEncoder },
      { id: 'html-encoder', name: 'HTML Encoder/Decoder', icon: <FiCode />, component: HtmlEncoder },
    ]
  },
  {
    id: 'graphics',
    name: 'Graphics',
    icon: <FiDroplet />,
    tools: [
      { id: 'color', name: 'Color Picker', icon: <FiDroplet />, component: ColorPicker },
    ]
  }
]

function App() {
  const [expandedCategories, setExpandedCategories] = useState<Set<CategoryId>>(
    new Set(['generators'])
  )
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

  const handleHomeClick = () => {
    setActiveTool(null)
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleCategory = (categoryId: CategoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleToolSelect = (toolId: ToolId) => {
    setActiveTool(toolId)
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false)
    }
  }

  const activeToolData = categories
    .flatMap(cat => cat.tools)
    .find(tool => tool.id === activeTool)

  const ActiveComponent = activeToolData?.component || null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 min-w-[300px] flex">
      <aside className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:h-screen
        `}>
          <div className="p-3 md:p-4 border-b flex items-center justify-between">
            <div>
              <button
                onClick={handleHomeClick}
                className="flex items-center gap-2 text-lg md:text-xl font-bold text-gray-800 hover:text-primary-600 transition-colors duration-300 ease-in-out cursor-pointer text-left"
                aria-label="Go to homepage"
              >
                <img 
                  src="/favicon.svg" 
                  alt="Logo" 
                  className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0"
                />
                {APP_NAME}
              </button>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <nav className="p-2 overflow-y-auto h-[calc(100vh-80px)]">
            {categories.map((category) => (
              <div key={category.id} className="mb-1">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2 text-left hover:bg-gray-100 rounded-lg transition text-sm md:text-base"
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                  {expandedCategories.has(category.id) ? (
                    <FiArrowDown className="text-gray-500 flex-shrink-0" size={16} />
                  ) : (
                    <FiArrowRight className="text-gray-500 flex-shrink-0" size={16} />
                  )}
                </button>
                
                {expandedCategories.has(category.id) && (
                  <div className="ml-4 md:ml-6 mt-1 space-y-1">
                    {category.tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolSelect(tool.id)}
                        className={`w-full flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 text-left rounded-lg transition text-sm md:text-base ${
                          activeTool === tool.id
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {tool.icon}
                        <span className="truncate">{tool.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
      </aside>

      {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
      )}

      <main className="flex-1 min-w-0 w-full md:w-auto flex flex-col min-h-screen md:h-screen overflow-x-hidden">
          <div className="sticky top-0 z-30 bg-white border-b md:hidden px-3 py-2 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-700 hover:text-gray-900"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2 text-lg font-bold text-gray-800 hover:text-primary-600 transition-colors duration-300 ease-in-out cursor-pointer"
              aria-label="Go to homepage"
            >
              <img 
                src="/favicon.svg" 
                alt="Logo" 
                className="w-5 h-5 flex-shrink-0"
              />
              {APP_NAME}
            </button>
            <div className="w-10" />
          </div>
          
          <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-lg md:rounded-xl shadow-lg md:shadow-xl p-3 sm:p-4 md:p-6 max-w-full overflow-x-auto">
              {ActiveComponent ? (
                <ActiveComponent />
              ) : (
                <div className="text-center text-gray-500 py-8 md:py-12 text-sm md:text-base">
                  <div className="md:hidden mb-4">
                    <button
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300 ease-in-out font-medium text-base"
                    >
                      <FiMenu size={20} />
                      Select a tool
                    </button>
                  </div>
                  <div className="text-gray-600">
                    <p className="md:hidden mb-2">Please select a tool to get started</p>
                    <p className="hidden md:block">Select a tool from the menu</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Footer onPrivacyClick={() => setIsPrivacyOpen(true)} />
      </main>
      <CookieBanner onPrivacyClick={() => setIsPrivacyOpen(true)} />
      <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  )
}

export default App
