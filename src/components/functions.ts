import { TCLR } from "./init";

export function log(message: string, ...args: any[]) {
  console.log(`%c${message}`, `color: ${TCLR}`, ...args);
}
