//
//  CommunitySectionPage.swift
//  
//
//  Created by v.prusakov on 4/16/23.
//

import Ignite
import Dependencies

struct CommunitySocial {
    let image: String
    var darkImage: String? = nil
    let title: String
    var subtitle: String? = nil
    let description: String
    let path: String
}

struct CommunitySectionPage: StaticPage {
    
    let title: String = "AdaEngine Community"
    let path: String = SectionID.community.rawValue
    
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
    
    var body: some HTML {
        Section("Official communities") {
            Div {
                ForEach(self.socials) { item in
                    Tag("a") {
                        CommunitySocialRow(item: item)
                    }
                    .attribute("href", item.path)
                }
            }
            .class("collection-grid grid-two-columns")
        }
    }
}

struct CommunitySocialRow: HTML {
    let item: CommunitySocial
    
    @Environment(\.themes)
    private var themes
    
    @Dependency(\.context)
    private var context
    
    var isPrimitive: Bool = true
    
    var body: some HTML {
        Div {
            Section {
                AEImage(path: item.image, description: item.description)
                    .class("light")
                
                AEImage(path: item.darkImage ?? item.image, description: item.description)
                    .class("dark")
            }
            .class("image-container")
            
            Section {
                Text(item.title)
                    .font(.title4)
                
                if let subtitle = item.subtitle {
                    Text(subtitle)
                        .class("subtitle")
                }
                
                Text(item.description)
                    .class("description")
            }
            .class("content")
        }
        .class("community-card column")
    }
}
