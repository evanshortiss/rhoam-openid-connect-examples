import { useKeycloak } from '@react-keycloak/web';
import Spinner from './Spinner';

function LoginView () {
  const { initialized, keycloak } = useKeycloak()

  if (!initialized) {
    return <Spinner message="Verifying Authentication Status"/>
  } else if (initialized && keycloak.token) {
    return <Spinner message="Authorized"/>
  } else {
    return (
      <div className="text-center max-w-xlg mx-auto pt-4">
        <h2 className="text-2xl py-2 font-semibold">Welcome to the Store!</h2>
        <p>Once you're logged in your browser will fetch products directly from our partner's API.</p>
      </div>
    )
  }
}

export default LoginView;
