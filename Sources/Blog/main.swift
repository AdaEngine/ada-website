import Foundation
import Publish
import Plot
import MinifyCSSPublishPlugin
import ReadingTimePublishPlugin
import CNAMEPublishPlugin
import SplashPublishPlugin


// This type acts as the configuration for your website.
struct Blog: Website {
    enum SectionID: String, WebsiteSectionID {
        // Add the sections that you want your website to contain here:
        case posts
    }
    
    struct ItemMetadata: WebsiteItemMetadata {
        // Add any site-specific metadata that you want to use here.
    }
    
    // Update these properties to configure your website:
    let url = URL(string: "https://your-website-url.com")!
    let name = "LiteCode"
    let description = "A description of Blog"
    let language: Language = .english
    let imagePath: Path? = "Images"
}

// This will generate your website using the built-in Foundation theme:
try Blog().publish(using: [
    .addMarkdownFiles(),
    .installPlugin(.readingTime()),
    .installPlugin(.splash(withClassPrefix: "s")),
    .copyResources(),
    .step(named: "Use custom Date Formatter", body: { context in
        let formatter = DateFormatter()
        formatter.dateFormat = "dd MMM YYYY"
        formatter.locale = Locale(identifier: "en_EN")
        context.dateFormatter = formatter
    }),
    .generateHTML(withTheme: .main),
    .generateRSSFeed(including: [.posts]),
    .generateSiteMap(),
    .installPlugin(.generateCNAME(with: ["www.litecode.dev"])),
    .deploy(using: .gitHub("SpectralDragon/spectraldragon.github.io", useSSH: false))
])
