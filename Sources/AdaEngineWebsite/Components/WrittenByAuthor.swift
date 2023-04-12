//
//  WrittenByAuthor.swift
//  
//
//  Created by v.prusakov on 4/12/23.
//

import Plot
import Publish

struct WrittenByAuthor: Component {
    
    let author: AuthorItem
    
    @EnvironmentValue(.publishContext)
    private var context
    
    var body: Component {
        Div {
            H3("WRITTEN BY")
            
            Div {
                Image(
                    url: self.context!.site.imagePath!.appendingComponent(self.author.avatar),
                    description: "\(self.author.name) Profile Picture"
                )
                .class("avatar")
                
                Div {
                    Link(url: self.author.path) {
                        H2(self.author.name)
                    }
                    
                    self.author.content.body
                    
                    SocialList(socials: self.author.socials)
                }
                .class("author_info")
            }
            .class("about_author_container")
        }
        .class("written_by")
    }
}

// TODO: Move to Utils
extension Path: URLRepresentable { }

//
//static func relatedArticles(for item: Item<Blog>, context: PublishingContext<Blog>) -> Node {
//
//    var items: Set<Item<Blog>> = []
//
//    for tag in item.tags {
//        guard items.count < 3 else { break }
//        guard let foundItem = context.items(taggedWith: tag, sortedBy: \.date, order: .descending).randomElement() else { continue }
//        items.insert(foundItem)
//    }
//
//    let array = Array(items)
//    let layout = PlainItemListLayout(items: array, context: context)
//    layout.prepare()
//
//    return
//        .div(
//            .class("related_articles"),
//            .div(
//                .class("container content-restriction safe-area-insets"),
//                .h3(
//                    .text("RELATED ARTICLES")
//                ),
//                .div(
//                    .class("collection"),
//                    .itemList(for: array, layout: layout)
//                )
//            )
//    )
//}
