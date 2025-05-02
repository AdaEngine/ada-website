//
//  ImageModifier.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 02.05.2025.
//

import Foundation
import Ignite

struct ImageModifier: MarkdownModifier {
    
    private static let fullWidthMode = "?fullWidth"
    
    func modifyMarkdown(_ markdown: inout String) {
        let isFullMode = markdown.contains(Self.fullWidthMode)
        let input = markdown.replacingOccurrences(of: Self.fullWidthMode, with: "")
        
        let path = String(input.dropFirst("![".count).dropLast(")".count).drop(while: { $0 != "(" }).dropFirst())
        
        if path.isEmpty {
            return
        }
        
        let description = input.firstSubstring(between: "[", and: "]").flatMap(String.init)
//        let render = Div {
//            Image(path, description: description ?? "")
//                .class(isFullMode ? "full-width-image" : "")
//            
//            if let description {
//                Text(description)
//            }
//        }
//        .class("article-image")
        
//        print(render.render())
    }
}

//extension Plugin {
//    static func imagePlugin() -> Self {
//        Plugin(name: "Image Description Plugin", installer: { context in
//            let imagePath = context.site.imagePath!
//            context.markdownParser.addModifier(.imageModifier(imagePath: imagePath))
//        })
//    }
//}

//extension Modifier {
//
//    private static let fullWidthMode = "?fullWidth"
//
//    static func imageModifier(imagePath: Path) -> Self {
//        Modifier(target: .images) { html, markdown -> String in
//
//            let isFullMode = markdown.contains(Self.fullWidthMode)
//            let input = markdown.replacingOccurrences(of: Self.fullWidthMode, with: "")
//
//            let path = String(input.dropFirst("![".count).dropLast(")".count).drop(while: { $0 != "(" }).dropFirst())
//
//            let altSuffix = input.firstSubstring(between: "[", and: "]").flatMap(String.init)
//
//            let imageHTML = Node.imageNode(path: imagePath.appendingComponent(path),
//                                           description: altSuffix,
//                                           isFullMode: isFullMode)
//
//            return imageHTML.render()
//        }
//    }
//}

//fileprivate extension Node where Context == HTML.BodyContext {
//    static func imageNode(path: Path, description: String?, isFullMode: Bool) -> Node {
//        .component(
//            Div {
//                Image(url: path.absoluteString, description: description ?? "")
//                    .class(isFullMode ? "full-width-image" : "")
//
//                if let description {
//                    Paragraph(description)
//                }
//            }
//            .class("article-image")
//        )
//    }
//}
