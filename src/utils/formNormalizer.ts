export const normalizeWithoutSpace = (text: string) => text.replace(/[^a-zA-ZА-Яа-яЁё0-9\-]/gi, '');
export const normalizePositiveDigit = (text: string) => text.replace(/[^0-9\.]/gi, '');
export const normalizeDigit = (text: string) => text.replace(/[^0-9\.\-]/gi, '');
