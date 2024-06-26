/**
 * Recursively creates a route configuration array for use with react-router's useRoutes.
 *
 * @param {Array} routeConfig - The initial route configuration array.
 * @returns {Array} - A new array where each RouteObject that has a 'children' property will also have those children transformed.
 *
 * @example
 * // routes configuration array
 * const routeConfig = [
 *   {
 *     path: "/",
 *     element: <HomePage />,
 *     children: [
 *       { path: "about", element: <AboutPage /> },
 *       { path: "contact", element: <ContactPage /> },
 *     ],
 *   },
 *   { path: "*", element: <NotFoundPage /> },
 * ];
 *
 * // usage
 * const routes = createRoutesFromConfig(routeConfig);
 */
export function createRoutesFromConfig(routeConfig) {
    return routeConfig.map(({ children, ...props }) => {
        return children
            ? { ...props, children: createRoutesFromConfig(children) }
            : props;
    });
}