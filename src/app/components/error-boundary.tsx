import { useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError();

  console.log(error);

  return <div>Error</div>;
}
