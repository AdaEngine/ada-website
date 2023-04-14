//
//  TagList.swift
//  
//
//  Created by v.prusakov on 4/12/23.
//

import Publish
import Plot

struct TagList: Component {
    
    let item: Item<Blog>
    
    @EnvironmentValue(.publishContext)
    private var context
    
    var body: Component {
        List(item.tags) { tag in
            ListItem {
                Link(url: context!.site.path(for: tag).absoluteString) {
                    Text(tag.string)
                }
            }
            .class(tag.cssClass)
        }
        .class("tags")
    }
}
