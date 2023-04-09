//
//  ImagePlugin.swift
//  
//
//  Created by v.prusakov on 4/16/20.
//

import Foundation
import Publish
import Plot
import Ink

extension Plugin {
    static func imagePlugin() -> Self {
        Plugin(name: "Image Description Plugin", installer: { context in
            let imagePath = context.site.imagePath!
            context.markdownParser.addModifier(.imageModifier(imagePath: imagePath))
        })
    }
}

extension Modifier {
    
    private static let fullWidthMode = "?fullWidth"
    
    static func imageModifier(imagePath: Path) -> Self {
        Modifier(target: .images) { html, markdown -> String in
            
            let isFullMode = markdown.contains(Self.fullWidthMode)
            let input = markdown.replacingOccurrences(of: Self.fullWidthMode, with: "")
            
            let path = String(input.dropFirst("![".count).dropLast(")".count).drop(while: { $0 != "(" }).dropFirst())

            let altSuffix = input.firstSubstring(between: "[", and: "]").flatMap(String.init)
            
            let imageHTML = Node.imageNode(path: imagePath.appendingComponent(path),
                                           description: altSuffix,
                                           isFullMode: isFullMode)
            
            return imageHTML.render()
        }
    }
}

fileprivate extension Node where Context == HTML.BodyContext {
    static func imageNode(path: Path, description: String?, isFullMode: Bool) -> Node {
        .div(
            .class("article-image"),
            .img(
                .class(isFullMode ? "full-width-image" : ""),
                .src(path),
                .unwrap(description) { .alt($0) }
            ),
            .unwrap(description) { .p(.text($0)) }
        )
    }
}
