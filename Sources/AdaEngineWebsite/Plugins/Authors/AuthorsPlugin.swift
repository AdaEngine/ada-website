//
//  File.swift
//  
//
//  Created by v.prusakov on 4/15/20.
//

import Dependencies
import Foundation
import Ignite

struct AuthorItem: Equatable {
    let name: String
    let avatar: String
    let description: String
    let socials: [Author.Social]
    let username: String
    
//    var content: Content = Content()
    
//    var path: Path = ""
    
    init(author: Author) {
        self.name = author.name
        self.avatar = author.avatar
        self.description = author.description
        self.socials = author.socials
        self.username = author.username
    }
}

struct AuthorPlugin: IgnitePlugin {
    
    struct SocialStyle {
        let className: String
        let backgroundColor: Color
        let color: Color
    }
    
    @Environment(\.decode) private var decode
    @Dependency(\.context) private var context
    
    func execute() async throws {
        guard let data = decode.data(forResource: "authors.json") else {
            fatalError("authors.json not found")
        }
        let authors = try JSONDecoder().decode([Author].self, from: data)
        
        try self.generateSocialStyleFile(
            socials: Author.Social.Kind.allCases
        )
        
        print(authors)
    }
    
    private func socialStyle(for social: SocialStyle) -> String {
        """
        .socials .\(social.className) {
        \tbackground-color: \(social.backgroundColor.opacity(0.4).hexWithAlpha);
        \tcolor: \(social.color.hexWithAlpha);
        \tfont-weight: bold;
        }
        
        .socials .\(social.className) img:hover {
            fill: \(social.color.hexWithAlpha);
        }
        
        .socials .\(social.className):hover {
        \tbackground-color: \(social.backgroundColor.opacity(0.7).hexWithAlpha);
        \tcolor: \(social.color.hexWithAlpha);
        }
        """
    }
    
    private func generateSocialStyleFile(
        socials: [Author.Social.Kind],
        resourcePath: String = "Resources",
        socialFileName: String = "socials.css"
    ) throws {
        let tuple: [(light: SocialStyle, dark: SocialStyle?)] = socials.map { social in
            let className = social.rawValue
            
            let light = SocialStyle(
                className: className,
                backgroundColor: social.backgroundColor.light,
                color: social.color.light
            )
            
            var dark: SocialStyle?
            
            Author.Social.styles[social] = className
            
            if let darkBGColor = social.backgroundColor.dark, let darkColor = social.color.dark {
                dark = SocialStyle(className: className, backgroundColor: darkBGColor, color: darkColor)
            }
            
            return (light, dark)
        }
        
        let socialFilePath = context.rootURL
            .appending(path: resourcePath)
            .appending(path: socialFileName)
            .path()
        
        if FileManager.default.fileExists(atPath: socialFilePath) {
            try FileManager.default.removeItem(atPath: socialFilePath)
        }
        
        var content = """
            /* XXX THIS FILE WAS AUTO GENERATED. DO NOT CHANGE IT MANUAL */
            
            .socials li {
                display: flex;
                padding: 3px 6px;
                margin-right: 10px;
                font-size: 0.85em;
                border-radius: 8px;
                margin-bottom: 7px;
            }
            
            .socials {
                display: flex;
                cursor: pointer;
                padding-top: 10px;
            }
            
            .socials a {
                display: flex;
            }
            
            .socials img {
                width: 16px;
                height: 16px;
            }
            
            .socials span {
                padding-left: 8px;
            }
            
            \(tuple.map { self.socialStyle(for: $0.light) }.joined(separator: "\n\n"))
            """
        
        let stylesForDark: [String] = tuple.map {
            guard let dark = $0.dark else { return nil }
            return self.socialStyle(for: dark)
        }
            .compactMap { $0 }
        
        if !stylesForDark.isEmpty {
            content.append("\n\n@media(prefers-color-scheme: dark) {\n\n")
            
            for darkStyle in stylesForDark {
                let style = darkStyle.replacingOccurrences(of: "\n", with: "\n\t")
                content.append("\t\(style)\n\n")
            }
            content.append("}")
        }
        
        FileManager.default.createFile(atPath: socialFilePath, contents: content.data(using: .utf8))
    }
}

//extension Plugin where Site == Blog {
//    static func authorsPlugin(
//        resourceFolder: Path = "Resources",
//        styleOutputFolder: Path
//    ) -> Self {
//        Plugin(name: "Authors Plugin", installer: { context in
//            let folder = try context.folder(at: resourceFolder)
//            let file = try folder.file(at: "authors.json")
//            
//            let authors = try JSONDecoder().decode([Author].self, from: file.read())
//            
//            try Self.generateSocialStyleFile(
//                socials: Author.Social.Kind.allCases,
//                resourcePath: styleOutputFolder,
//                context: context
//            )
//            
//            let parser = context.markdownParser
//            context.allItems(sortedBy: \.date).forEach { item in
//                guard var author = authors.first(where: { item.metadata.author == $0.username }).map(AuthorItem.init) else {
//                    return
//                }
//                
//                let html = parser.html(from: author.description)
//                author.content = Content(
//                    title: author.name,
//                    description: author.description,
//                    body: Content.Body(html: html),
//                    date: Date(),
//                    lastModified: Date(),
//                    imagePath: context.site.imagePath,
//                    audio: nil,
//                    video: nil
//                )
//                
//                author.path = "authors/\(author.username)"
//                Item.authors[item.metadata] = author
//                
//                let page = Page(path: author.path, content: author.content)
//                Page.authors[page] = author
//                context.addPage(page)
//            }
//        })
//    }
//}
//
//fileprivate extension Plugin where Site == Blog {
//    
//    struct SocialStyle {
//        let className: String
//        let backgroundColor: Color
//        let color: Color
//    }
//    
//    private static func socialStyle(for social: SocialStyle) -> String {
//        """
//        .socials .\(social.className) {
//        \tbackground-color: \(social.backgroundColor.opacity(0.4).hexWithAlpha);
//        \tcolor: \(social.color.hexWithAlpha);
//        \tfont-weight: bold;
//        }
//        
//        .socials .\(social.className) img:hover {
//            fill: \(social.color.hexWithAlpha);
//        }
//        
//        .socials .\(social.className):hover {
//        \tbackground-color: \(social.backgroundColor.opacity(0.7).hexWithAlpha);
//        \tcolor: \(social.color.hexWithAlpha);
//        }
//        """
//    }
//    
//    private static func generateSocialStyleFile(
//        socials: [Author.Social.Kind],
//        resourcePath: Path,
//        context: PublishingContext<Blog>,
//        socialFileName: String = "socials.css"
//    ) throws {
//        let tuple: [(light: SocialStyle, dark: SocialStyle?)] = socials.map { social in
//            
//            let className = social.rawValue
//            
//            let light = SocialStyle(className: className, backgroundColor: social.backgroundColor, color: social.color)
//            
//            var dark: SocialStyle?
//            
//            Author.Social.styles[social] = className
//            
//            if let darkBGColor = social.backgroundColor.dark, let darkColor = social.color.dark {
//                dark = SocialStyle(className: className, backgroundColor: darkBGColor, color: darkColor)
//            }
//            
//            return (light, dark)
//        }
//        
//        if let folder = try? context.folder(at: resourcePath) {
//            if folder.containsFile(named: socialFileName) {
//                try folder.file(at: socialFileName).delete()
//            }
//            
//            let socialFile = try folder.createFile(at: socialFileName)
//            
//            var content = """
//            /* THIS FILE WAS AUTO GENERATED. DO NOT CHANGE IT MANUAL */
//
//            .socials li {
//                display: flex;
//                padding: 3px 6px;
//                margin-right: 10px;
//                font-size: 0.85em;
//                border-radius: 8px;
//                margin-bottom: 7px;
//            }
//
//            .socials {
//                display: flex;
//                cursor: pointer;
//                padding-top: 10px;
//            }
//            
//            .socials a {
//                display: flex;
//            }
//            
//            .socials img {
//                width: 16px;
//                height: 16px;
//            }
//            
//            .socials span {
//                padding-left: 8px;
//            }
//            
//            \(tuple.map { Self.socialStyle(for: $0.light) }.joined(separator: "\n\n"))
//            """
//            
//            let stylesForDark: [String] = tuple.map {
//                guard let dark = $0.dark else { return nil }
//                return Self.socialStyle(for: dark)
//            }
//            .compactMap { $0 }
//            
//            if !stylesForDark.isEmpty {
//                content.append("\n\n@media(prefers-color-scheme: dark) {\n\n")
//                
//                for darkStyle in stylesForDark {
//                    let style = darkStyle.replacingOccurrences(of: "\n", with: "\n\t")
//                    content.append("\t\(style)\n\n")
//                }
//                content.append("}")
//            }
//            
//            try socialFile.write(content)
//        }
//    }
//}
//
//extension PublishingContext where Site == Blog {
//    func items<T: Comparable>(
//        authoredBy author: AuthorItem,
//        sortedBy sortingKeyPath: KeyPath<Item<Site>, T>,
//        order: Publish.SortOrder = .ascending) -> [Item<Blog>] {
//        return self.allItems(sortedBy: sortingKeyPath, order: order).filter { $0.author == author }
//    }
//}
//
//extension Page: @retroactive Hashable {
//    public func hash(into hasher: inout Hasher) {
//        hasher.combine(self.path)
//        hasher.combine(self.content.title)
//    }
//    
//    nonisolated(unsafe) static var authors: [Page: AuthorItem] = [:]
//    
//    var author: AuthorItem? {
//        return Self.authors[self]
//    }
//}
//
//extension Item where Site == Blog {
//    nonisolated(unsafe) static var authors: [Blog.ItemMetadata: AuthorItem] = [:]
//    
//    var author: AuthorItem {
//        return Self.authors[self.metadata]!
//    }
//}
//
extension Author.Social {
    
    nonisolated(unsafe) internal static var styles: [Kind: String] = [:]
    
    var cssClass: String {
        return Self.styles[self.social]!
    }
}
