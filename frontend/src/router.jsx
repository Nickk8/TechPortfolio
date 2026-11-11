import { useContext, useState, useEffect, useCallback, Children } from 'react';
import { RouterContext, useNavigate, useLocation } from './routerContext';

export { useNavigate, useLocation };

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }
    const targetPath = typeof to === 'string' && to.startsWith('/') ? to : `/${to}`;
    if (options.replace) {
      window.history.replaceState({}, '', targetPath);
    } else {
      window.history.pushState({}, '', targetPath);
    }
    setPath(window.location.pathname || '/');
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Routes({ children }) {
  const { path } = useContext(RouterContext);
  const normalizedCurrent = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const routes = Children.toArray(children);

  let match = routes.find(child => {
    if (!child || !child.props) return false;
    const routePath = child.props.path;
    if (!routePath || routePath === '*') return false;
    const normalizedRoute = routePath.length > 1 && routePath.endsWith('/') ? routePath.slice(0, -1) : routePath;
    return normalizedRoute === normalizedCurrent;
  });

  if (!match) {
    match = routes.find(child => child?.props?.path === '*');
  }

  return match ? match.props.element : null;
}

export function Route({ element }) {
  return element;
}

export function Navigate({ to, replace }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);

  return null;
}

export function Link({ to, children, className, onClick, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, onClick, ...props }) {
  const { path, navigate } = useContext(RouterContext);
  const normalizedCurrent = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  const normalizedTo = to.length > 1 && to.endsWith('/') ? to.slice(0, -1) : to;
  const isActive = normalizedCurrent === normalizedTo;

  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} className={resolvedClassName} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

