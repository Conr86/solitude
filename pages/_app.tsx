import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import BasicSidebar from '@/components/BasicSidebar'
import { SWRConfig } from 'swr'

export default function App({ Component, pageProps }: AppProps) {

  return (<div>
    <SWRConfig
      value={{
        fetcher: (resource: RequestInfo | URL, init) => fetch(resource, init).then(res => res.json())
      }}>
      <BasicSidebar />
      <div className="container w-full md:max-w-3xl mx-auto py-20">
        <Component  {...pageProps} />
      </div>
    </SWRConfig>
  </div>
  )
}
