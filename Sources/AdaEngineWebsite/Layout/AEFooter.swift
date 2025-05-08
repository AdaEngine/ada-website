//
//  AEFooter.swift
//
//
//  Created by v.prusakov on 4/9/23.
//

import Ignite

struct AEFooter: DocumentElement {
    var isPrimitive: Bool = true

    var body: some HTML {
        Tag("footer") {
            SafeAreaContainer {
                Div {
                    footerMain()
                        .padding(.bottom, 40)

                    Divider()

                    footerBottom()
                }
                .class("footer-container")
            }
        }
        .class("footer")
    }
}

extension AEFooter {
    func footerMain() -> some HTML {
        Grid(alignment: .top, spacing: 40) {
            Section("Ada Engine") {
                VStack(alignment: .leading, spacing: 8) {
                    Link("Download", target: URL.github.appendingPathComponent("releases"))
                    Link("Documentation", target: .documentation)
                    Link("Features", target: .features)
                    Link("Source code", target: URL.github)
                }
                .padding(.top, 16)
            }
            .headerProminence(.title5)
            .width(1)

            Section("Project") {
                VStack(alignment: .leading, spacing: 8) {
                    Link("Blog", target: BlogSectionPage())
                    // Link("Code of conduct", target: "#")
                    Link("Communities", target: CommunitySectionPage())
                }
                .padding(.top, 16)
            }
            .headerProminence(.title5)
            .width(1)

            // Section("Resources") {
            //     VStack(alignment: .leading, spacing: 8) {
            //         Link("Showcase", target: ShowcaseSectionPage())
            //     }
            // }
            // .headerProminence(.title5)
            // .width(1)

            Section("Foundation") {
                VStack(alignment: .leading, spacing: 8) {
                    Link("About", target: "#")
                    Link("Donate", target: DonatePage())
                    Link("License", target: URL.github.appendingPathComponent("LICENSE"))
                }
                .padding(.top, 16)
            }
            .headerProminence(.title5)
            .width(1)

            Spacer()
                .width(1)
        }
        .columns(4)
        .class("footer-columns")
    }

    func footerBottom() -> some HTML {
        Div {
            Grid(alignment: .center, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(
                        "© 2021-2025 Vladislav Prusakov and contributors. All rights reserved."
                    )

                    Link("Website source code on GitHub.", target: URL.websiteSourceCode)

                    Text {
                        "Created in Swift with "
                        Link("Ignite", target: URL.ignite)
                    }
                    .horizontalAlignment(.center)
                }
                .font(.system(size: 13))
                .width(3)

                Spacer()
                    .width(2)

                HStack(spacing: 12) {
                    Link(target: URL.github) {
                        Image(systemName: "github", description: "GitHub")
                    }
                    Link(target: URL.mastodon) {
                        Image(systemName: "mastodon", description: "Mastodon")
                    }
                    // Link(target: URL.discord) { Tag("i").class("bi bi-discord") }
                    Link(target: URL.reddit) {
                        Image(systemName: "reddit", description: "Reddit")
                    }
                    // Link(target: "#") { Tag("i").class("bi bi-rss") }
                }
                .class("footer-social-icons")
                .width(1)
            }
            .columns(6)
        }
        .class("footer-bottom")
    }
}
