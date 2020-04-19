//
//  File.swift
//  
//
//  Created by v.prusakov on 4/18/20.
//

import Foundation
import Publish
import Plot

extension Plugin where Site == Blog {
    static func articleInfoAfterFirstHeader() -> Self {
        Plugin(name: "Article Info After First Header", installer: { context in
            let nonModifiedContext = context
            context.mutateAllSections { section in
                guard section.id == .posts  else { return }
                section.mutateItems { item in
                    var html = item.content.body.html
                    guard let header = html.firstSubstring(between: "<h1>", and: "</h1>") else { return }
                    
                    let articleInfo = Node.articleInfo(item: item, context: nonModifiedContext).render()
                    html.insert(contentsOf: articleInfo, at: html.index(header.endIndex, offsetBy: "</h1>".count))
                    item.content.body.html = html
                }
            }
        })
    }
}

fileprivate extension Node where Context == HTML.BodyContext {
    static func articleInfo(item: Item<Blog>, context: PublishingContext<Blog>) -> Node {
        .div(
            .class("article_info"),
            .img(
                .class("avatar"),
                .src(context.site.imagePath?.appendingComponent(item.author.avatar) ?? ""),
                .alt("\(item.author.name) Profile Picture")
            ),
            .div(
                .class("author_info"),
                .a(
                    .href(item.author.path),
                    .h2(.text(item.author.name))
                ),
                .div(
                    .text(context.dateFormatter.string(from: item.date)),
                    .text(" • "),
                    .text(String(format: "%.0g min read", item.readingTime.minutes.rounded(.up)))
                )
            )
        )
    }
}
