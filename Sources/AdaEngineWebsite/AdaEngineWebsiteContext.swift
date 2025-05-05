//
//  AdaEngineWebsiteContext.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 03.05.2025.
//

import Dependencies
import Foundation
import Ignite

@MainActor
final class AdaEngineWebsiteContext {
    let rootURL: URL
    let buildDirURL: URL
    let imagesURL: URL
    
    var authors: [AuthorEntity] = []
    
    var htmlModifier: HTMLContentModifier
    
    var additionalStaticPages: [any StaticPage] = []
    var additionalArticles: [any ArticlePage] = []
    
    var dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateFormat = "YYYY-MM-dd"
        formatter.locale = Locale(identifier: "en_EN")
        return formatter
    }()
    
    init(
        rootDirictory: StaticString = #filePath,
        buildDir: String = "Build",
        imagesDir: String = "images"
    ) {
        self.rootURL = try! URL.selectDirectories(from: rootDirictory).source
        self.buildDirURL = self.rootURL.appending(path: buildDir)
        self.imagesURL = self.buildDirURL.appending(path: imagesDir)
        self.htmlModifier = HTMLContentModifier(modifiers: [])
    }
}

extension AdaEngineWebsiteContext {
    func image(for path: String?) -> String? {
        guard let path else {
            return nil
        }
        
        return "/images/\(path)"
    }
    
    func author(for article: Article) -> AuthorEntity {
        self.authors.first(where: { $0.username == article.author })!
    }
}

extension AdaEngineWebsiteContext: DependencyKey {
    nonisolated static var liveValue: AdaEngineWebsiteContext {
        MainActor.assumeIsolated {
            AdaEngineWebsiteContext()
        }
    }
}

extension DependencyValues {
    var context: AdaEngineWebsiteContext {
        get { self[AdaEngineWebsiteContext.self] }
        set { self[AdaEngineWebsiteContext.self] = newValue }
    }
}
