//
//  BlogArticleRow.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Dependencies
import Foundation
import Ignite

// Base article
struct BlogArticleRow: DocumentElement {
    
    let item: Article
    let isNewArticle: Bool
    
    @Dependency(\.context)
    private var context
    
    var body: some HTML {
        Tag("article") {
            Link(target: self.item) {
                AEImage(path: self.item.image ?? "")
                
                Div {
                    if self.isNewArticle {
                        self.newArticleTitle
                    } else {
                        self.articleTitle
                    }
                    
                    Div {
                        Text(self.context.dateFormatter.string(from: self.item.date))
                            .class("article-date")
                    }
                    .class("article-item-info")
                    
                    if !self.isNewArticle {
                        Text(self.item.description)
                            .class("article-item-description")
                    }

                }
                .class(self.isNewArticle ? "article-item-new-content" : "article-item-content")
            }
        }
        .class(self.isNewArticle ? "article-item-new" : "article-item")
    }
    
    // MARK: - Private
    
    @HTMLBuilder
    private var newArticleTitle: some HTML {
        Div {
            Text(self.item.title)
                .font(.title1)
            
            Span("NEW")
                .class("article-item-new-sign")
        }
        .class("article-item-new-header")
        
        Text(self.item.description)
            .font(.title3)
            .class("article-item-new-subtitle")
    }
    
    private var articleTitle: some HTML {
        Text(self.item.title)
            .font(.title3)
    }
}
