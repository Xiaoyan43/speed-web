import { pathToRegexp } from "path-to-regexp";

export default function matchPath(
  path: string,
  pathname: string,
  options?: object
) {
  const keys: any[] = [];
  const regExp = pathToRegexp(path, keys, getOptions(options));
  const result = regExp.exec(pathname);
  if (!result) {
    return;
  } else {
    let execArr = Array.from(result);
    execArr = execArr.slice(1);
    const params = getParams(execArr, keys);
    if (!params) {
      return null;
    }
    return {
      isExact: pathname === result[0],
      params,
      path,
      url: result[0],
    };
  }
}

function getOptions(options = {}) {
  const defaultOptions = {
    exact: false,
    sensitive: false,
    strict: false,
  };
  const opts = { ...defaultOptions, ...options };
  return {
    sensitive: opts.sensitive,
    strict: opts.sensitive,
    end: opts.exact,
  };
}

function getParams(groups: any[], keys: any[]) {
  const obj: any = {};
  for (let i = 0; i < groups.length; i++) {
    const value = groups[i];
    const name = keys[i].name;
    obj[name] = value;
  }
  return obj;
}

function getTitles(tree: any[]) {
  const res: any = {};
  function dfs(tree: any[], par?: []) {
    if (!tree || tree.length === 0) {
      return res;
    }
    for (let i = 0; i < tree.length; i++) {
      const t = tree[i];
      t.par = par ? [...par, t.key] : [t.key];
      if (t.children && t.children.length > 0) {
        dfs(t.children, t.par);
      }
      if (t.key) {
        res[`/${t.par.join("/")}`] = t.label;
      }
    }
  }
  dfs(tree);
  return res;
}

const getAllPath = (pathname: string) => {
  const pathSnippets = pathname.split("/").filter((i: string) => i);
  return pathSnippets.map((_: string, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return url;
  });
};

const treeForeach = (tree: any, path?: any) => {
  return tree
    ?.map((data: any) => {
      const { isMenu, key: _path, children, ...other } = data;
      const pathArr = path ? [...path, _path] : [_path];
      if (isMenu === false) {
        return false;
      }
      return {
        ...other,
        path: _path,
        key: `/${pathArr.join("/")}`,
        children: children ? treeForeach(children, pathArr) : undefined,
      };
    })
    .filter(Boolean);
};

export { matchPath, getTitles, getAllPath, treeForeach };
