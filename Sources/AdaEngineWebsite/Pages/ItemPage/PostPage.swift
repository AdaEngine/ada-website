//
//  PostPage.swift
//  
//
//  Created by v.prusakov on 4/12/23.
//

import Ignite

// Contains post
struct PostPage: DocumentElement {
    
//    let item: Item<Blog>
    
    var body: some HTML {
        Tag("article") {
            Div {
                // Main article content
//                self.item.body
                
                Div {
                    TagList()
                    
//                    WrittenByAuthor(author: self.item.author)
                }
                .class("article-footer")
                
//                PreviousArticles(item: self.item)
            }
            .class("container content-restriction safe-area-insets")
        }
    }
}
