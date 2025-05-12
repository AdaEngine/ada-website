//
//  ErrorPage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 03.05.2025.
//

import Ignite

struct ErrorPage: Ignite.ErrorPage {
    var body: some HTML {
        SafeAreaContainer {
            VStack(alignment: .leading, spacing: 20) {
                Text("404 - Page not found!")
                    .font(.primary(size: .em(3.5)))

                Div {
                    Text("To report an issue with the website, please open an ")

                    Link(target: "https://github.com/adaengine/ada-website/") {
                        Text("issue on GitHub.")
                    }
                }
            }

            Image("/images/ae_logo.svg", description: "AdaEngine Logo")
                .resizable()
                .frame(height: 200)
                .class("ae-logo-header")
        }
        .padding(.vertical, 40)
    }
}
