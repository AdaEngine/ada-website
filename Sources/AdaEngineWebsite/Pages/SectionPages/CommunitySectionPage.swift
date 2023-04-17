//
//  CommunitySectionPage.swift
//  
//
//  Created by v.prusakov on 4/16/23.
//

import Plot
import Publish
import PublishColorUtils

struct CommunitySocial {
    let image: String
    var darkImage: String? = nil
    let title: String
    var subtitle: String? = nil
    let description: String
    let path: String
}

struct CommunitySectionPage: Component {
    
    var socials: [CommunitySocial] = [
        CommunitySocial(
            image: "socials/github.svg",
            darkImage: "socials/github-white.svg",
            title: "GitHub",
            subtitle: "AdaEngine",
            description: "The source code of AdaEngine. Learn and interact with source code, reports bugs or suggest changes using GitHub issues.",
            path: "https://github.com/AdaEngine/AdaEngine"
        ),
//        CommunitySocial(
//            image: "socials/discord.svg",
//            title: "Discord",
//            subtitle: "AdaEngine",
//            description: "A community for discussion about game development, Swift, user support and showcases.",
//            path: "https://discord.gg/AdaEngine",
//        ),
        CommunitySocial(
            image: "socials/reddit.svg",
            title: "Reddit",
            subtitle: "r/AdaEngine",
            description: "A community for discussion, sharing your games or plugins.",
            path: "https://reddit.com/r/AdaEngine/"
        ),
        CommunitySocial(
            image: "socials/mastodon.svg",
            title: "Mastodon",
            subtitle: "@ada_engine",
            description: "Stay tuned with quick news in boosted community in the Fediverse.",
            path: "https://mastodon.social/@ada_engine"
        ),
        CommunitySocial(
            image: "socials/twitter-circle.svg",
            title: "Twitter",
            subtitle: "@ada_engine",
            description: "Get quick news about engine development.",
            path: "https://twitter.com/@ada_engine"
        )
    ]
    
    var body: Component {
        Div {
            for item in self.socials {
                CommunitySocialRow(item: item)
            }
        }
        .class("collection-grid grid-two-columns")
    }
}

struct CommunitySocialRow: Component {
    
    let item: CommunitySocial
    
    @EnvironmentValue(.publishContext)
    private var context
    
    var body: Component {
        Link(url: item.path) {
            Div {
                Image(context!.site.imagePath!.appendingComponent(item.image).absoluteString)
                    .class("light")
                
                Image(context!.site.imagePath!.appendingComponent(item.darkImage ?? item.image).absoluteString)
                    .class("dark")
            }
            .class("image-container")
            
            Div {
                H2(item.title)
                    .class("title")
                
                if let subtitle = item.subtitle {
                    Paragraph(subtitle)
                        .class("subtitle")
                }
                
                Paragraph(item.description)
                    .class("description")
            }
            .class("content")
        }
        .class("community-card")
    }
}
