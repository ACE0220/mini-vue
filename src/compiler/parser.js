
// 匹配正则
const unicodeRegExp =
    /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

const attribute =
    /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性 第一个分组是属性的key 分组3/4/5就是value
const dynamicArgAttribute =
    /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配到的分组是一个标签名 <div 即开始标签名
const startTagClose = /^\s*(\/?)>/ // 自闭合标签 <div /> <br/>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配的是</xxx , 即结束标签名
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{name}} {{age}} 匹配表达式变量

export function parseHTML(html) {
    const ELEMENT_TYPE = 1; // 元素类型是1
    const TEXT_TYPE = 3; // 文本类型是3
    const stack = []; // 存放元素的栈，遇到开始标签入栈，匹配到结束标签出栈
    let currentParent; // 指向栈的最后一个
    let root;

    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null,
        }
    }

    function start(tag, attrs) {
        let node = createASTElement(tag, attrs); // 
        if (!root) { // 如果root为空，则node作为根节点
            root = node;
        }
        if (currentParent) {
            node.parent = currentParent; // 赋予parent属性
            currentParent.children.push(node); // 父亲还要记住自己
        }
        stack.push(node); // 压入栈
        currentParent = node; // 指针指向最后一个node
    }

    function chars(text) { // 文本直接放到当前指向的节点中
        text = text.replace(/\s/g, '')
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }

    // 钩子函数 end 处理结束标签
    function end() {
        stack.pop();
        currentParent = stack[stack.length - 1];
    }

    // 复用advance方法去删除html中的字符串
    function advance(n) {
        html = html.substring(n);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1], // 标签名
                attrs: []
            }
            advance(start[0].length);

            // 如果不是开始标签的结束，就一直匹配
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            }

            if (end) {
                advance(end[0].length);
            }

            return match;

        }

        return false; // 不是开始标签
    }

    while(html) {
        let textEnd = html.indexOf('<');
        if(textEnd === 0) {
            const startTagMatch = parseStartTag();
            if(startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            let endTagMatch = html.match(endTag);
            if(endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        if(textEnd > 0) {
            let text = html.substring(0, textEnd);
            if (text) {
                chars(text);
                advance(text.length); // 解析到的文本
            }
        }
    }
    return root;
}

