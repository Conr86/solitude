import Editor from '@/components/Editor'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { apiBaseUrl } from '@/helpers/apiSettings'
import Error from 'next/error'
import Head from 'next/head'
import { LoadingBox } from '@/components/LoadingBox'

const Page = () => {
  const router = useRouter()
  const id = router.query.id

  const { data, error } = useSWR(`${apiBaseUrl}/page/${id}`)

  const page = data

  if (error) return <Error statusCode={error.statusCode} />

  if (!data) return LoadingBox();

  return (<>
    <Head>
      <title>{page.title} - Solitude</title>
    </Head>
    <Editor {...page} />
  </>)
}

export default Page
