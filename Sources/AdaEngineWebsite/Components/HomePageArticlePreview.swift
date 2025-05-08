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
                VStack(alignment: .leading, spacing: 0) {
                    Image(context.image(for: content.image)!, description: content.title)
                        .resizable()
                        
                    Div {
                        VStack(alignment: .leading) {
                            Text(content.title)
                                .font(.title2)

                            Text(content.description)
                                .font(.body)

                            Text(context.dateFormatter.string(from: content.date))
                                .class("article-date")
                        }
                        .padding()
                    }
                    .frame(width: .percent(100%))
                }
            }
            .attribute("href", content.path)
            .cornerRadius(16)
        }
        .class("article-preview")
        .cornerRadius(16)
        .elevated()
    }
}
