export default function access(initialState: any) {
  if (!initialState)
    return {
      adminRouteFilter: () => false,
      normalRouteFilter: () => false,
      limitAuthority: () => false,
    };
  const { currentUser } = initialState;
  const roles = currentUser?.roles || [];
  let hasRoutes: string[] = [];
  if (roles.length > 0) {
    hasRoutes = Array.from(new Set(roles.flatMap((x: { privileges: [string] }) => x.privileges)));
  }
  const codes: Set<string> = new Set(
    roles.flatMap((item: any) => {
      return item?.permissions.map((ite: any) => {
        return ite?.permissionCode;
      });
    }),
  );

  return {
    // ...
    codes,
    canReadFoo: true,
    canUpdateFoo: () => true,
    adminRouteFilter: () => true, // 只有管理员可访问
    normalRouteFilter: (route: any) => hasRoutes.includes(route.authority), // initialState 中包含了的路由才有权限访问
    limitAuthority: (val: string) => hasRoutes.includes(val),
    // canRead: currentUser && isIn(accessRead, currentUser.access),
  };
}
