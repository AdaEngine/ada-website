//
//  File.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Plot
import Publish

/// Base page layout for header, footer and context
struct PageLayout<Content: Component>: Component {
    
    let section: Blog.SectionID?
    
    @ComponentBuilder
    var content: Content
    
    var body: Component {
        ComponentGroup {
            AEHeader(section: self.section)
            
            Div {
                self.content
            }
            .class("container content-restriction safe-area-insets")
            
            AEFooter()
        }
    }
}
