//
//  ImagePlugin.swift
//  
//
//  Created by v.prusakov on 4/16/20.
//

import Foundation
import Publish
import Ink

extension Plugin {
    
    static func imagePlugin() -> Self {
        Plugin(name: "Image Description Plugin", installer: { context in
            context.markdownParser.addModifier(.imageModifier())
        })
    }
}

extension Modifier {
    
    private static let fullWidthMode = "?fullWidth"
    
    static func imageModifier() -> Self {
        Modifier(target: .images) { html, markdown -> String in
            
            let fullWidthMode = markdown.contains(Self.fullWidthMode)
            let input = markdown.replacingOccurrences(of: Self.fullWidthMode, with: "")
            
            let path = String(input.dropFirst("![".count).dropLast(")".count).drop(while: { $0 != "(" }).dropFirst())

            var altSuffix = ""
            if let alt = input.firstSubstring(between: "[", and: "]") {
                altSuffix = String(alt)
            }
            
            let imageStyle = fullWidthMode ? "class=\"full-width-image\"" : ""
            
            let imageHTML = "<div class=\"article-image\"><img src=\"\(path)\" alt=\"\(altSuffix)\"\(imageStyle)><p>\(altSuffix)</p></div>"
            return imageHTML
        }
    }
}
