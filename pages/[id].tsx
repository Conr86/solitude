import Editor from '@/components/Editor'
import Router, { useRouter } from 'next/router'
import { Page } from '@prisma/client'
import useSWR from 'swr'
import prisma from '@/helpers/prisma'
import { InferGetServerSidePropsType } from 'next'
import Error from 'next/error'
import Head from 'next/head'

// export async function getServerSideProps(context: any) {
//   if (!context.query.id) {
//     return;
//   }
//   const postId = +context.query.id
//   // Fetch data from external API
//   const post = await prisma.page.findUnique({
//     where: { id: postId },
//     select: {
//       title: true,
//       content: true
//     }
//   });

//   // Pass data to the page via props
//   return { props: { post } }
// }

const Post = () => { // {post}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const id = router.query.id

  // if (!post) return <div>An error occured.</div>

  const { data, error } = useSWR(`/api/page/${id}`)

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
