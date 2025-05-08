//
//  MainPage.swift
//
//
//  Created by v.prusakov on 4/15/23.
//

import Dependencies
import Ignite

struct MainPage: StaticPage {

    @Environment(\.articles)
    private var articles

    let title = "Home"

    let items: [CommunitySocial] = [
        CommunitySocial(
            image: "authors/spectraldragon.jpg",
            title: "Data Driven",
            description:
                "AdaEngine build around custom Entity Component System. It's simple to use, fast, parallel and cache-friendly.",
            path: ""
        ),
        CommunitySocial(
            image: "authors/spectraldragon.jpg",
            title: "Extendable out of the box",
            description: "Manage your scene or render plugins to extend your game.",
            path: ""
        ),
        CommunitySocial(
            image: "authors/spectraldragon.jpg",
            title: "2D Renderer",
            description:
                "Supports real-time 2D rendering for your games and apps. Write your own shaders, materials and render pipelines or you Sprite Sheets and Sprite renderer instead.",
            path: ""
        ),
        CommunitySocial(
            image: "authors/spectraldragon.jpg",
            title: "2D Physics",
            description: "AdaEngine supports Box2D physics.",
            path: ""
        ),
        CommunitySocial(
            image: "authors/spectraldragon.jpg",
            title: "Render Graphs",
            description: "Construct your own render pipeline using powerful of render graphs.",
            path: ""
        ),
        CommunitySocial(
            image: "authors/spectraldragon.jpg",
            title: "Scenes",
            description: "Save and load game worlds into scenes, extend them and more.",
            path: ""
        ),
        CommunitySocial(
            image: "authors/spectraldragon.jpg",
            title: "Free and Open Source",
            description: "AdaEngine is 100% free for you. Licensed by MIT. Learn, modify or use.",
            path: ""
        ),
    ]

    @HTMLBuilder
    var body: some HTML {
        VStack(alignment: .leading, spacing: 40) {
            header()
            latestNews()
            features()
        }
    }
}

extension MainPage {
    fileprivate func header() -> some HTML {
        Grid {
            VStack(alignment: .leading, spacing: 20) {
                Text("A simple and scalable Game Engine built in Swift.")
                    .font(.primary(size: .px(40)))

                Text(
                    "AdaEngine built by Developers, for Developers. Feel the new experience of Swift\ncoding with powerful 2D and 3D capabilities."
                )

                Text("AdaEngine Free and Open Source Forever.")
                    .fontWeight(.bold)
            }
            .width(2)

            Spacer()
                .width(1)

            AEImage(path: "ae_logo.svg", description: "AdaEngine Logo")
                .frame(height: 200)
                .width(1)
        }
        .columns(4)
        .background(Material.thinMaterial)
    }

    @HTMLBuilder
    fileprivate func latestNews() -> some HTML {
        let articles = self.articles.all

        if articles.isEmpty {
            EmptyHTML()
        } else {
            Section("Latest News") {
                Grid(alignment: .topLeading, spacing: 10) {

                    ArticlePreview(for: articles.first!)
                        .articlePreviewStyle(BlogArticlePreview(isNewArticle: true))
                        .width(2)

                    VStack(alignment: .leading, spacing: 20) {
                        ForEach(articles.dropFirst().prefix(3)) { (item) in
                            ArticlePreview(for: item)
                                .articlePreviewStyle(ArticleLittlePreview())
                                .elevated()
                        }
                    }
                    .width(2)
                }
                .columns(4)
                .padding(.top, 20)
            }
        }
    }

    fileprivate func features() -> some HTML {
        Section("Features") {
            Div {
                ForEach(items) { item in
                    CommunitySocialRow(item: item)
                }
            }
            .class("collection-grid grid-two-columns feature-list")
            .padding(.top, 20)
        }
    }
}
