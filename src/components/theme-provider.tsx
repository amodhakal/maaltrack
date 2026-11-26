import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />
}

export { ThemeProvider }
