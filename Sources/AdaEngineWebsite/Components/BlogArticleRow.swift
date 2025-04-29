//
//  BlogArticleRow.swift
//  
//
//  Created by v.prusakov on 4/9/23.
//

import Plot
import Publish
import Foundation

// Base article
//struct BlogArticleRow: Component {
//    
//    let item: Item<Blog>
//    let context: PublishingContext<Blog>
//    let isNewArticle: Bool
//    
//    var body: Component {
//        Article {
//            Link(url: self.item.path.absoluteString) {
//                if let previewPath = context.site.preview(for: self.item) {
//                    Image(previewPath.absoluteString)
//                }
//                
//                Div {
//                    if self.isNewArticle {
//                        self.newArticleTitle
//                    } else {
//                        self.articleTitle
//                    }
//                    
//                    Div {
//                        Paragraph(self.context.dateFormatter.string(from: self.item.date))
//                            .class("article-date")
//                    }
//                    .class("article-item-info")
//                    
//                    if !self.isNewArticle {
//                        Paragraph(self.item.description)
//                            .class("article-item-description")
//                    }
//
//                }
//                .class(self.isNewArticle ? "article-item-new-content" : "article-item-content")
//                
//            }
//        }
//        .class(self.isNewArticle ? "article-item-new" : "article-item")
//    }
//    
//    // MARK: - Private
//    
//    @ComponentBuilder
//    private var newArticleTitle: Component {
//        Div {
//            H1(self.item.title)
//            
//            Span("NEW")
//                .class("article-item-new-sign")
//        }
//        .class("article-item-new-header")
//        
//        H3(self.item.description)
//            .class("article-item-new-subtitle")
//    }
//    
//    private var articleTitle: Component {
//        H3(self.item.title)
//    }
//}
