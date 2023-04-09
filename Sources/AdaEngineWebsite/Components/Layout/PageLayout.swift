//
//  File.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Plot
import Publish

struct PageLayout<Content: Component>: Component {
    
    let site: Blog
    
    @ComponentBuilder
    var content: Content
    
    @ComponentBuilder
    var body: Component {
        AEHeader(site: site)
        
        self.content
        
        AEFooter()
    }
}

struct AEHeader: Component {
    
    let site: Blog
    
    var body: Component {
        Header {
            Div {
                Link(url: "/") {
                    H2(site.name)
                    
                    H2("Blog")
                        .class("subtitle")
                }
                .class("header-logo")
            }
            .class("container content-restriction header-container")
        }
        .class("header")
    }
}

struct AEFooter: Component {
    var body: Component {
        Footer {
            Div {
                Paragraph("Copyright © AdaEngine 2023. All rights reserved.")
            }
            .class("footer-container content-restriction container")
        }
        .class("footer")
    }
}
