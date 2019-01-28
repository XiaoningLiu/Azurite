export function newEtag(): string {
  // TODO: Implement ETag
  return `"${new Date().getTime()}"`;
}
