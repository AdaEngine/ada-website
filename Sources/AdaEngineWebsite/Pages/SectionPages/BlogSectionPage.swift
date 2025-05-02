//
//  BlogSectionPage.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Ignite

struct BlogSectionPage: StaticPage {
    let title: String = "Blog"
    let path: String = SectionID.blog.rawValue
    
    @Environment(\.articles)
    private var articles
    
    var body: some HTML {
        Div {
            ForEach(articles.all.enumerated()) { (index, item) in
                BlogArticleRow(
                    item: item,
                    isNewArticle: index == 0
                )
            }
        }
        .class("container collection-grid grid-three-columns content-restriction safe-area-insets")
    }
}
