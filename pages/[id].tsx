import Editor from '@/components/Editor'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { apiBaseUrl } from '@/helpers/apiSettings'
import Error from 'next/error'
import Head from 'next/head'

const Post = () => {
  const router = useRouter()
  const id = router.query.id

  const { data, error } = useSWR(`${apiBaseUrl}/page/${id}`)

  const post = data

  if (error) return <Error statusCode={error.statusCode} />

  if (!data) return <div>Loading ...</div>

  return (<>
    <Head>
      <title>{post.title} - Solitude</title>
    </Head>
    <Editor {...post} />
  </>)
}

export default Post
