//
//  TagGeneratorPlugin.swift
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 04.05.2025.
//

import Dependencies
import Ignite

struct ArticleTag: Hashable {
    let name: String
    let link: String
}

@MainActor
struct TagGeneratorPlugin: IgnitePlugin {
    private let tagsCSSPrefix: String
    private let resourcePath: String
    private let tagsFileName: String
    private let builder: (ArticleTag) -> MultiThemeColor
    
    @Environment(\.articles) private var articles
    @Dependency(\.context) private var context
    
    init(
        tagsCSSPrefix: String = "",
        resourcePath: String = "Resources",
        tagsFileName: String = "tags.css",
        builder: @escaping (ArticleTag) -> MultiThemeColor
    ) {
        self.tagsCSSPrefix = tagsCSSPrefix
        self.resourcePath = resourcePath
        self.tagsFileName = tagsFileName
        self.builder = builder
    }
    
    func execute() async throws {
        var tags = Set<String>()
        self.articles.all.forEach { article in
            article.tags?.forEach { tag in
                tags.insert(tag)
            }
        }
        
        let articleTags = tags.map {
            let tagPath = $0.convertedToSlug()
            return ArticleTag(
                name: $0,
                link: "/tags/\(tagPath)"
            )
        }
        
        try self.tagColorCSSGenerator(tags: articleTags, builder: builder)
    }
}

extension TagGeneratorPlugin {
    private func createTagStyle(_ className: String, color: Color) -> String {
        """
        .\(className) {
        \tbackground-color: \(color.opacity(0.4).hexWithAlpha);
        \tcolor: \(color.hexWithAlpha);
        \tfont-weight: bold;
        }
        
        .\(className):hover {
        \tbackground-color: \(color.opacity(0.7).hexWithAlpha);
        }
        """
    }
    
    @MainActor
    func tagColorCSSGenerator(
        tags: [ArticleTag],
        builder: @escaping (ArticleTag) -> MultiThemeColor
    ) throws {
        let tuple = tags.map { tag -> (light: String, dark: String?) in
            let color = builder(tag)
            let className = "\(tagsCSSPrefix)\(tag.name.convertedToSlug())"
            
            
            let lightStyle = self.createTagStyle(className, color: color.light)
            let darkStyle = color.dark.flatMap { self.createTagStyle(className, color: $0) }
            
            ArticleTag.styles[tag] = className
            
            return (lightStyle, darkStyle)
        }
        
        let folder = try context.folder(at: resourcePath)
        if folder.containsFile(named: tagsFileName) {
            try folder.file(at: tagsFileName).delete()
        }
        
        let tagsFile = try folder.createFile(at: tagsFileName)
        
        var content = """
        /* THIS FILE WAS AUTO GENERATED. DO NOT CHANGE IT MANUAL */
                
        \(tuple.map { $0.light }.joined(separator: "\n\n"))
        """
        
        let stylesForDark = tuple.compactMap { $0.dark }
        
        if !stylesForDark.isEmpty {
            content.append("\n\n@media(prefers-color-scheme: dark) {\n\n")
            
            for darkStyle in stylesForDark {
                let style = darkStyle.replacingOccurrences(of: "\n", with: "\n\t")
                content.append("\t\(style)\n\n")
            }
            content.append("}")
        }
        
        try tagsFile.write(content)
    }
}

//public extension Plugin {
//
//    /// Check that tag is available and can be colored.
//    static func checkTagsAvailability<T: RawRepresentable & CaseIterable>(_ value: T.Type) -> Self where T.RawValue == String {
//        Plugin(name: "CheckTagsAvailability", installer: { context in
//            let notExistsTags = context.allTags
//                .filter { tag in return !value.allCases.contains(where: { $0.rawValue == tag.string }) }
//                .map { $0.string }
//            
//            if !notExistsTags.isEmpty {
//                
//                let brokenArticles = context.allItems(sortedBy: \.date)
//                    .filter {
//                        $0.tags.contains(where: { tag in notExistsTags.contains(tag.string)
//                    })}
//                
//                let errorMessage = brokenArticles.reduce("", { result, item in
//                    
//                    let tags = item.tags.map { $0.string }.filter { notExistsTags.contains($0) }.joined(separator: " ")
//                    
//                    let new = result + "`\(tags)` in article at path: \(item.path)\n"
//                    return new
//                })
//                
//                fatalError("Found an unavailable tags:\n\(errorMessage)")
//            }
//        })
//    }

extension ArticleTag {
    
    nonisolated(unsafe) internal static var styles: [ArticleTag: String] = [:]
    
    var cssClass: String {
        return Self.styles[self] ?? ""
    }
}
