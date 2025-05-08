//
//  BlogArticlePreviews.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Dependencies
import Foundation
import Ignite

struct BlogArticlePreview: @preconcurrency ArticlePreviewStyle {
    let isNewArticle: Bool

    @Dependency(\.context)
    private var context

    @MainActor
    func body(content: Ignite.Article) -> any Ignite.HTML {
        Div {
            Link(target: content) {
                Image(context.image(for: content.image) ?? "", description: content.title)
                    .resizable()
                    .aspectRatio(AspectRatio.r16x9)
                
                Div {
                    if self.isNewArticle {
                        self.newArticleTitle(content: content)
                    } else {
                        self.articleTitle(content: content)
                    }
                    
                    Div {
                        Text(self.context.dateFormatter.string(from: content.date))
                            .class("article-date")
                    }
                    .class("article-item-info")
                    
                    if !self.isNewArticle {
                        Text(content.description)
                            .class("article-item-description")
                    }

                }
                .class(self.isNewArticle ? "article-item-new-content" : "article-item-content")
            }
        }
        .class(self.isNewArticle ? "article-item-new" : "article-item")
     }
}

extension BlogArticlePreview {
    @MainActor
    @HTMLBuilder
    private func newArticleTitle(content: Ignite.Article) -> some HTML {
        Div {
            Text(content.title)
                .font(.title1)
            
            Span("NEW")
                .class("article-item-new-sign")
        }
        .class("article-item-new-header")
        
        Text(content.description)
            .font(.title3)
            .class("article-item-new-subtitle")
    }
    
    @MainActor
    private func articleTitle(content: Ignite.Article) -> some HTML {
        Text(content.title)
            .font(.title3)
    }
}

struct ArticleLittlePreview: @preconcurrency ArticlePreviewStyle {
    @Dependency(\.context)
    private var context
    
    @MainActor
    func body(content: Ignite.Article) -> any Ignite.HTML {
        Link(target: content) {
            Grid(alignment: .center) {
                Image(context.image(for: content.image) ?? "", description: content.title)
                    .resizable()
                    // .aspectRatio(AspectRatio.r16x9)
                    .width(1)
                
                Div {
                    Div {
                        Text(content.title)
                            .font(.title4)

                        Text(content.date.formatted(.dateTime.day().month().year()))
                            .class("article-date")
                    }
                    .class("article-item-info")
                    
                    Text(content.description)
                        .class("article-item-description")
                }
                .class("article-item-content")
                .width(2)
            }
            .columns(3)
        }
    }
}
