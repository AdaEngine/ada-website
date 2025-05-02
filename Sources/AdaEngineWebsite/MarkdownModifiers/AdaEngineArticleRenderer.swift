//
//  AdaEngineArticleRenderer.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 02.05.2025.
//

import Dependencies
import Ignite

struct AdaEngineArticleRenderer: ArticleRenderer {
    
    var title: String {
        self.parser.title
    }
    
    var description: String {
        self.parser.description
    }
    
    var body: String {
        self.parser.body
    }
    
    let removeTitleFromBody: Bool
    
    let parser: MarkdownToHTML
    
    init(markdown: String, removeTitleFromBody: Bool) throws {
        @Dependency(MarkdownModifierApplier.self) var modifier
        try MainActor.assumeIsolated {
            var markdown = markdown
            try modifier.execute(to: &markdown)
        }
        self.removeTitleFromBody = removeTitleFromBody
        self.parser = MarkdownToHTML(markdown: markdown, removeTitleFromBody: removeTitleFromBody)
    }
}
