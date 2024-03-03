export type Logger = (level: string, message: string) => void;

export function simpleLog(level: string, message: string) {
    if (level === "info")
    {
        // tslint:disable-next-line:no-console
        console.info(message);
    } else if (level === "error")
    {
        // tslint:disable-next-line:no-console
        console.error(message);
    }
}