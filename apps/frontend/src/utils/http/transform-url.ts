export function transformUrl(path: string, id: string): string {
  return path.replace(":id", id);
}
