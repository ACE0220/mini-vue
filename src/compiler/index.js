import { parseHTML } from "./html-parser"


export function compileToFunction(template) {
    let ast = parseHTML(template);
}