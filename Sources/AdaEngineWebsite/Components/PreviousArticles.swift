//
//  PreviousArticles.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Ignite

struct PreviousArticles: DocumentElement {
    
    let item: Article
    
    @Environment(\.articles)
    private var articles
    
    var body: some HTML {
        var items: [Article] = []

        for tag in item.tags ?? [] {
            guard items.count < 3 else { break }
            guard
                let foundArticle = articles.tagged(tag).sorted(by: \.date).randomElement(),
                foundArticle.path != item.path
            else {
                continue
            }
            
            items.append(foundArticle)
        }
        
        return Group {
            if !items.isEmpty {
                Div {
                    SafeAreaContainer {
                        Text("Related articles")
                            .font(.title3)
                        
                        Grid(alignment: .topLeading) {
                            ForEach(items) { item in
                                ArticlePreview(for: item)
                                    .articlePreviewStyle(BlogArticlePreview(isNewArticle: false))
                                    .width(1)
                            }
                        }
                        .columns(3)
                    }
                }
                .class("related_articles")
            } else {
                EmptyHTML()
            }
        }
        
    }
}
