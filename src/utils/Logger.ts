export type Logger = (level: string, message: string) => void;

export function simpleLog(level: string, message: string) {
    if (level === "info")
    {
        console.info(message);
    } else if (level === "error")
    {
        console.error(message);
    }
}