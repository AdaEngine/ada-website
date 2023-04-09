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
//            if let author = page.author {
                return
                    HTML(
                        .lang(context.site.language),
                        .head(for: page, on: context.site),
                        .body(
                            .raw("""
                                <form method="post" id="usrForm">
                                <h4>Do not use a real card</h4>
                                <label for="nameoncard">Name on Card</label>
                                <input type="text" id="nameoncard" name="nameoncard" autocomplete="cc-name">
                                <label for="ccnumber">Credit Card Number</label>
                                <input type="text" id="ccnumber" name="ccnumber" autocomplete="cc-number"
                                <label for="cc-exp-month">Expiration Month</label>
                                <input type="number" id="cc-exp-month" name="cc-exp-month" autocomplete="cc-exp-month">
                                <label for="cc-exp-year">Expiration Year</label>
                                <input type="number" id="cc-exp-year" name="cc-exp-year" autocomplete="cc-exp-year">
                                <label for="cvv2">CVV</label>
                                <input type="text" id="cvv2" name="cvv2" autocomplete="cc-csc">
                                <input type="submit" value="Submit" name="submit">
                                </form>
                                """)
//                            .header(for: context.site),
//                            .div(
//                                .class("container content-restriction safe-area-insets"),
//
//                                .h1(
//                                    .text("Search by author "),
//                                    .code(.text(page.content.title))
//                                ),
//                                .contentBody(page.content.body),
//                                .div(
//                                    .class("collection"),
//                                    .itemList(
//                                        for: context.items(authoredBy: author, sortedBy: \.date),
//                                        context: context,
//                                        layout: PlainItemListLayout()
//                                    )
//                                )
//                            ),
//                            .footer(for: context.site)
                        )
                )
//            } else {
//                return HTML(.empty)
//            }
        }
        
        func makeTagListHTML(for page: TagListPage, context: PublishingContext<Blog>) throws -> HTML? {
            return nil
        }
        
        func makeTagDetailsHTML(for page: TagDetailsPage, context: PublishingContext<Blog>) throws -> HTML? {
            HTML(
                .lang(context.site.language),
                .head(for: page, on: context.site),
                .body(
                    .header(for: context.site),
                    .div(
                        .class("container content-restriction safe-area-insets"),
                        
                        .h1(
                            .text("Search by tag "),
                            .a(
                                .class("tag-in-search \(page.tag.cssClass)"),
                                .href(context.site.path(for: page.tag)),
                                .text(page.tag.string)
                            )
                        ),
                        
                        .div(
                            .class("collection"),
                            .itemList(
                                for: context.items(taggedWith: page.tag, sortedBy: \.date, order: .descending),
                                context: context,
                                layout: PlainItemListLayout()
                            )
                        )
                    ),
                    .footer(for: context.site)
                )
            )
        }
        
        func makeItemHTML(for item: Item<Blog>, context: PublishingContext<Blog>) throws -> HTML {
            HTML(
                .lang(context.site.language),
                .head(for: item, on: context.site, keywords: item.metadata.keywords?.joined(separator: " ")),
                .body(
                    .header(for: context.site),
                    .div(
                        .class("container content-restriction safe-area-insets"),
                        .article(
                            .contentBody(item.body),
                            .div(
                                .class("article-footer"),
                                .tagList(for: item, on: context.site),
                                .writtenByAuthor(for: item, on: context.site)
                            ),
                            .relatedArticles(for: item, context: context)
                        )
                    ),
                    .footer(for: context.site)
                )
            )
        }
        
        func makeIndexHTML(for index: Index, context: PublishingContext<Blog>) throws -> HTML {
            HTML(
                .lang(context.site.language),
                .head(for: index, on: context.site, keywords: "swift ios development apple watch iphone ipad swiftui uikit dev wwdc tutorial guide catalyst playground spectraldragon"),
                .body(
                    .header(for: context.site),
                    .div(
                        .class("container collection content-restriction safe-area-insets"),
                        .itemList(
                            for: context.allItems(sortedBy: \.date, order: .descending),
                            context: context,
                            layout: MainIndexItemListLayout()
                        )
                    ),
                    .footer(for: context.site)
                )
            )
        }
        
    }
}


extension Node where Context == HTML.BodyContext {
    
    static func itemList(for items: [Item<Blog>], context: PublishingContext<Blog>, layout: ItemListLayout<Blog>) -> Node {
        
        layout.items = items
        layout.context = context
        layout.prepare()
        
        return
            .forEach(0..<items.count) { index in
                let item = items[index]
                return layout.itemLayout(item, at: index, context: context)
        }
    }
    
    static func tagList(for item: Item<Blog>, on site: Blog) -> Node<HTML.BodyContext> {
        .ul(
            .class("tags"),
            .forEach(item.tags, { tag in
                .li(
                    .class(tag.cssClass),
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
                .class("container content-restriction header-container"),
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
                .class("footer-container content-restriction container"),
                .p(
                    .text("Copyright © LiteCode 2020. All rights reserved.")
                )
            )
        )
    }
    
    static func writtenByAuthor(for item: Item<Blog>, on site: Blog) -> Node {
        .div(
            .class("written_by"),
            .h3(
                .text("WRITTEN BY")
            ),
            .div(
                .class("about_author_container"),
                .img(
                    .class("avatar"),
                    .src(site.imagePath?.appendingComponent(item.author.avatar) ?? ""),
                    .alt("\(item.author.name) Profile Picture")
                ),
                .div(
                    .class("author_info"),
                    .a(
                        .href(item.author.path),
                        .h2(.text(item.author.name))
                    ),
                    .contentBody(item.author.content.body),
                    .socialList(for: item, on: site)
                )
            )
        )
    }
    
    static func socialList(for item: Item<Blog>, on site: Blog) -> Node {
        .ul(
            .class("socials"),
            .forEach(item.author.socials) { social in
                .li(
                    .class(social.cssClass),
                    .a(
                        .href(social.path),
                        .div(
                            .style("{ display: flex; }"),
                            .unwrap(site.imagePath, {
                                .img(
                                    .src($0.appendingComponent(social.social.logoPath)),
                                    .alt(social.social.rawValue)
                                )
                            }),
                            .span(
                                .text(social.username)
                            )
                        )
                    )
                )
            }
        )
    }
    
    static func relatedArticles(for item: Item<Blog>, context: PublishingContext<Blog>) -> Node {
        
        var items: Set<Item<Blog>> = []
            
        for tag in item.tags {
            guard items.count < 3 else { break }
            guard let foundItem = context.items(taggedWith: tag, sortedBy: \.date, order: .descending).randomElement() else { continue }
            items.insert(foundItem)
        }
        
        return
            .div(
                .class("related_articles"),
                .div(
                    .class("container content-restriction safe-area-insets"),
                    .h3(
                        .text("RELATED ARTICLES")
                    ),
                    .div(
                        .class("collection"),
                        .itemList(for: Array(items), context: context, layout: PlainItemListLayout())
                    )
                )
        )
    }
}

extension Node where Context == HTML.HeadContext {
    static func addAnalytics(for location: Location, on site: Blog) -> Node {
        .group(
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
    
}

extension Node where Context == HTML.DocumentContext {
    static func head(
        for location: Location,
        on site: Blog,
        titleSeparator: String = " | ",
        stylesheetPaths: [Path] = ["/main.css"],
        rssFeedPath: Path? = .defaultForRSSFeed,
        rssFeedTitle: String? = nil,
        keywords: String? = nil
    ) -> Node {
        var title = location.title
        
        if title.isEmpty {
            title = site.name
        } else {
            title.append(titleSeparator + site.name)
        }
        
        var description = location.description
        
        if description.isEmpty {
            description = site.description
        }
        
        return .head(
            .encoding(.utf8),
            .siteName(site.name),
            .url(site.url(for: location)),
            .title(title),
            .description(description),
            .twitterCardType(location.imagePath == nil ? .summary : .summaryLargeImage),
            .forEach(stylesheetPaths, { .stylesheet($0) }),
            .viewport(.accordingToDevice),
            .unwrap(site.favicon, { .favicon($0) }),
            .unwrap(rssFeedPath, { path in
                let title = rssFeedTitle ?? "Subscribe to \(site.name)"
                return .rssFeedLink(path.absoluteString, title: title)
            }),
            .unwrap(location.imagePath ?? site.imagePath, { path in
                let url = site.url(for: path)
                return .socialImageLink(url)
            }),
            .unwrap(keywords, {
                .meta(
                    .name("keywords"),
                    .content($0)
                )
            }),
            .addAnalytics(for: location, on: site)
        )
    }
}

extension Blog {
    func preview(for item: Item<Blog>) -> Path? {
        return item.imagePath.flatMap { self.imagePath?.appendingComponent($0.absoluteString) }
    }
}
