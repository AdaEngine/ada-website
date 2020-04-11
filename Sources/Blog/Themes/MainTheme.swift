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
            HTML(.empty)
        }
        
        func makeTagListHTML(for page: TagListPage, context: PublishingContext<Blog>) throws -> HTML? {
            return nil
        }
        
        func makeTagDetailsHTML(for page: TagDetailsPage, context: PublishingContext<Blog>) throws -> HTML? {
            return nil
        }
        
        func makeItemHTML(for item: Item<Blog>, context: PublishingContext<Blog>) throws -> HTML {
            HTML(
                .lang(context.site.language),
                .head(for: item, site: context.site),
                .body(
                    .header(for: context.site),
                    .div(
                        .p("Wait")
                    ),
                    .footer(for: context.site)
                )
            )
        }
        
        func makeIndexHTML(for index: Index, context: PublishingContext<Blog>) throws -> HTML {
            HTML(
                .lang(context.site.language),
                .group([
                    .head(
                        .meta(
                            .name("keywords"),
                            .content("swift ios development apple watch iphone ipad swiftui uikit dev wwdc tutorial guide catalyst playground spectraldragon")
                        )
                    ),
                    .head(for: index, site: context.site)
                ]),
                
                .body(
                    .header(for: context.site),
                    .div(
                        .class("container collection content-restriction safe-area-insets"),
                        .itemList(
                            for: context.allItems(sortedBy: \.date, order: .descending),
                            context: context
                        )
                    ),
                    .footer(for: context.site)
                )
            )
        }
        
    }
}


private extension Node where Context == HTML.BodyContext {
    static func itemList(for items: [Item<Blog>], context: PublishingContext<Blog>) -> Node {
        
        let first = context.allItems(sortedBy: \.date).first
        
        return
            .forEach(items) { item in
                .if(item.date == first?.date, .newArticleBody(for: item, context: context),
                    else: .articleBody(for: item, context: context))
        }
    }
    
    static func newArticleBody(for item: Item<Blog>, context: PublishingContext<Blog>) -> Node {
        .article(
            .class("article-item-new"),
            .a(
                .href(item.path),
                .if(item.imagePath != nil, .img(.src(context.site.preview(for: item) ?? ""))),
                .div(
                    .class("article-item-new-content"),
                    .div(
                        .class("article-item-new-header"),
                        .h1(
                            .text(item.title)
                        ),
                        .span(
                            .class("article-item-new-sign"),
                            .text("NEW")
                        )
                    ),
                    .h3(
                        .class("article-item-new-subtitle"),
                        .text(item.description)
                    ),
                    .div(
                        .class("article-item-info"),
                        .tagList(for: item, on: context.site),
                        
                        .p(
                            .class("article-date"),
                            .text(context.dateFormatter.string(from: item.date))
                        )
                    )
                )
            )
        )
    }
    
    static func articleBody(for item: Item<Blog>, context: PublishingContext<Blog>) -> Node {
        .article(
            .class("article-item"),
            .a(
                .href(item.path),
                .if(item.imagePath != nil, .img(.src(context.site.preview(for: item) ?? ""))),
                .div(
                    .class("article-item-content"),
                    .h3(
                        .text(item.title)
                    ),
                    .div(
                        .class("article-item-info"),
                        .tagList(for: item, on: context.site),
                        
                        .p(
                            .class("article-date"),
                            .text(context.dateFormatter.string(from: item.date))
                        )
                    ),
                    .p(
                        .class("article-item-description"),
                        .text(item.description)
                    )
                )
            )
        )
    }
    
    static func tagList(for item: Item<Blog>, on site: Blog) -> Node {
        .ul(
            .class("tags"),
            .forEach(item.tags, { tag in
                .li(
                    .class(""),
                    .a(
                        .href(site.path(for: tag)),
                        .text(tag.string)
                    )
                )
            })
        )
    }
    
    static func header(for site: Blog) -> Node {
        .header(
            .class("header"),
            .div(
                .class("container content-restriction"),
                .a(
                    .class("header-logo"),
                    .href("/"),
                    .h2(.text(site.name)),
                    .h2(
                        .class("subtitle"),
                        .text("Blog")
                    )
                )
            )
        )
    }
    
    static func footer(for site: Blog) -> Node {
        .footer(
            .class("footer"),
            .div(
                .class("footer-container content-restriction"),
                .hr(),
                .div(
                    .class("about_me"),
                    .img(
                        .class("avatar"),
                        .src(site.imagePath?.appendingComponent("vprusakov.jpg") ?? ""),
                        .alt("Vladislav Prusakov Profile Picture")
                    ),
                    .p(
                        .text("made by Vladislav Prusakov")
                    )
                )
            )
        )
    }
}

extension Node where Context == HTML.DocumentContext {
    static func addAnalytics(for location: Location, on site: Blog) -> Node {
        .head(
            .script(
                .async(),
                .src("https://www.googletagmanager.com/gtag/js?id=UA-73980658-4")
            ),
            .script(
                .text(
                    """
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'UA-73980658-4');
                    """
                )
            )
        )
    }
    
    static func head(for location: Location, site: Blog) -> Node {
        .group([
            .head(for: location, on: site, titleSeparator: " | ", stylesheetPaths: ["/main.css"], rssFeedPath: .defaultForRSSFeed, rssFeedTitle: nil),
            .addAnalytics(for: location, on: site),
        ])
    }
}

extension Blog {
    func preview(for item: Item<Blog>) -> Path? {
        return item.imagePath.flatMap { self.imagePath?.appendingComponent($0.absoluteString) }
    }
}

