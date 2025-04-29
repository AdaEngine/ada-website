import Foundation
@preconcurrency import Publish
import Plot
import MinifyCSSPublishPlugin
import ReadingTimePublishPlugin
import SplashPublishPlugin
import PublishColorUtils
import TagColorCSSGeneratorPlugin
import CodeSyntaxCSSGeneratorPlugin
import TwitterPublishPlugin

//// This type acts as the configuration for your website.
//struct Blog: Website {
//    // TODO: Think about it later
//    // Add any site-specific metadata that you want to use here.
//    struct ItemMetadata: WebsiteItemMetadata {
//        let keywords: [String]?
//        let author: String
//    }
//    
//    // Update these properties to configure your website:
//    let url = URL(string: "https://adaengine.org")!
//    let name = "AdaEngine"
//    let description = "A simple and fast game engine written on Swift"
//    let language: Language = .english
//    let imagePath: Path? = "Images"
//}
//
//extension Blog {
//    // All tags available on site
//    enum AvailableTag: String, CaseIterable {
//        case adaengine = "AdaEngine"
//        case ui = "UI"
//        case release = "Release"
//        
//        var color: Color {
//            switch self {
//            case .adaengine: return .blue
//            case .ui: return .red
//            case .release: return .green
//            }
//        }
//    }
//    
//    // All sections on site
//    enum SectionID: String, WebsiteSectionID {
//        case blog
//
//        case community
//        
//        case learn
//        
//        case features
//        
//        case press
//        
//        case donate
//    }
//}
//
//
//enum Constants {
//    static let resourcePath: Path = "Resources"
//    static let stylesPath: Path = "Resources/Styles"
//}
//
//func build() throws {
//    // This will generate your website using the built-in Foundation theme:
//    try Blog().publish(using: [
//        // To parse date from markdown files
//        .step(named: "Set Formatter for markdowns", body: { context in
//            let formatter = DateFormatter()
//            formatter.dateFormat = "YYYY-MM-dd"
//            formatter.locale = Locale(identifier: "en_EN")
//            context.dateFormatter = formatter
//        }),
//        .installPlugin(.twitter()),
//        .installPlugin(.splash(withClassPrefix: "s-")),
//        .installPlugin(
//            .generateCodeCSS(
//                withClassPrefix: "pre code .s-",
//                resourcePath: Constants.stylesPath,
//                theme: .dynamic(
//                    light: .xcode("Light.dvtcolortheme"),
//                    dark: .xcode("Dark.xccolortheme")
//                )
//            )
//        ),
//        .installPlugin(.additionalBlockquote()),
//        .installPlugin(.imagePlugin()),
//        .addMarkdownFiles(),
//        // To parse date from files to html format
//        .step(named: "Set Formatter for HTML", body: { context in
//            let formatter = DateFormatter()
//            formatter.dateFormat = "dd MMM YYYY"
//            formatter.locale = Locale(identifier: "en_EN")
//            context.dateFormatter = formatter
//        }),
//        .installPlugin(.readingTime()),
//        .installPlugin(.authorsPlugin(styleOutputFolder: Constants.stylesPath)),
//        .installPlugin(.checkTagsAvailability(Blog.AvailableTag.self)),
//        .installPlugin(.articleInfoAfterFirstHeader()),
//        .installPlugin(
//            .tagColorCSSGenerator(
//                tagsCSSPrefix: "tag-",
//                resourcePath: Constants.stylesPath,
//                builder: {
//                    Blog.AvailableTag(rawValue: $0.string)!.color
//                })
//        ),
//        .installPlugin(.make404Page()),
//        .copyResources(),
//        .generateHTML(withTheme: .main),
//        .installPlugin(.move404PageToRoot()),
//        .generateRSSFeed(including: [.blog]),
//        .generateSiteMap(),
//        .deploy(
//            using: .gitHub("AdaEngine/adaengine.github.io", branch: "main", useSSH: true)
//        )
//    ])
//
//}
