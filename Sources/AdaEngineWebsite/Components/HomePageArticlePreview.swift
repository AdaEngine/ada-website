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
        Link(target: content) {
            ZStack(alignment: .topLeading) {
                Image(context.image(for: content.image)!, description: content.title)
                    .resizable()
                    .frame(maxWidth: .percent(100%), maxHeight: .percent(100%))

                 Div {
                    VStack(alignment: .leading) {
                        Text(content.title)
                            .font(.title2)
                            .frame(maxWidth: .percent(100%))

                        Spacer()

                        tags(content: content)
                    }
                    .padding()
                }
            }
            .frame(maxHeight: 350)
            .clipped()
            .elevated()
        }
        .cornerRadius(16)
    }

    @HTMLBuilder
    @MainActor
    private func tags(content: Ignite.Article) -> some HTML {
        if let tagLinks = content.tagLinks() {
            Section {
                ForEach(tagLinks) { link in
                    link
                }
            }
            .style(.marginTop, "-5px")
        } else {
            EmptyHTML()
        }
    }
}
