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
            return SitePage(
                location: section,
                section: section.id,
                context: context
            ) {
                SectionPage(section: section)
            }.html
        }
        
        func makePageHTML(for page: Page, context: PublishingContext<Blog>) throws -> HTML {
            SitePage(
                location: page,
                context: context
            ) {
                page.content.body
            }.html
        }
        
        func makeTagListHTML(for page: TagListPage, context: PublishingContext<Blog>) throws -> HTML? {
            return nil
        }
        
        func makeTagDetailsHTML(for page: TagDetailsPage, context: PublishingContext<Blog>) throws -> HTML? {
            let items = context.items(taggedWith: page.tag, sortedBy: \.date, order: .descending)
            
            return SitePage(
                location: page,
                context: context
            ) {
                Div {
                    H1 {
                        Text("Search by tag ")
                        
                        Link(url: context.site.path(for: page.tag).absoluteString) {
                            Text(page.tag.string)
                        }
                        .class("tag-in-search \(page.tag.cssClass)")
                    }
                    
                    Div {
                        for item in items {
                            BlogArticleRow(
                                item: item,
                                context: context,
                                isNewArticle: false
                            )
                        }
                    }
                    .class("collection-grid")
                }
                .class("container content-restriction safe-area-insets")
            }.html
        }
        
        func makeItemHTML(for item: Item<Blog>, context: PublishingContext<Blog>) throws -> HTML {
            SitePage(
                location: item,
                section: item.sectionID,
                context: context
            ) {
                ItemPage(item: item)
            }.html
        }
        
        func makeIndexHTML(for index: Index, context: PublishingContext<Blog>) throws -> HTML {
            return SitePage(
                location: index,
                context: context,
                keywords: "swift adaengine ada-engine development apple watch iphone ipad metal vulkan tutorial guide playground spectraldragon ada engine godot unity unreal webgl opengl glsl"
            ) {
                MainPage()
            }.html
        }
    }
}

extension Blog {
    func preview(for item: Item<Blog>) -> Path? {
        return item.imagePath.flatMap { self.imagePath?.appendingComponent($0.absoluteString) }
    }
}
