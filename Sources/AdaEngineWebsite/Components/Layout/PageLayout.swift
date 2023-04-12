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
    
    @ComponentBuilder
    var content: Content
    
    var body: Component {
        ComponentGroup {
            AEHeader()
            
            self.content
            
            AEFooter()
        }
    }
}
