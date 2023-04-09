//
//  CollectionLayout.swift
//  
//
//  Created by v.prusakov on 4/15/20.
//

import Foundation
import Publish
import Plot

class ItemListLayout<Site: Website> {
    
    var items: [Item<Site>] = []
    var context: PublishingContext<Site>?
    
    func prepare() { }
    
    func itemLayout(_ item: Item<Blog>, at index: Int, context: PublishingContext<Site>) -> Node<HTML.BodyContext> { .contentBody(item.content.body) }
}


class MainIndexItemListLayout: ItemListLayout<Blog> {
    
    private var layout: [Item<Blog>: Node<HTML.BodyContext>] = [:]
    
    override func prepare() {
        guard let context = self.context else { return }
        
        self.layout.removeAll()
        
        let first = context.allItems(sortedBy: \.date, order: .descending).first
        
        for item in items {
            self.layout[item] = .component(
                BlogArticle(
                    item: item,
                    context: context,
                    isNewArticle: item.date == first?.date
                )
            )
        }
    }
    
    override func itemLayout(_ item: Item<Blog>, at index: Int, context: PublishingContext<Blog>) -> Node<HTML.BodyContext> {
        return self.layout[item] ?? .component(BlogArticle(item: item, context: context, isNewArticle: false))
    }
}


class PlainItemListLayout: ItemListLayout<Blog> {
    override func itemLayout(_ item: Item<Blog>, at index: Int, context: PublishingContext<Blog>) -> Node<HTML.BodyContext> {
        return .component(BlogArticle(item: item, context: context, isNewArticle: false))
    }
}
