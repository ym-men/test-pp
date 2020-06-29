export type TNullable<T extends Record<keyof any, any>> = { [Key in keyof T]: T[Key] | null };
