import type { Plugin } from 'vite'
import { writeFileSync } from 'fs'
import { join } from 'path'

interface GenerateSEOFilesOptions {
  domain: string
}

function generateRobotsTxt(domain: string): string {
  return `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml
`
}

function generateSitemap(domain: string): string {
  const date = new Date().toISOString()
  
  const categories = [
    {
      id: 'generators',
      tools: ['uuid', 'lorem', 'hash']
    },
    {
      id: 'text',
      tools: ['case', 'regex', 'string-escape', 'text-diff', 'markdown-preview']
    },
    {
      id: 'formatters',
      tools: ['json-formatter', 'xml-formatter', 'sql-formatter']
    },
    {
      id: 'converters',
      tools: ['json-yaml', 'timestamp', 'number-base']
    },
    {
      id: 'encoders',
      tools: ['base64', 'jwt-encoder', 'url-encoder', 'html-encoder']
    },
    {
      id: 'graphics',
      tools: ['color']
    }
  ]
  
  const toolUrls = categories.flatMap(category =>
    category.tools.map(tool => `  <url>
    <loc>https://${domain}/tool/${category.id}/${tool}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
  ).join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${domain}/</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${toolUrls}
</urlset>
`
}

export function generateSEOFilesPlugin(options: GenerateSEOFilesOptions): Plugin {
  let outDir = 'dist'
  
  return {
    name: 'generate-seo-files',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const { domain } = options
      
      const robotsContent = generateRobotsTxt(domain)
      const sitemapContent = generateSitemap(domain)
      
      writeFileSync(join(process.cwd(), outDir, 'robots.txt'), robotsContent, 'utf-8')
      writeFileSync(join(process.cwd(), outDir, 'sitemap.xml'), sitemapContent, 'utf-8')
    }
  }
}
