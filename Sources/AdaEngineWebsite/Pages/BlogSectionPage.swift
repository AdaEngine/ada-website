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
            Section("Blog") {
                Grid(alignment: .leading) {
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