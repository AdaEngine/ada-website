import Dependencies
import DependenciesMacros
import Foundation
import Ignite

// TODO:

// - [] Page 404 not generated
// - [] Author page not generated
// - [] Code styles not generated anymore
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
    var staticPages: [any StaticPage] = [
        MainPage(),
        BlogSectionPage(),
        LearnSectionPage(),
        CommunitySectionPage()
    ]
    
    let useDefaultBootstrapURLs: BootstrapOptions = .none
    
    var articlePages: [any ArticlePage] = [
        DefaultArticlePage()
    ]
    
    var articleRenderer: AdaEngineArticleRenderer.Type = AdaEngineArticleRenderer.self
    var syntaxHighlighterConfiguration: SyntaxHighlighterConfiguration = {
        SyntaxHighlighterConfiguration(languages: [.swift])
    }()
    
    func prepare() async throws {
        let executor = PluginsExecutor(plugins: [
            AuthorPlugin(),
            ImagePlugin()
        ])
        
        try await executor.execute()
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
                    CopyResourcePlugin(from: "Resources")
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
