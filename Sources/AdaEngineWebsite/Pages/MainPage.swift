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

    @Dependency(\.context)
    private var context

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
        EngineInfoItem(
            title: "Render Graphs",
            description: "Construct your own render pipeline using powerful of render graphs.",
            content: .image("icons/ic_render_graph.svg")
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
            title: "LDtk Integration",
            description: "Import your LDtk projects and use them in your game.",
            content: .image("icons/ic_ldtk.png")
        ),
        EngineInfoItem(
            title: "Audio",
            description: """
                Play music and sound effects with ease.

                * **Spatial sound** - add 3D sound to your game
                * **Load audio files as Assets**
                * **Play audio Assets using Audio entities**
                """,
            content: .image("icons/ic_headphones.svg")
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
            content: .image("icons/ic_opensource.svg")
        ),
    ]

    @HTMLBuilder
    var body: some HTML {
        VStack(alignment: .center, spacing: 100) {
            header()
            carousel()
            latestNews()
            features()
        }

        Script(file: "/js/fade_appear_effect.js")
        Script(file: "/js/github_stars.js")
    }
}

extension MainPage {
    fileprivate func header() -> some HTML {
        Grid {
            VStack(alignment: .leading, spacing: 20) {
                Text("A simple and scalable Game Engine built in Swift.")
                    .font(.primary(size: .rem(3.5)))

                Text(
                    "AdaEngine built by Developers, for Developers. Feel the new experience of Swift\ncoding with powerful 2D and 3D capabilities."
                )
                .font(.system(size: .em(1.2)))

                Text("AdaEngine Free and Open Source Forever.")
                    .font(.system(size: .em(1.2), weight: .bold))

                HStack(spacing: 30) {
                        Link(target: .learn) {
                            Text("Get Started")
                                .font(.primary(size: .em(1.4)))
                        }
                    .class("header-buttons")

                    Link(target: .github) {
                        Image(systemName: "github")
                            .frame(height: 20)
                            .padding(.trailing, 10)

                        Span("... stars on GitHub")
                            .id("main-page-callout-stars-count")
                    }
                    .font(.primary(size: .em(1.2)))
                }
                .padding(.top, 20)
            }
            .width(4)

            Spacer()
                .width(1)

            AEImage(path: "ae_logo.svg", description: "AdaEngine Logo")
                .frame(height: 200)
                .width(1)
        }
        .columns(6)
        .frame(height: .percent(100%))
    }

    fileprivate func carousel() -> some HTML {
        Div {
            Carousel([
                "main/tilemap.png",
                "main/space_invaders.jpeg",
                "main/duck_hunt.png",
            ]) { item in
                Slide(background: context.image(for: item) ?? "")
            }
            .carouselStyle(.crossfade)
        }
        .class("carousel-container")
    }

    @HTMLBuilder
    fileprivate func latestNews() -> some HTML {
        let articles = self.articles.all

        if articles.isEmpty {
            EmptyHTML()
        } else {
            Text("Latest News")
                .font(.primary(size: .rem(3)))

            Div {
                Grid(alignment: .topLeading, spacing: 10) {
                    ForEach(articles.prefix(4)) { (item) in
                        ArticlePreview(for: item)
                            .articlePreviewStyle(HomePageArticlePreview())
                            .width(articles.count > 1 ? 2 : 4)
                    }
                }
                .columns(4)
                .padding(.top, 20)
            }
        }
    }

    @HTMLBuilder
    fileprivate func features() -> some HTML {
        Text("Features")
            .font(.primary(size: .rem(3)))

        Div {
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
        .class("features-container")
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
                    .font(.title2)

                Text(markdown: item.description)
                    .font(.system(size: .em(1.2)))
            }
            .width(2)
            .padding(.leading, !leftSide ? 50 : 0)

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
