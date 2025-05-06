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
    func background<Content: HTML>(@HTMLBuilder content: () -> Content) -> some HTML {
        ZStack {
            content()
            self
        }
    }
    
    func overlay<Content: HTML>(@HTMLBuilder content: () -> Content) -> some HTML {
        ZStack {
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