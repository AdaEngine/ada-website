//
//  PageLayout.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Ignite

struct GridContainer<Content: HTML>: DocumentElement {
    var content: () -> Content
    
    init(@HTMLBuilder content: @escaping () -> Content) {
        self.content = content
    }
    
    var body: some HTML {
        Div {
            content()
        }
        .class("container content-restriction safe-area-insets")
    }
}
