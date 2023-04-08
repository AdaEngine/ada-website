import Foundation
import Publish
import Plot
import MinifyCSSPublishPlugin
import ReadingTimePublishPlugin
import SplashPublishPlugin
import PublishColorUtils
import TagColorCSSGeneratorPlugin
import CodeSyntaxCSSGeneratorPlugin
import TwitterPublishPlugin

// This type acts as the configuration for your website.
struct Blog: Website {
    enum SectionID: String, WebsiteSectionID {
        // Add the sections that you want your website to contain here:
        case posts
    }
    
    struct ItemMetadata: WebsiteItemMetadata {
        // Add any site-specific metadata that you want to use here.
        
        let keywords: [String]?
        let author: String
    }
    
    // Update these properties to configure your website:
    let url = URL(string: "https://litecode.dev")!
    let name = "LiteCode"
    let description = "A personal blog of LiteCode Team"
    let language: Language = .english
    let imagePath: Path? = "images"
}

extension Blog {
    enum AvailableTag: String, CaseIterable {
        case swiftui = "SwiftUI"
        case ui = "UI"
        
        var color: Color {
            switch self {
            case .swiftui: return .blue
            case .ui: return .red
            }
        }
    }
}

// This will generate your website using the built-in Foundation theme:
try Blog().publish(using: [
    .step(named: "Use custom Date Formatter", body: { context in
        let formatter = DateFormatter()
        formatter.dateFormat = "YYYY-MM-dd"
        formatter.locale = Locale(identifier: "en_EN")
        context.dateFormatter = formatter
    }),
    .installPlugin(.twitter()),
    .installPlugin(.splash(withClassPrefix: "s-")),
    .installPlugin(
        .generateCodeCSS(withClassPrefix: "pre code .s-",
                         theme: .dynamic(light: .xcode("Light.dvtcolortheme"),
                                         dark: .xcode("Dark.xccolortheme")))
    ),
    .installPlugin(.additionalBlockquote()),
    .installPlugin(.imagePlugin()),
    .addMarkdownFiles(),
    .step(named: "Use custom Date Formatter", body: { context in
        let formatter = DateFormatter()
        formatter.dateFormat = "dd MMM YYYY"
        formatter.locale = Locale(identifier: "en_EN")
        context.dateFormatter = formatter
    }),
    .installPlugin(.readingTime()),
    .installPlugin(.authorsPlugin()),
    .installPlugin(.checkTagsAvailability(Blog.AvailableTag.self)),
    .installPlugin(.articleInfoAfterFirstHeader()),
    .installPlugin(.tagColorCSSGenerator(tagsCSSPrefix: "tag-", builder: { Blog.AvailableTag(rawValue: $0.string)!.color })),
    .copyResources(),
    .generateHTML(withTheme: .main),
    .generateRSSFeed(including: [.posts]),
    .generateSiteMap(),
    .deploy(using: .gitHub("SpectralDragon/spectraldragon.github.io", useSSH: false))
])


