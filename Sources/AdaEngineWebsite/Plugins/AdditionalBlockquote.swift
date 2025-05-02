//
//  AdditionalBlockquote.swift
//  
//
//  Created by v.prusakov on 4/15/20.
//

import Foundation
//import Publish
//import Ink
//import Splash

enum AvailableBlockquote: String, CaseIterable {
    case warning
    case info
    case error
}

struct AdditionalBlockquoteModifier: MarkdownModifier {
    func modifyMarkdown(_ markdown: inout String) {
        for blockquote in AvailableBlockquote.allCases {
            let formattedMarkdown = markdown
                .replacingOccurrences(of: "<\(blockquote.rawValue)>", with: "<blockquote class=\"blockquote-\(blockquote.rawValue)\">")
                .replacingOccurrences(of: "</\(blockquote.rawValue)>", with: "</blockquote>")
                .dropFirst()
            
            markdown = String(formattedMarkdown)
        }
    }
}

//extension Plugin {
//    
//    enum AvailableBlockquote: String, CaseIterable {
//        case warning
//        case info
//        case error
//    }
//    
//    static func additionalBlockquote() -> Self {
//        Plugin(name: "Additional Blockquote Modifier", installer: { context in
//            let parser = context.markdownParser
//            context.markdownParser.addModifier(
//                Modifier(target: .html) { (html, markdown) -> String in
//                    guard let blockquote = AvailableBlockquote.allCases.first(where: { markdown.hasPrefix("<\($0.rawValue)>") }) else { return html }
//                    
//                    let formattedMarkdown = markdown
//                        .replacingOccurrences(of: "<\(blockquote.rawValue)>", with: "")
//                        .replacingOccurrences(of: "</\(blockquote.rawValue)>", with: "")
//                        .dropFirst()
//                    
//                    let html = parser.html(from: String(formattedMarkdown))
//                    
//                    return "<blockquote class=\"blockquote-\(blockquote.rawValue)\">\(html)</blockquote>"
//                }
//            )
//        })
//    }
//}
