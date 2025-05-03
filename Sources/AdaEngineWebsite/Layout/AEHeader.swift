//
//  AEHeader.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Ignite

// All sections on site
enum SectionID: String {
    case blog

    case community
    
    case learn
    
    case features
    
    case press
    
    case donate
}

struct AEHeader: DocumentElement {
    @Environment(\.site)
    private var site
    @Environment(\.page)
    private var page
    
    let sections: [SectionID] = [.blog, .learn, .community, .features]
    
    var body: some HTML {
        Tag("header") {
            Section {
                Link(target: "/") {
                    Text(site.name)
                        .font(.title2)
                    
                    if sections.contains(where: { $0.rawValue == page.title }) {
                        Text(page.title.capitalized)
                            .font(.title2)
                            .class("subtitle")
                    }
                }
                .class("header-logo")
                
                self.burger
                
                self.navigation
            }
            .class("container content-restriction header-container")
        }
        .class("header")
    }
    
    @HTMLBuilder
    private var navigation: some HTML {
        List(self.sections) { section in
            ListItem {
                Link(target: "/" + section.rawValue) {
                    Text(section.rawValue.capitalized)
                }
                .class("navigation-item-link")
            }
            .class("navigation-item")
        }
        .class("navigation")
    }
    
    private var burger: some HTML {
        Div {
            Div {
                Div {}
                    .class("bar topBar")
                
                Div {}
                    .class("bar bottomBar")
            }
            .id("burger")
        }
        .class("burger-container")
    }
}

typealias Div = Section
