//
//  ArticleInfoAfterFirstHeader.swift
//  
//
//  Created by v.prusakov on 4/18/20.
//

import Dependencies
import Foundation
import Ignite

struct ArticleHTMLModifier: HTMLModifier {
    
    @Dependency(\.context)
    private var context
    
    func modify(_ content: inout ArticleModifier) throws {
        guard let substring = content.rawHTML.firstRange(of: "</h1>") else {
            return
        }
        
        
        let article = content.article
        content.insert(at: substring.upperBound) {
            htmlContent(for: article, author: context.author(for: article))
        }
    }
    
    @HTMLBuilder
    @MainActor
    private func htmlContent(for item: Article, author: AuthorEntity) -> some HTML {
        Div {
            AEImage(
                path: author.avatar,
                description: "\(author.name) Profile Picture"
            )
            .class("avatar")
            
            Div {
                Link(target: author.path) {
                    Text(author.name)
                        .font(.title2)
                }
                
                Div {
                    Text(context.dateFormatter.string(from: item.date))
                    Text(" • ")
                    Text(String(format: "%d min read", item.estimatedReadingMinutes))
                }
            }
            .class("author_info")
        }
        .class("article_info")
    }
}
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
//
//        )
//    }
//}
