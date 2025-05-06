import Ignite

struct ToggleClassAction: Action {
    let elementId: String
    let className: String

    init(_ elementId: String, _ className: String) {
        self.elementId = elementId
        self.className = className
    }

    func compile() -> String {
        "document.getElementById('\(elementId)').classList.toggle('\(className)')"
    }
}

struct SetClassAction: Action {
    let elementId: String
    let className: String

    init(_ elementId: String, _ className: String) {
        self.elementId = elementId
        self.className = className
    }

    func compile() -> String {
        "document.getElementById('\(elementId)').classList.add('\(className)')"
    }
}

struct RemoveClassAction: Action {
    let elementId: String
    let className: String

    init(_ elementId: String, _ className: String) {
        self.elementId = elementId
        self.className = className
    }

    func compile() -> String {
        "document.getElementById('\(elementId)').classList.remove('\(className)')"
    }
}