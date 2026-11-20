import { createContext, useContext } from 'react';

export const RouterContext = createContext({
  path: '/',
  navigate: () => {},
});

export const ParamsContext = createContext({});

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}

export function useLocation() {
  const { path } = useContext(RouterContext);
  return {
    pathname: path,
    search: typeof window !== 'undefined' ? window.location.search : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  };
}

export function useParams() {
  return useContext(ParamsContext);
}
