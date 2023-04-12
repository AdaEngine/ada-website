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
    
    typealias Element = Item<Site>
    
    var items: [Element] = []
    var context: PublishingContext<Site>
    
    init(items: [Element], context: PublishingContext<Site>) {
        self.items = items
        self.context = context
    }
    
    func prepare() { }
    
    func itemLayout(_ item: Element, at index: Int) -> Node<HTML.BodyContext> {
        return .contentBody(item.content.body)
    }
}


class MainIndexItemListLayout: ItemListLayout<Blog> {
    
    private var layout: [Component] = []
    
    override func prepare() {
        self.layout.removeAll()
        
        let first = items.first
        
        for item in items {
            self.layout.append(
                BlogArticleRow(
                    item: item,
                    context: context,
                    isNewArticle: item.date == first?.date
                )
            )
        }
    }
    
    override func itemLayout(_ item: Item<Blog>, at index: Int) -> Node<HTML.BodyContext> {
        return .component(
            self.layout[index]
        )
    }
}


class PlainItemListLayout: ItemListLayout<Blog> {
    override func itemLayout(_ item: Item<Blog>, at index: Int) -> Node<HTML.BodyContext> {
        return .component(
            BlogArticleRow(item: item, context: self.context, isNewArticle: false)
        )
    }
}
