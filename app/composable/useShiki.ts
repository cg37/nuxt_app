import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null

const commonLangs = [
    'ts',
    'js',
    'typescript',
    'javascript',
    'python',
    'bash',
    'shell',
    'json',
    'html',
    'css',
    'scss',
    'vue',
    'yaml',
    'yml',
    'md',
    'mdx',
    'xml',
    'sql',
    'graphql',
    'rust',
    'go',
    'java',
    'c',
    'cpp',
    'csharp',
    'php',
    'ruby',
    'swift',
    'kotlin',
    'text',
]

export async function getHighlighter(): Promise<Highlighter> {
    if (!highlighter) {
        highlighter = await createHighlighter({
            langs: commonLangs,
            themes: ['dark-plus', 'light-plus'],
        })
    }
    return highlighter
}
