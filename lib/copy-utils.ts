export interface CopyOptions {
  format?: "plain" | "markdown" | "json"
  includeMetadata?: boolean
}

export function formatPromptForCopy(
  prompt: {
    title: string
    content: string
    description?: string | null
    category: string
    tags: string[]
  },
  options: CopyOptions = {},
): string {
  const { format = "plain", includeMetadata = false } = options

  switch (format) {
    case "markdown":
      return formatAsMarkdown(prompt, includeMetadata)
    case "json":
      return formatAsJSON(prompt, includeMetadata)
    case "plain":
    default:
      return includeMetadata ? formatAsPlainWithMetadata(prompt) : prompt.content
  }
}

function formatAsMarkdown(
  prompt: {
    title: string
    content: string
    description?: string | null
    category: string
    tags: string[]
  },
  includeMetadata: boolean,
): string {
  let markdown = `# ${prompt.title}\n\n`

  if (includeMetadata && prompt.description) {
    markdown += `*${prompt.description}*\n\n`
  }

  markdown += `${prompt.content}\n\n`

  if (includeMetadata) {
    markdown += `---\n`
    markdown += `**Category:** ${prompt.category.replace("-", " ")}\n`
    if (prompt.tags.length > 0) {
      markdown += `**Tags:** ${prompt.tags.join(", ")}\n`
    }
  }

  return markdown
}

function formatAsJSON(
  prompt: {
    title: string
    content: string
    description?: string | null
    category: string
    tags: string[]
  },
  includeMetadata: boolean,
): string {
  const data = includeMetadata
    ? {
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        category: prompt.category,
        tags: prompt.tags,
      }
    : {
        content: prompt.content,
      }

  return JSON.stringify(data, null, 2)
}

function formatAsPlainWithMetadata(prompt: {
  title: string
  content: string
  description?: string | null
  category: string
  tags: string[]
}): string {
  let text = `${prompt.title}\n`
  if (prompt.description) {
    text += `${prompt.description}\n`
  }
  text += `\n${prompt.content}\n\n`
  text += `Category: ${prompt.category.replace("-", " ")}\n`
  if (prompt.tags.length > 0) {
    text += `Tags: ${prompt.tags.join(", ")}\n`
  }
  return text
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand("copy")
      document.body.removeChild(textArea)
      return result
    } catch (fallbackError) {
      return false
    }
  }
}
