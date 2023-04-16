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
    let title: String
    var subtitle: String? = nil
    let description: String
    let path: String
    let color: Color
}

struct CommunitySectionPage: Component {
    
    var socials: [CommunitySocial] = [
        CommunitySocial(
            image: "socials/github-white.svg",
            title: "GitHub",
            subtitle: "AdaEngine",
            description: "",
            path: "https://github.com/AdaEngine/AdaEngine",
            color: .black
        ),
//        CommunitySocial(
//            image: "socials/discord.svg",
//            title: "Discord",
//            subtitle: "AdaEngine",
//            description: "",
//            path: "https://github.com/AdaEngine/AdaEngine"
//        ),
        CommunitySocial(
            image: "socials/reddit-oranged.svg",
            title: "Reddit",
            subtitle: "r/AdaEngine",
            description: "",
            path: "https://reddit.com/r/AdaEngine/",
            color: Color(hex: "#FF5700")
        ),
        CommunitySocial(
            image: "socials/mastodon.svg",
            title: "Mastodon",
            subtitle: "@ada_engine",
            description: "",
            path: "https://mastodon.social/@ada_engine",
            color: Color(hex: "#17063B")
        ),
        CommunitySocial(
            image: "socials/twitter-circle.svg",
            title: "Twitter",
            subtitle: "@ada_engine",
            description: "",
            path: "https://twitter.com/@ada_engine",
            color: Color(hex: "#1DA1F2")
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
        .style("background-color: \(item.color.hex)")
    }
}

extension Color {
    static let black = Color(red: 0, green: 0, blue: 0)
    static let white = Color(red: 1, green: 1, blue: 1)
}
