import { parseHTML, defaultTagRE } from "./parser";

// 生成属性
function genProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}

// 生成孩子代码
function gen(node) {
    // 如果孩子还是元素，则递归调用代码生成，反之则按照文本处理
    if (node.type === 1) {
        return codeGen(node);
    } else {
        let text = node.text;
        // 如果匹配不到{{}}，则按照普通文本处理，反之则
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        } else {
            let tokens = [];
            let match;
            defaultTagRE.lastIndex = 0;
            let lastIndex = 0;
            while (match = defaultTagRE.exec(text)) { // defaultTagRE匹配{{}}这两对大括号
                let index = match.index; // 匹配的位置
                if (index > lastIndex) { // 如果匹配位置大于上次记录的位置，说明{{name}} ... {{age}} 这两对变量中间还有文本
                    tokens.push(JSON.stringify(text.slice(lastIndex, index))) // 把中间这部分文本push进token
                }
                lastIndex = index + match[0].length; // 更新最后匹配的位置
                tokens.push(`_s(${match[1].trim()})`) // 文本直接push进tokens，变量需要带_s函数去包裹
            }
            if (lastIndex < text.length) { // 变量后面还有文本，也要push进tokens
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})` //{{name}}myage:{{age}} -> _v(_s(name)+myage:+_s(age))
        }
    }
}

// 生成子节点
function genChildren(children) {
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
}

export function codeGen(ast) {
    let children = genChildren(ast.children);
    let code = `_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : null}${ast.children.length ? `,${children}` : ''})`
    return code;
}

export function compileToFunction(template) {
    let ast = parseHTML(template);
    let code = codeGen(ast);
    code = `with(this){return ${code}}`
    let render = new Function(code);
    return render;
}