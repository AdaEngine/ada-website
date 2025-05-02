import Dependencies
import DependenciesMacros
import Foundation
import Ignite

@main
struct AdaEngineSite: Site {
    
    var name: String = "AdaEngine"
    var url: Ignite.URL = URL(static: "https://adaengine.org")
    var language: Language = .english
    
    var homePage = MainPage()
    
    var lightTheme = AdaEngineDarkTheme()
    var darkTheme = AdaEngineLightTheme()
    var layout = AdaEngineLayout()
    
    var staticPages: [any StaticPage] = [
        MainPage(),
        BlogSectionPage(),
        LearnSectionPage()
    ]
    
    var articlePages: [any ArticlePage] = [
        DefaultArticlePage()
    ]
    
    var articleRenderer: AdaEngineArticleRenderer.Type = AdaEngineArticleRenderer.self
}

extension AdaEngineSite {
    static func main() async {
        var site = Self()
        do {
            try await withDependencies { values in
                values[MarkdownModifierApplier.self] = MarkdownModifierApplier(
                    modifiers: [
                        ImageModifier(),
                        AdditionalBlockquoteModifier()
                    ]
                )
            } operation: {
                try await site.publish()
                let executor = PluginsExecutor(plugins: [
                    AuthorPlugin(),
                    CopyResourcePlugin(from: "Resources")
                ])
                try await executor.execute()
            }
        } catch {
            print(error.localizedDescription)
        }
    }
}

struct DefaultArticlePage: ArticlePage {

    var body: some HTML {
        Text(article.title)
            .font(.title1)
        Text(article.description)
    }
}

struct AdaEngineDarkTheme: Theme {
    var colorScheme: Ignite.ColorScheme = .dark
}

struct AdaEngineLightTheme: Theme {
    var colorScheme: Ignite.ColorScheme = .light
}

struct AdaEngineLayout: Layout {
    
    @Environment(\.page)
    private var page
    
    @DocumentBuilder
    var body: some HTML {
        Head {
            MetaLink(href: "/Styles/main.css", rel: .stylesheet)
        }
        Body {
            AEHeader(section: .blog)
            NavigationBar()
            
            content
                .class("container content-restriction safe-area-insets")
            
            AEFooter()
        }
    }
}

class AdaEngineWebsiteContext {
    let rootURL: URL
    let buildDirURL: URL
    let imagesURL: URL
    
    var dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "YYYY-MM-dd"
        formatter.locale = Locale(identifier: "en_EN")
        return formatter
    }()
    
    init(
        rootDirictory: StaticString = #filePath,
        buildDir: String = "Build",
        imagesDir: String = "Images"
    ) {
        self.rootURL = try! URL.selectDirectories(from: rootDirictory).source
        self.buildDirURL = self.rootURL.appending(path: buildDir)
        self.imagesURL = self.buildDirURL.appending(path: imagesDir)
    }
}

extension AdaEngineWebsiteContext {
    func preview(for path: String?) -> URL? {
        return path.map { self.imagesURL.appending(path: $0) }
    }
}


extension AdaEngineWebsiteContext: DependencyKey {
    static var liveValue: AdaEngineWebsiteContext {
        AdaEngineWebsiteContext()
    }
}

extension DependencyValues {
    var context: AdaEngineWebsiteContext {
        get { self[AdaEngineWebsiteContext.self] }
        set { self[AdaEngineWebsiteContext.self] = newValue }
    }
}
