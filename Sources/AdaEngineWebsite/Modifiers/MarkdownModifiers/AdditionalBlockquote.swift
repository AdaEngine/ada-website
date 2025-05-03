//
//  AdditionalBlockquote.swift
//  
//
//  Created by v.prusakov on 4/15/20.
//

import Foundation

enum AvailableBlockquote: String, CaseIterable {
    case warning
    case info
    case error
}

struct AdditionalBlockquoteModifier: MarkdownModifier {
    func modify(_ markdown: inout String) throws {
        var tmpMarkdown = markdown
        for blockquote in AvailableBlockquote.allCases {
            let formattedMarkdown = tmpMarkdown
                .replacingOccurrences(of: "<\(blockquote.rawValue)>", with: "<blockquote class=\"blockquote-\(blockquote.rawValue)\"><p>")
                .replacingOccurrences(of: "</\(blockquote.rawValue)>", with: "</p></blockquote>")
            
            tmpMarkdown = String(formattedMarkdown)
        }
        
        markdown = tmpMarkdown
    }
}
