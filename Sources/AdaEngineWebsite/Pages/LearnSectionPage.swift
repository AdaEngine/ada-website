//
//  LearnSectionPage.swift.swift
//
//
//  Created by v.prusakov on 5/10/23.
//

import Ignite

struct LearnSectionPage: StaticPage {

    let title: String = "Learn AdaEngine"
    let path: String = SectionID.learn.rawValue

    var links: [CommunitySocial] = [
        CommunitySocial(
            image: "icons/ic_learn.svg",
            title: "Tutorials",
            description: "Begin a new games with AdaEngine using tutoruals",
            path: "/adaengine-docs/tutorials/adaengine"
        ),
        CommunitySocial(
            image: "icons/ic_doc.svg",
            title: "Documentation",
            description: "Official documentation",
            path: "/adaengine-docs/documentation/adaengine"
        ),
    ]

    var body: some HTML {
        Section("Offical Learn Resources") {
            Div {
                ForEach(self.links) { item in
                    Link(target: item.path) {
                        CommunitySocialRow(item: item)
                    }
                }
            }
            .class("collection-grid grid-two-columns")
        }
    }
}
