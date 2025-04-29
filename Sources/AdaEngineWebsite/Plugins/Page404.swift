//
//  Page404.swift
//  
//
//  Created by v.prusakov on 4/14/23.
//

import Plot
import Publish

//extension Plugin {
//    static func make404Page() -> Self {
//        Plugin(name: "Make 404 Page") { context in
//            let content = Content(
//                title: "Page not found",
//                body: Content.Body(
//                    node: .component(Page404())
//                )
//            )
//            let errorPage = Page(path: "404", content: content)
//            context.addPage(errorPage)
//        }
//    }
//    
//    static func move404PageToRoot() -> Self {
//        let stepName = "Move 404 Page"
//        return Plugin(name: stepName) { context in
//            guard let orig404Page = context.pages["404"] else {
//                throw PublishingError(stepName: stepName,
//                                      infoMessage: "Unable to find 404 page \(context.pages.keys)")
//            }
//            
//            let orig404File = try context.outputFile(at: "\(orig404Page.path)/index.html")
//            try orig404File.rename(to: "404")
//            
//            guard
//                let orig404Folder = orig404File.parent,
//                let outputFolder = orig404Folder.parent,
//                let rootFolder = outputFolder.parent
//            else {
//                throw PublishingError(stepName: stepName,
//                                      infoMessage: "Unable find root, output and 404 folders")
//            }
//            try context.copyFileToOutput(from: "\(orig404File.path(relativeTo: rootFolder))")
//            try orig404Folder.delete()
//        }
//    }
//}
//
//struct Page404: Component {
//    var body: Component {
//        Div {
//            H1 {
//                Text("404 - Page not found")
//            }
//            
//            Paragraph {
//                Text("To report an issue with the website, please open an ")
//                
//                Link("issue on GitHub.", url: "https://github.com/adaengine/ada-website/")
//            }
//        }
//    }
//}
