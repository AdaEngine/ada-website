//
//  HomePageArticlePreview.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

import Dependencies
import Ignite

struct HomePageArticlePreview: @preconcurrency ArticlePreviewStyle {

    @Dependency(\.context)
    private var context

    @MainActor
    func body(content: Ignite.Article) -> any Ignite.HTML {
        Div {
            Tag("a") {
                ZStack(alignment: .bottomLeading) {
                    Image(context.image(for: content.image)!, description: content.title)
                        .resizable()
                        .class("background_image")
                        .overlay {
                            Div {}
                                .frame(width: .percent(100%), height: .percent(100%))
                                .class("background_image_overlay")
                        }

                    Div {
                        VStack(alignment: .leading, spacing: 5) {
                            Text(context.dateFormatter.string(from: content.date))
                                .font(.title6)

                            tags(content: content)

                            Text(content.title)
                                .font(.title3)

                            HStack(spacing: 8) {
                                Image(
                                    context.image(for: context.author(for: content).avatar)!,
                                    description: "Author avatar"
                                )
                                .resizable()
                                .frame(width: 24, height: 24)
                                .avatarModifier()

                                Text(content.author ?? "AdaEngine Team")
                                    .font(.primary(size: .em(0.95)))
                            }
                        }
                        .padding()
                    }
                }
            }
            .attribute("href", content.path)
            .cornerRadius(16)
        }
        .class("home-article-preview")
    }
}

extension HomePageArticlePreview {
    @MainActor
    @HTMLBuilder
    fileprivate func tags(content: Ignite.Article) -> some HTML {
        Div {
            HStack(spacing: 4) {
                ForEach(content.tags ?? []) { tag in
                    // Tag("a") {
                    Text(tag)
                        .class("article-tag")
                    // }
                    // .attribute("href", "/tags/\(tag.convertedToSlug())")
                }
            }
        }
    }
}
