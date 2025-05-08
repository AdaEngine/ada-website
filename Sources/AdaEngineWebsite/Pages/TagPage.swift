//
//  TagPage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 03.05.2025.
//

import Ignite

struct TagPage: Ignite.TagPage {
    
    @Environment(\.page) private var page
    
    var body: some HTML {
        Div {
            Text {
                "Search by tag "
                
                Link(target: page.url.path()) {
                    tag.name
                }
                .class("tag-in-search", "tag-" + tag.name.convertedToSlug())
            }
            .font(.title1)
        }
        
        SafeAreaContainer {
            Grid(alignment: .topLeading) {
                ForEach(tag.articles) { article in
                    ArticlePreview(for: article)
                        .articlePreviewStyle(BlogArticlePreview(isNewArticle: false))
                        .width(1)
                }
            }
            .columns(3)
        }
    }
}
