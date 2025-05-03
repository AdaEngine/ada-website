//
//  ErrorPage.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 03.05.2025.
//

import Ignite

struct ErrorPage: Ignite.ErrorPage {
    var body: some HTML {
        GridContainer {
            Text("404 - Page not found!")
                .font(.title1)
            
            Div {
                Text("To report an issue with the website, please open an ")
                
                Link(target: "https://github.com/adaengine/ada-website/") {
                    Text("issue on GitHub.")
                }
            }
        }
    }
}
