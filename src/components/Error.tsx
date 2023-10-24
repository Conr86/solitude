export default function ErrorPage({ error }: { error: string | undefined }) {
    return (
        <div className="dark:text-gray-100 space-y-4">
            <h1 className={"text-4xl"}>Oops!</h1>
            <p className={"font-semibold"}>
                Sorry, an unexpected error has occurred.
            </p>
            <p>
                <i>{error}</i>
            </p>
        </div>
    );
}
