//
//  ImageModifier.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 02.05.2025.
//

import Dependencies
import Foundation
import Ignite

struct ImagePlugin: IgnitePlugin {
    
    @Dependency(\.context)
    private var context
    
    @MainActor
    func execute() async throws {
        context.htmlModifier.add(ImageModifier())
    }
}

struct ImageModifier: HTMLModifier {
    
    private static let fullWidthMode = "?fullWidth"
    
    func modify(_ content: inout ArticleModifier) throws {
        let tags = content.tags(between: "<img", and: "/>")
        guard
            let firstTag = tags.first(where: { $0.attributes["src"]?.contains(Self.fullWidthMode) ?? false }),
            let source = firstTag.attributes["src"]
        else {
            return
        }
        
        content.replace(firstTag.substring.startIndex..<firstTag.substring.endIndex) {
            imageNode(source, description: firstTag.attributes["alt"])
        }
    }
    
    @MainActor
    private func imageNode(_ path: String, description: String?) -> some HTML {
        Div {
            Image(path, description: description ?? "")
                .class("full-width-image")
            
            if let description {
                Text(description)
            }
        }
        .class("article-image")
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
