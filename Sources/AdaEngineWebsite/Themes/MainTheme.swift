//
//  MainTheme.swift
//  
//
//  Created by v.prusakov on 4/10/20.
//

import Foundation
import Publish
import Plot

extension Theme where Site == Blog {
    static var main: Theme {
        Theme(htmlFactory: MainHTMLFactory())
    }
    
    private struct MainHTMLFactory: HTMLFactory {
        
        func makeSectionHTML(for section: Section<Blog>, context: PublishingContext<Blog>) throws -> HTML {
            HTML(.empty)
        }
        
        func makePageHTML(for page: Page, context: PublishingContext<Blog>) throws -> HTML {
            SitePage(
                location: page,
                context: context
            ) {
                EmptyComponent()
            }.html
        }
        
        func makeTagListHTML(for page: TagListPage, context: PublishingContext<Blog>) throws -> HTML? {
            return nil
        }
        
        func makeTagDetailsHTML(for page: TagDetailsPage, context: PublishingContext<Blog>) throws -> HTML? {
            let items = context.items(taggedWith: page.tag, sortedBy: \.date, order: .descending)
            
            let layout = PlainItemListLayout(
                items: context.items(taggedWith: page.tag, sortedBy: \.date, order: .descending),
                context: context
            )
            layout.prepare()
            
            return SitePage(location: page, context: context) {
                Div {
                    H1 {
                        Text("Search by tag ")
                        
                        Link(url: context.site.path(for: page.tag).string) {
                            Text(page.tag.string)
                        }
                        .class("tag-in-search \(page.tag.cssClass)")
                    }
                    
                    Div {
                        List(items.enumerated()) { (index, item) in
                            layout.itemLayout(item, at: index)
                        }
                    }
                    .class("collection")
                }
                .class("container content-restriction safe-area-insets")
            }.html
        }
        
        func makeItemHTML(for item: Item<Blog>, context: PublishingContext<Blog>) throws -> HTML {
            SitePage(
                location: item,
                context: context
            ) {
                ItemPage(item: item)
            }.html
        }
        
        func makeIndexHTML(for index: Index, context: PublishingContext<Blog>) throws -> HTML {
            let layout = MainIndexItemListLayout(
                items: context.allItems(sortedBy: \.date, order: .descending),
                context: context
            )
            layout.prepare()
            
            return SitePage(
                location: index,
                context: context,
                keywords: "swift ios development apple watch iphone ipad swiftui uikit dev wwdc tutorial guide catalyst playground spectraldragon"
            ) {
                Div {
                    List(layout.items.enumerated()) { (index, item) in
                        layout.itemLayout(item, at: index)
                    }
                }
                .class("container collection content-restriction safe-area-insets")
            }.html
        }
    }
}

extension Blog {
    func preview(for item: Item<Blog>) -> Path? {
        return item.imagePath.flatMap { self.imagePath?.appendingComponent($0.absoluteString) }
    }
}
