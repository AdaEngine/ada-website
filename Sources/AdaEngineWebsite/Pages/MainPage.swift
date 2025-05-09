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

    let items: [EngineInfoItem] = [
        EngineInfoItem(
            title: "Data Driven",
            description:
                """
                AdaEngine build around custom Entity Component System.

                * **Simple to use** - easy to understand and use
                * **Fast** - optimized for performance
                * **Cache-friendly** - optimized for memory usage
                """,
            content: .html {
                CodeBlock(
                    .swift,
                    {
                        """
                        @Component
                        struct Player: Entity { }

                        struct PlayerSystem: System {
                            func update(context: UpdateSceneContext) { }
                        }
                        """
                    }
                )
            }
        ),
        EngineInfoItem(
            title: "2D Renderer",
            description:
                """
                Supports real-time 2D rendering for your games and apps.

                * **Extendable** - Write your own shaders, materials and render pipelines
                * **Sprite Sheets** - Built-in support for Sprite Sheets and Sprite renderer.
                """,
            content: .image("icons/ic_duck.png")
        ),
        EngineInfoItem(
            title: "2D Physics",
            description: """
                AdaEngine supports Box2D v3 physics.

                * **Parallel calculations** - optimized for multi-core processors
                * **Lightweight** - optimized for memory usage
                * **Fast** - optimized for performance
                """,
            content: .image("icons/ic_box2d.svg")
        ),
        // EngineInfoItem(
        //     title: "Extendable out of the box",
        //     description: "Manage your scene or render plugins to extend your game.",
        //     content: .image("authors/spectraldragon.jpg")
        // ),
        EngineInfoItem(
            title: "Render Graphs",
            description: "Construct your own render pipeline using powerful of render graphs.",
            content: .image("authors/spectraldragon.jpg")
        ),
        EngineInfoItem(
            title: "Custom UI Engine",
            description: "Create your own UI using similar to SwiftUI approach.",
            content: .html {
                CodeBlock(
                    .swift,
                    {
                        """
                        struct MainView: View {
                            @Environment(\\.scene) var scene

                            var body: some View {
                                Text("Hello, World!")
                                .onEvent(CollisionEvent.Began.self) { _ in
                                    scene.add(entity: Player())
                                }
                            }
                        }
                        """
                    }
                )
            }
        ),
        EngineInfoItem(
            title: "Audio",
            description: "Play music and sound effects with ease.",
            content: .image("authors/spectraldragon.jpg")
        ),
        EngineInfoItem(
            title: "Free and Open Source",
            description: """
                AdaEngine is 100% free for you. Licensed by MIT. Learn, modify or use.

                * **No up-front cost**
                * **No licensing cost**
                * **No royalties**
                * **No runtime fee**
                """,
            content: .image("authors/spectraldragon.jpg")
        ),
    ]

    @HTMLBuilder
    var body: some HTML {
        VStack(alignment: .leading, spacing: 40) {
            header()
            latestNews()
            features()
        }

        Script(file: "/js/fade_appear_effect.js")
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
            VStack(alignment: .center, spacing: 50) {
                ForEach(items.enumerated()) { index, item in
                    EngineInfoRow(
                        item: item,
                        leftSide: index % 2 == 0
                    )
                }
            }
            .padding(.top, 20)
        }
    }
}

struct EngineInfoItem {
    enum EngineInfoRowContent {
        case image(String)
        case _html(AnyHTML)

        @MainActor
        static func html<Content: HTML>(
            @HTMLBuilder _ html: () -> Content
        ) -> EngineInfoRowContent {
            ._html(AnyHTML(html()))
        }
    }

    let title: String
    let description: String
    let content: EngineInfoRowContent
}

struct EngineInfoRow: DocumentElement {

    @Dependency(\.context)
    private var context

    let item: EngineInfoItem
    let leftSide: Bool

    @HTMLBuilder
    var body: some HTML {
        Grid(alignment: .center, spacing: 20) {
            if !leftSide {
                infoContent
                    .width(2)
            }

            VStack(alignment: .leading, spacing: 10) {
                Text(item.title)
                    .font(.title1)

                Text(markdown: item.description)
                    .font(.body)
            }
            .width(2)

            if leftSide {
                infoContent
                    .width(2)
            }
        }
        .columns(4)
        .class("engine-info-item-container")
    }

    private var infoContent: some HTML {
        Div {
            switch item.content {
            case .image(let image):
                Image(context.image(for: image) ?? "", description: item.title)
                    .resizable()

            case ._html(let html):
                html
            }
        }
        .class("engine-info-item-content")
    }
}
