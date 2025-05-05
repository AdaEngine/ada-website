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
        CardView {
            Link(target: content) {
                Card(imageName: context.image(for: content.image)!) {
                    Div {
                        VStack {
                            Text(content.title)
                                .font(.title2)
                                .frame(maxWidth: .percent(100%))
                            
                            Spacer()
                            
                            tags(content: content)
                        }
                        .padding()
                    }
                }
                .contentPosition(.overlay)
                .frame(maxHeight: 300)
                .clipped()
            }
            .linkStyle(.automatic)
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
