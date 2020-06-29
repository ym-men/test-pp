declare module 'express-form-data' {
    export let union: () => any;
    export let parse: (data: any) => any;
    export let format: () => any;
    export let stream: () => any;
}