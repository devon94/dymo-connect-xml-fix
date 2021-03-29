// https://github.com/dymosoftware/dymo-connect-framework/issues/10
export function fixChildren(elem: Element): string {
    if (elem.children.length == 0) {
        if (elem.outerHTML.endsWith("/>") && !elem.outerHTML.includes("DYMO")) {
            const rawTag = elem.outerHTML.substring(0, elem.outerHTML.length - 2).split(" ")[0]
            const cleanTag = rawTag.substring(1, rawTag.length)
            const fixedLine = `${elem.outerHTML.replace("/>", ">")}</${cleanTag}>`
            return fixedLine
        }

        return elem.outerHTML
    }

    const children = Array.from(elem.children)
    const inner = children.map(c => fixChildren(c)).join("")

    return elem.outerHTML.replace(elem.innerHTML, inner)
}

export function getFixedXml(label: ILabel) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(label.getLabelXml(), 'application/xml')
    const DCDXml = Array.from(doc.getElementsByTagName("DesktopLabel")) ?? []
    const DLSXml =  Array.from(doc.getElementsByTagName("DieCutLabel")) ?? [] 
    const elem = label.isDCDLabel() ? DCDXml[0] : DLSXml[0]

    if (!elem) {
        const error = Error(`Label could not be parsed`)
        throw error
    }

    const fixed = fixChildren(elem)
    return fixed
}
