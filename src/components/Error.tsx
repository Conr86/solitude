export default function ErrorPage({ message }: { message: string }) {
    return (
        <div className="dark:text-gray-100 space-y-4">
            <h1 className={"text-4xl"}>{message}</h1>
            <p className={"font-semibold"}>
                Sorry, an unexpected error has occurred.
            </p>
        </div>
    );
}
