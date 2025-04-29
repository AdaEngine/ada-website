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
        LearnSectionPage()
    ]
    
    var articlePages: [any ArticlePage] = [
        DefaultArticlePage()
    ]
}

extension AdaEngineSite {
    static func main() async {
        var site = Self()
        do {
            try await site.publish()
            
            var executor = PluginsExecutor()
            let copyResources = CopyResourcePlugin(from: "Resources")
            executor.add(copyResources)
            
            try await executor.execute()
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
            
            Section {
                content
            }
            .class("container content-restriction safe-area-insets")
            
            AEFooter()
        }
    }
}
