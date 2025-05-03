//
//  PostPage.swift
//  
//
//  Created by v.prusakov on 4/12/23.
//

import Dependencies
import Ignite

// Contains post
struct DefaultArticlePage: ArticlePage {
    
    @Dependency(\.context)
    private var context
    
    var body: some HTML {
        Tag("article") {
            // Main article content
            article.text
            
            Div {
                TagList(item: article)
                
                WrittenByAuthor(author: context.author(for: article))
            }
            .class("article-footer")
            
            PreviousArticles(item: article)
        }
    }
}
