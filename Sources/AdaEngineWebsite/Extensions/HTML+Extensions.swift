//
//  HTML+Extensions.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Ignite

typealias Div = Section

extension HTML {
    func avatarModifier() -> some HTML {
        self.class("avatar")
    }
}

extension HTML {
    func background<Content: HTML>(alignment: Alignment = .center, @HTMLBuilder content: () -> Content) -> some HTML {
        ZStack(alignment: alignment) {
            content()
            self
        }
    }
    
    func overlay<Content: HTML>(alignment: Alignment = .center, @HTMLBuilder content: () -> Content) -> some HTML {
        ZStack(alignment: alignment) {
            self
            content()
        }
    }
}

extension HTML {
    func active() -> some HTML {
        self.class("active")
    }

    func elevated() -> some HTML {
        self.class("elevated-element")
    }
}

extension Link {
    init<Content: HTML>(target: URL, @HTMLBuilder content: @escaping () -> Content) {
        self.init(target: target.absoluteString, content: content)
    }
}