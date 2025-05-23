//
//  AEHeader.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Ignite

// All sections on site
enum SectionID: String, CaseIterable {
    case blog

    case community
    
    case learn
    
    case press
    
    case donate
}

struct AEHeader: DocumentElement {
    @Environment(\.site)
    private var site
    @Environment(\.page)
    private var page
    
    let sections: [SectionID] = [.blog, .learn, .community]
    
    var body: some HTML {
        Tag("header") {
            Section {
                Link(target: "/") {
                    Text(site.name)
                        .font(.title2)
                    
                    if SectionID.allCases.contains(where: {
                        $0.rawValue.lowercased() == page.title.lowercased()
                    }) {
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
        List {
            ForEach(self.sections) { section in
                ListItem {
                    Link(target: "/" + section.rawValue) {
                        Span(section.rawValue.capitalized)
                    }
                    .class("navigation-item-link")
                }
                .class("navigation-item")
            }
            
            ListItem {
                DonateButton()
            }
            .class("navigation-item", "donate-button")
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
