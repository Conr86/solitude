import Editor from '@/components/Editor'
import Head from 'next/head';

const NewPage = () => {
    return (<>
        <Head>
            <title>New Page - Solitude</title>
        </Head>
        <Editor title={"New Page"} content={""} createdAt={new Date()} id={0} updatedAt={new Date()} parentId={null} order={null}/>
    </>
    );
};

export default NewPage