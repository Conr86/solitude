import Editor from '@/components/Editor'

const NewPage = () => {
    return (
        <Editor title={"New Page"} content={""} createdAt={new Date()} id={0} updatedAt={null} />
    );
};

export default NewPage