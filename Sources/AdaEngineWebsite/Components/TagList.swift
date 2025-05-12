//
//  TagList.swift
//  
//
//  Created by v.prusakov on 4/12/23.
//

import Ignite

struct TagList: DocumentElement {
    
    let item: Article
    
    @HTMLBuilder
    var body: some HTML {
        if let tags = item.tags, !tags.isEmpty {
            List(tags) { tag in
                ListItem {
                    Link(target: "/tags/\(tag.convertedToSlug())") {
                        tag
                    }
                }
                .class("tag-" + tag.convertedToSlug())
            }
            .class("tags")
        } else {
            EmptyHTML()
        }
    }
}
