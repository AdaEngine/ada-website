//
//  File.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Plot
import Publish

struct AEHeader: Component {
    
    let section: Blog.SectionID?
    
    @EnvironmentValue(.publishContext)
    private var context
    
    let sections: [Blog.SectionID] = [.blog, .learn, .community, .features]
    
    var body: Component {
        Header {
            Link(url: "/") {
                H2(self.context!.site.name)
                
                if let section = self.section {
                    H2(section.rawValue.capitalized)
                        .class("subtitle")
                }
            }
            .class("header-logo")
            
            self.burger
            
            self.navigation
        }
        .class("header")
    }
    
    @ComponentBuilder
    private var navigation: Component {
        let sections = self.context!.sections.filter { self.sections.contains($0.id) }
        
        List(sections) { section in
            ListItem {
                Link(
                    url: section.path.absoluteString,
                    label: {
                        Text(section.title.capitalized)
                    }
                )
                .class("navigation-item-link")
            }
            .class("navigation-item")
        }
        .class("navigation")
    }
    
    private var burger: Component {
        Div {
            Div {
                Div()
                    .class("bar topBar")
                
                Div()
                    .class("bar bottomBar")
            }
            .id("burger")
        }
        .class("burger-container")
    }
}
