//
//  LearnSectionPage.swift.swift
//  
//
//  Created by v.prusakov on 5/10/23.
//

import Plot
import Publish
import PublishColorUtils

struct LearnSectionPage: Component {
    
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
    
    var body: Component {
        Div {
            for item in self.links {
                CommunitySocialRow(item: item)
            }
        }
        .class("collection-grid grid-two-columns")
    }
}
