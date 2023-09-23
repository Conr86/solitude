
export default function ErrorPage({statusCode} : {statusCode: number}) {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{statusCode}</i>
      </p>
    </div>
  );
}