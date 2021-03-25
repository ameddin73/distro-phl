export type Mutable<T> = Partial<{
    -readonly [P in keyof T]: T[P];
}>;

