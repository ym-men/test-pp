export function addDeleted<T extends { id: string }>(last: T[], modified: T[]): T[] {
  return last.map(item => {
    const found = modified.find(m => m.id === item.id);
    return found ? (found.id ? found : item) : { ...item, deleted: true };
  });
}
