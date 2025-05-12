//
//  HTMLModifier.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 03.05.2025.
//

import Dependencies
import DependenciesMacros
import Ignite

protocol HTMLModifier {
    @MainActor func modify(_ content: inout ArticleModifier) throws
}

@MainActor
struct HTMLContentModifier {
    
    @Environment(\.articles)
    private var articles
    
    @Dependency(\.context)
    private var context
    
    private var modifiers: [any HTMLModifier]
    
    init(modifiers: [any HTMLModifier]) {
        self.modifiers = modifiers
    }
    
    mutating func add<T: HTMLModifier>(_ modifier: T) {
        self.modifiers.append(modifier)
    }
    
    func execute() async throws {
        for article in articles.all {
            let url = context.buildDirURL.appending(path: article.path).appending(path: "index.html")
            let rawHTML = try String(contentsOf: url, encoding: .utf8)
            var content = ArticleModifier(article: article, rawHTML: rawHTML)
            try modifiers.forEach {
                try $0.modify(&content)
            }
            
            try content.rawHTML.write(to: url, atomically: true, encoding: .utf8)
        }
    }
}

@MainActor
struct ArticleModifier {
    
    struct HTMLTag: Hashable {
        let attributes: [String: String]
        let substring: Substring
    }
    
    let article: Article
    private(set) var rawHTML: String
    
    init(article: Article, rawHTML: String) {
        self.article = article
        self.rawHTML = rawHTML
    }
    
    func tags(between: Identifier, and terminator: Terminator) -> [HTMLTag] {
        func attributes(for substring: Substring) -> [String: String] {
            var htmlAttributes = [String: String]()
            let attributes = substring.components(separatedBy: "\" ")
            for attributes in attributes {
                let components = attributes.components(separatedBy: "=\"")
                let key = (components.first ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
                htmlAttributes[key] = components.last
            }
            return htmlAttributes
        }
        
        let substrings = self.rawHTML.substrings(between: between, and: terminator)
        return substrings.map {
            let firstIndex = rawHTML.index($0.startIndex, offsetBy: -between.string.count)
            let endIndex = rawHTML.index($0.endIndex, offsetBy: terminator.string.count)
            let attributes = attributes(for: $0)
            let substring = self.rawHTML[firstIndex..<endIndex]
            return .init(attributes: attributes, substring: substring)
        }
    }
    
    func getFirstSubstring(between: Identifier, terminator: Terminator) -> Substring? {
        guard let firstMatch = self.rawHTML.firstSubstring(between: between, and: terminator) else {
            return nil
        }
        
        let startIndex = self.rawHTML.index(firstMatch.startIndex, offsetBy: -between.string.count)
        let endIndex = self.rawHTML.index(firstMatch.endIndex, offsetBy: terminator.string.count)
        return self.rawHTML[startIndex..<endIndex]
    }
    
    mutating func replace<Content: HTML>(
        _ subrange: Range<String.Index>,
        @HTMLBuilder htmlContent: () -> Content
    ) {
        let render = htmlContent().render()
        rawHTML.replaceSubrange(subrange, with: render)
    }
    
    mutating func replace<Content: HTML>(
        _ subrange: ClosedRange<String.Index>,
        @HTMLBuilder htmlContent: () -> Content
    ) {
        let render = htmlContent().render()
        rawHTML.replaceSubrange(subrange, with: render)
    }
    
    mutating func insert<Content: HTML>(
        at index: String.Index,
        @HTMLBuilder htmlContent: () -> Content
    ) {
        let render = htmlContent().render()
        rawHTML.insert(contentsOf: render, at: index)
    }
}
