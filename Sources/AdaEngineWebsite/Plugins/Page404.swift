//
//  Page404.swift
//  
//
//  Created by v.prusakov on 4/14/23.
//

import Plot
import Publish

extension Plugin {
    static func make404Page() -> Self {
        Plugin(name: "Make 404 Page") { context in
            let content = Content(
                title: "Page not found",
                body: Content.Body(
                    node: .component(Page404())
                )
            )
            let errorPage = Page(path: "404.html", content: content)
            context.addPage(errorPage)
        }
    }
}

struct Page404: Component {
    var body: Component {
        Div {
            H1 {
                Text("404 - Page not found")
            }
            
            Paragraph {
                Text("To report an issue with the website, please open an ")
                
                Link("issue on GitHub.", url: "https://github.com/adaengine/ada-website/")
            }
        }
    }
}
