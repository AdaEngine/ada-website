//
//  LearnSectionPage.swift.swift
//  
//
//  Created by v.prusakov on 5/10/23.
//

import Ignite

struct LearnSectionPage: StaticPage {
    
    var title: String = "Learn"
    
    var links: [CommunitySocial] = [
        CommunitySocial(
            image: "socials/mastodon.svg",
            title: "Tutorials",
            description: "Begin a new games with AdaEngine using tutoruals",
            path: "/adaengine-docs/tutorials/adaengine"
        ),
        CommunitySocial(
            image: "socials/twitter-circle.svg",
            title: "Documentation",
            description: "Official documentation",
            path: "/adaengine-docs/documentation/adaengine"
        )
    ]
    
    var body: some HTML {
        Group {
            ForEach(self.links) { item in
                CommunitySocialRow(item: item)
            }
        }
        .class("collection-grid grid-two-columns")
    }
}
