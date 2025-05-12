//
//  BlogSectionPage.swift
//
//
//  Created by v.prusakov on 4/13/23.
//

import Ignite

struct BlogSectionPage: StaticPage {
    let title: String = "Blog"
    let path: String = SectionID.blog.rawValue

    @Environment(\.articles)
    private var articles

    var body: some HTML {
        SafeAreaContainer {
            Section(!articles.all.isEmpty ? "Blog" : "") {
                if articles.all.isEmpty {
                    Text("Is no articles here yet, come back later!")
                        .font(.primary(size: .em(2.5)))
                        .padding(.vertical, .em(3))
                } else {
                    Grid(alignment: .topLeading) {
                        ForEach(articles.all.enumerated()) { (index, item) in
                            ArticlePreview(for: item)
                                .articlePreviewStyle(BlogArticlePreview(isNewArticle: index == 0))
                                .width(index == 0 ? 3 : 1)
                        }
                    }
                    .columns(3)
                }
            }
        }
    }
}
