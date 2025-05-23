//
//  File.swift
//  
//
//  Created by v.prusakov on 4/15/20.
//

import Dependencies
import Foundation
import Ignite

struct AuthorEntity: Equatable {
    let name: String
    let avatar: String
    let description: String
    let socials: [AuthorDTO.Social]
    let username: String
    let path: String
    
    init(author: AuthorDTO) {
        self.name = author.name
        self.avatar = author.avatar
        self.description = author.description
        self.socials = author.socials
        self.username = author.username
        self.path = "/authors/\(author.username.lowercased().convertedToSlug())"
    }
}

@MainActor
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
        let authors = try JSONDecoder().decode([AuthorDTO].self, from: data)
        
        try self.generateSocialStyleFile(
            socials: AuthorDTO.Social.Kind.allCases
        )
        
        context.htmlModifier.add(ArticleHTMLModifier())
        let authorEntities = authors.map(AuthorEntity.init)
        context.authors = authorEntities
        
        authorEntities.forEach {
            context.additionalStaticPages.append(AuthorPage(author: $0))
        }
    }
}

private extension AuthorPlugin {
    func socialStyle(for social: SocialStyle) -> String {
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
    
    func generateSocialStyleFile(
        socials: [AuthorDTO.Social.Kind],
        resourcePath: String = "Assets/styles",
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
            
            AuthorDTO.Social.styles[social] = className
            
            if let darkBGColor = social.backgroundColor.dark, let darkColor = social.color.dark {
                dark = SocialStyle(className: className, backgroundColor: darkBGColor, color: darkColor)
            }
            
            return (light, dark)
        }
        
        let resourceFolder = try context.folder(at: resourcePath)
        let file = resourceFolder.file(at: socialFileName)
        
        if file.exists() {
            try file.delete()
        }
        
        var content = """
            /* THIS FILE WAS AUTO GENERATED. DO NOT CHANGE IT MANUAL */
            
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
        
        try resourceFolder.createFile(at: socialFileName, contents: content.data(using: .utf8))
    }
}

extension ArticleLoader {
    func items(
        authoredBy author: AuthorEntity
    ) -> [Article] {
        return self.all.filter { $0.metadata["author"] as! String == author.username }
    }
}

extension Ignite.PageMetadata: @retroactive Hashable {
    public static func == (lhs: PageMetadata, rhs: PageMetadata) -> Bool {
        lhs.description == rhs.description && lhs.title == rhs.title &&
        lhs.image == rhs.image && lhs.url == rhs.url
    }
    
    public func hash(into hasher: inout Hasher) {
        hasher.combine(self.image)
        hasher.combine(self.url)
        hasher.combine(self.title)
        hasher.combine(self.description)
    }
    
    nonisolated(unsafe) static var authors: [PageMetadata: AuthorEntity] = [:]
    
    var author: AuthorEntity? {
        return Self.authors[self]
    }
}
extension AuthorDTO.Social {
    
    nonisolated(unsafe) internal static var styles: [Kind: String] = [:]
    
    var cssClass: String {
        return Self.styles[self.social]!
    }
}
