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
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl py-2 font-semibold">Welcome to the Store!</h2>
        <p>You need to login to view our products. Once you're logged in your browser will fetch products directly from our API.</p>
      </div>
    )
  }
}

export default LoginView;
