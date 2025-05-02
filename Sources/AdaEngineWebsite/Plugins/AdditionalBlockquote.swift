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
