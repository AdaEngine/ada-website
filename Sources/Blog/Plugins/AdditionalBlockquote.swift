//
//  AdditionalBlockquote.swift
//  
//
//  Created by v.prusakov on 4/15/20.
//

import Foundation
import Publish
import Ink

extension Plugin {
    static func additionalBlockquote() -> Self {
        Plugin(name: "Additional Blockquote Modifier", installer: { context in
            context.markdownParser.addModifier(
                Modifier(target: .html) { (html, markdown) -> String in
                    return html
                        .replacingOccurrences(of: "<warning>", with: "<blockquote class=\"blockquote-warning\"><p>")
                        .replacingOccurrences(of: "</warning>", with: "</p></blockquote>")
                        .replacingOccurrences(of: "<error>", with: "<blockquote class=\"blockquote-error\"><p>")
                        .replacingOccurrences(of: "</error>", with: "</p></blockquote>")
                        .replacingOccurrences(of: "<info>", with: "<blockquote class=\"blockquote-info\"><p>")
                        .replacingOccurrences(of: "</info>", with: "</p></blockquote>")
                }
            )
        })
    }
}
