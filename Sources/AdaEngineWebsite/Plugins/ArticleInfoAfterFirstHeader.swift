//
//  ArticleInfoAfterFirstHeader.swift
//  
//
//  Created by v.prusakov on 4/18/20.
//

import Foundation
import Publish
import Plot

//extension Plugin where Site == Blog {
//    static func articleInfoAfterFirstHeader() -> Self {
//        Plugin(name: "Article Info After First Header", installer: { context in
//            let nonModifiedContext = context
//            
//            context.mutateAllSections { section in
//                guard section.id == .blog else {
//                    return
//                }
//                section.mutateItems { item in
//                    var html = item.content.body.html
//                    guard let header = html.firstSubstring(between: "<h1>", and: "</h1>") else { return }
//                    
//                    let articleInfo = Node.articleInfo(item: item, context: nonModifiedContext).render()
//                    html.insert(contentsOf: articleInfo, at: html.index(header.endIndex, offsetBy: "</h1>".count))
//                    item.content.body.html = html
//                }
//            }
//        })
//    }
//}
//
//fileprivate extension Node where Context == HTML.BodyContext {
//    static func articleInfo(item: Item<Blog>, context: PublishingContext<Blog>) -> Node {
//        .component(
//            Div {
//                Image(
//                    url: context.site.imagePath!.appendingComponent(item.author.avatar).absoluteString,
//                    description: "\(item.author.name) Profile Picture"
//                )
//                .class("avatar")
//                
//                Div {
//                    Link(url: item.author.path.absoluteString) {
//                        H2(item.author.name)
//                    }
//                    
//                    Div {
//                        Text(context.dateFormatter.string(from: item.date))
//                        Text(" • ")
//                        Text(String(format: "%d min read", item.readingTime.minutes))
//                    }
//                }
//                .class("author_info")
//            }
//            .class("article_info")
//        )
//    }
//}
