//
//  SectionPage.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Plot
import Publish

struct SectionPage: Component {
    
    let section: Section<Blog>
    
    @ComponentBuilder
    var body: Component {
        switch section.id {
        case .news:
            NewsSectionPage(section: self.section)
        default:
            EmptyComponent()
        }
    }
}
