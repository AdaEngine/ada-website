import Dependencies
import DependenciesMacros
import Foundation
import Ignite

// TODO:

// - [] Author page not generated
// - [] Code styles not generated anymore
// - [x] Page 404 not generated
// - [x] articleInfoAfterFirstHeader not inserted
// - [x] Images as incorrect path. Have no idea how to store images.
// - [x] Returns elements from old site.


@main
struct AdaEngineSite: Site {
    let name: String = "AdaEngine"
    let url: Ignite.URL = URL(static: "https://adaengine.org")
    let language: Language = .english
    let lightTheme = AdaEngineDarkTheme()
    let darkTheme = AdaEngineDarkTheme()
    let layout = AdaEngineLayout()
    
    let homePage = MainPage()
    let errorPage = ErrorPage()
    var tagPage = TagPage()
    var staticPages: [any StaticPage] = [
        MainPage(),
        BlogSectionPage(),
        LearnSectionPage(),
        CommunitySectionPage(),
        DonatePage()
    ]
    
    var articlePages: [any ArticlePage] = [
        DefaultArticlePage()
    ]
    
    var articleRenderer: AdaEngineArticleRenderer.Type = AdaEngineArticleRenderer.self
    var syntaxHighlighterConfiguration: SyntaxHighlighterConfiguration = {
        SyntaxHighlighterConfiguration(languages: [.swift])
    }()
    
    mutating func prepare() async throws {
        @Dependency(\.context) var context
        
        let executor = PluginsExecutor(plugins: [
            AuthorPlugin(),
            ImagePlugin()
        ])
        
        try await executor.execute()
        
        self.staticPages.append(contentsOf: context.additionalStaticPages)
        self.articlePages.append(contentsOf: context.additionalArticles)
    }
}

extension AdaEngineSite {
    static func main() async {
        var site = Self()
        do {
            try await withDependencies { values in
                values[MarkdownModifierApplier.self] = MarkdownModifierApplier(
                    modifiers: [
                        AdditionalBlockquoteModifier()
                    ]
                )
            } operation: {
                try await site.publish()
                let executor = PluginsExecutor(plugins: [
                    CopyResourcePlugin(from: "Resources"),
                    TagGeneratorPlugin(
                        tagsCSSPrefix: "tag-",
                        resourcePath: Constants.stylesPath,
                        builder: { tag in
                            AvailableTag(rawValue: tag.name)?.color ?? Color.aliceBlue.withoutMultiTheme()
                        }
                    )
                ])
                try await executor.execute()
                
                @Dependency(\.context) var context
                try await context.htmlModifier.execute()
            }
        } catch {
            print(error.localizedDescription)
        }
    }
}

struct AdaEngineDarkTheme: Theme {
    var colorScheme: Ignite.ColorScheme = .dark
    var syntaxHighlighterTheme: HighlighterTheme = .xcodeDark
}

struct AdaEngineLightTheme: Theme {
    var colorScheme: Ignite.ColorScheme = .light
    
    var syntaxHighlighterTheme: HighlighterTheme = .xcodeDark
}

enum Constants {
    static let resourcePath: String = "Resources"
    static let stylesPath: String = "Resources/Styles"
}

enum AvailableTag: String, CaseIterable {
    case adaengine = "AdaEngine"
    case ui = "UI"
    case release = "Release"
    
    var color: MultiThemeColor {
        switch self {
        case .adaengine: return Color.blue.adaptiveToDarkTheme(.aliceBlue)
        case .ui: return Color.red.adaptiveToDarkTheme(.bootstrapRed)
        case .release: return Color.green.adaptiveToDarkTheme(.limeGreen)
        }
    }
}
