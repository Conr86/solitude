import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import TreeSidebar from '@/components/TreeSidebar'

export default function App ({ Component, pageProps }: AppProps) {
  return (<div>
    <SWRConfig
      value={{
        fetcher: async (resource: RequestInfo | URL, init) => await fetch(resource, init).then(async res => await res.json())
      }}>
      <TreeSidebar/>
      <div className="container w-full md:max-w-3xl mx-auto py-20">
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  </div>
  )
}
