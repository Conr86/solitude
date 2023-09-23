import Editor from '@/components/Editor.tsx'

const NewPage = () => {
    return (<>
        <Editor title={"New Page"} content={""} createdAt={new Date()} id={0} updatedAt={new Date()} parentId={null} order={null}/>
    </>
    );
};

export default NewPage