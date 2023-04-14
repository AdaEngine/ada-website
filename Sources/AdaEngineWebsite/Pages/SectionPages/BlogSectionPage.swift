//
//  BlogSectionPage.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Plot
import Publish

struct BlogSectionPage: Component {
    
    let section: Section<Blog>
    
    @EnvironmentValue(.publishContext)
    private var context
    
    var body: Component {
        Div {
            for (index, item) in section.items.enumerated() {
                BlogArticleRow(
                    item: item,
                    context: context!,
                    isNewArticle: index == 0
                )
            }
        }
        .class("container collection content-restriction safe-area-insets")
    }
}
