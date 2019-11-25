interface Dictionary {
  [key: string]: any;
}

export default function prefixKeys<T>(obj: T, prefix: string): T {
  return Object.keys(obj).reduce((clone: T, key: string): T => {
    (clone as Dictionary)[prefix + key] = (obj as Dictionary)[key];
    return clone;
  }, {} as any);
}
