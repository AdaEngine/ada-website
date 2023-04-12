//
//  PreviousArticles.swift
//  
//
//  Created by v.prusakov on 4/13/23.
//

import Plot
import Publish

struct PreviousArticles: Component {
    
    let item: Item<Blog>
    
    @EnvironmentValue(.publishContext)
    private var context
    
    var body: Component {
        var items: Set<Item<Blog>> = []

        for tag in item.tags {
            guard items.count < 3 else { break }
            guard let foundItem = context!.items(taggedWith: tag, sortedBy: \.date, order: .descending).randomElement(), foundItem.hashValue != item.hashValue else {
                continue
            }
            
            items.insert(foundItem)
        }
        
        return ComponentGroup {
            if !items.isEmpty {
                Div {
                    Div {
                        H3("RELATED ARTICLES")
                        
                        Div {
                            List(Array(items)) { item in
                                BlogArticleRow(item: item, context: self.context!, isNewArticle: false)
                            }
                        }
                        .class("collection")
                    }
                    .class("container content-restriction safe-area-insets")
                }
                .class("related_articles")
            } else {
                EmptyComponent()
            }
        }
        
    }
}
